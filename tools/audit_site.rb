#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "nokogiri"
require "open3"
require "uri"

root = File.expand_path(ARGV.fetch(0, "_site"))
errors = []
canonicals = {}
inline_scripts = []
documents = {}
site_host = "hecavex.com"

png_dimensions = lambda do |path|
  bytes = File.binread(path, 24)
  next nil unless bytes.start_with?("\x89PNG\r\n\x1A\n".b) && bytes.bytesize >= 24

  [bytes.byteslice(16, 4).unpack1("N"), bytes.byteslice(20, 4).unpack1("N")]
rescue Errno::ENOENT, Errno::EACCES
  nil
end

resolve_reference = lambda do |raw, html|
  value = raw.to_s.strip
  return { local: false } if value.empty? || value.start_with?("mailto:", "tel:", "data:", "javascript:", "//")

  if value.match?(%r{\Ahttps?://}i)
    uri = URI.parse(value)
    return { local: false } unless %w[http https].include?(uri.scheme.downcase) && uri.host&.downcase == site_host

    clean = uri.path.to_s
    fragment = uri.fragment
  elsif value.match?(%r{\A[a-z][a-z0-9+.-]*:}i)
    return { local: false }
  else
    clean = value.split(/[?#]/, 2).first
    fragment = value.include?("#") ? value.split("#", 2).last : nil
  end

  clean = URI::DEFAULT_PARSER.unescape(clean)
  target = if clean.empty?
             html
           elsif clean.start_with?("/")
             File.join(root, clean.delete_prefix("/"))
           else
             File.expand_path(clean, File.dirname(html))
           end
  candidates = [target]
  candidates << File.join(target, "index.html") if File.extname(target).empty? || target.end_with?("/")
  candidates << "#{target}.html" if File.extname(target).empty?
  { local: true, target: candidates.find { |candidate| File.file?(candidate) }, fragment: fragment }
rescue URI::InvalidURIError, ArgumentError
  { local: true, target: nil, fragment: nil }
end

Dir.glob(File.join(root, "**", "*.html")).sort.each do |html|
  relative = html.delete_prefix(root).tr("\\", "/")
  document = Nokogiri::HTML(File.read(html, encoding: "UTF-8"))
  documents[html] = document
  robots = document.at_css('meta[name="robots"]')&.[]("content").to_s.downcase
  indexable = !robots.include?("noindex")

  errors << "#{relative}: missing html lang" if document.at_css("html")&.[]("lang").to_s.strip.empty?
  errors << "#{relative}: missing title" if document.at_css("title")&.text.to_s.strip.empty?
  duplicate_ids = document.css("[id]").group_by { |node| node["id"] }.select { |id, nodes| !id.to_s.empty? && nodes.length > 1 }.keys
  errors << "#{relative}: duplicate ids #{duplicate_ids.join(', ')}" unless duplicate_ids.empty?

  %w[aria-labelledby aria-describedby].each do |attribute|
    document.css("[#{attribute}]").each do |node|
      node[attribute].to_s.split.each do |id|
        errors << "#{relative}: #{attribute} references missing id #{id}" unless document.at_xpath("//*[@id=#{id.inspect}]")
      end
    end
  end

  document.css("script:not([src])").each_with_index do |script, index|
    type = script["type"].to_s
    next unless type.empty? || type == "text/javascript"
    next if script.text.strip.empty?

    inline_scripts << { path: relative, index: index + 1, source: script.text }
  end
  document.css("script[src]").each do |script|
    source = script["src"].to_s
    if source.match?(%r{cdn\.jsdelivr\.net/npm/(?:mermaid|mathjax)|mathjax}i)
      errors << "#{relative}: prohibited diagram or mathematics runtime #{source}"
    end
  end

  outline = document.at_css("#article-outline")
  if outline
    outline_panel = outline.ancestors("section").find { |section| section["class"].to_s.split.include?("hx-toc") }
    errors << "#{relative}: article outline must be hidden until local JavaScript populates it" unless outline_panel&.key?("hidden")
  end

  research_link = document.at_css('.hx-workspace-switcher a[href="/en/research/"],.hx-workspace-switcher a[href="/lt/tyrimai/"]')
  if research_link
    research_route = relative.start_with?("/en/research/", "/lt/tyrimai/")
    marked_current = research_link["aria-current"] == "page"
    errors << "#{relative}: Research network link has incorrect aria-current state" unless research_route == marked_current
  end

  if indexable
    errors << "#{relative}: missing meta description" if document.at_css('meta[name="description"]')&.[]("content").to_s.strip.empty?
    canonical = document.at_css('link[rel="canonical"]')&.[]("href").to_s
    errors << "#{relative}: missing canonical" if canonical.empty?
    errors << "#{relative}: duplicate canonical also used by #{canonicals[canonical]}" if !canonical.empty? && canonicals[canonical]
    canonicals[canonical] = relative unless canonical.empty?
    %w[og:title og:description og:url og:image og:image:width og:image:height og:image:alt].each do |property|
      nodes = document.css("meta[property='#{property}']")
      errors << "#{relative}: expected one #{property}, found #{nodes.length}" unless nodes.length == 1
      errors << "#{relative}: empty #{property}" if nodes.length == 1 && nodes.first["content"].to_s.strip.empty?
    end
    %w[twitter:card twitter:title twitter:description twitter:image twitter:image:alt].each do |name|
      nodes = document.css("meta[name='#{name}'],meta[property='#{name}']")
      errors << "#{relative}: expected one #{name}, found #{nodes.length}" unless nodes.length == 1
      errors << "#{relative}: empty #{name}" if nodes.length == 1 && nodes.first["content"].to_s.strip.empty?
    end

    og_image = document.at_css('meta[property="og:image"]')&.[]("content").to_s
    twitter_image = document.at_css('meta[name="twitter:image"],meta[property="twitter:image"]')&.[]("content").to_s
    errors << "#{relative}: Open Graph and Twitter images differ" unless og_image.empty? || og_image == twitter_image
    errors << "#{relative}: social image must be a PNG" unless URI.parse(og_image).path.to_s.downcase.end_with?(".png")
    errors << "#{relative}: og:image:width must be 1200" unless document.at_css('meta[property="og:image:width"]')&.[]("content") == "1200"
    errors << "#{relative}: og:image:height must be 630" unless document.at_css('meta[property="og:image:height"]')&.[]("content") == "630"
    begin
      preview_uri = URI.parse(og_image)
      if preview_uri.host&.downcase == site_host
        preview_path = File.join(root, URI::DEFAULT_PARSER.unescape(preview_uri.path).delete_prefix("/"))
        dimensions = png_dimensions.call(preview_path)
        errors << "#{relative}: social image is missing or not a valid PNG (#{preview_uri.path})" unless dimensions
        errors << "#{relative}: social image must be 1200x630, found #{dimensions&.join('x')}" if dimensions && dimensions != [1200, 630]
      else
        errors << "#{relative}: social image must be hosted on #{site_host}"
      end
    rescue URI::InvalidURIError
      errors << "#{relative}: invalid social image URL #{og_image}"
    end
    scripts = document.css('script[type="application/ld+json"]')
    errors << "#{relative}: expected one consolidated JSON-LD graph, found #{scripts.length}" unless scripts.length == 1
    scripts.each do |script|
      begin
        data = JSON.parse(script.text)
        graph = data["@graph"]
        errors << "#{relative}: JSON-LD is not an @graph" unless graph.is_a?(Array)
        ids = Array(graph).filter_map { |node| node["@id"] }
        expected_ids = %w[
          https://hecavex.com/#organization
          https://hecavex.com/#deividas-lis
          https://hecavex.com/#website
          https://apt.hecavex.com/#website
          https://labs.hecavex.com/#website
          https://radar.hecavex.com/#website
        ]
        missing_ids = expected_ids - ids
        errors << "#{relative}: graph is missing shared HECAVEX identities: #{missing_ids.join(', ')}" unless missing_ids.empty?
      rescue JSON::ParserError => error
        errors << "#{relative}: invalid JSON-LD (#{error.message.lines.first.strip})"
      end
    end
    errors << "#{relative}: expected exactly one main landmark" unless document.css("main").length == 1
    errors << "#{relative}: missing h1" if document.css("h1").empty?
  end

  document.css("img").each { |image| errors << "#{relative}: image missing alt attribute" unless image.key?("alt") }
  document.css("input,select,textarea").each do |control|
    id = control["id"].to_s
    labelled = control["aria-label"] || control["aria-labelledby"] || control.ancestors("label").any? || (!id.empty? && document.at_css("label[for='#{id}']"))
    errors << "#{relative}: form control #{id.empty? ? control.name : id} has no accessible label" unless labelled
  end
  document.css("a[href],button,summary").each do |control|
    labelled_by = control["aria-labelledby"].to_s.split.filter_map { |id| document.at_xpath("//*[@id=#{id.inspect}]")&.text }.join(" ")
    visible_text = control.xpath('.//text()[not(ancestor::*[@aria-hidden="true"])]').text
    image_alt = control.css("img[alt]").map { |image| image["alt"] }.join(" ")
    accessible_name = [control["aria-label"], labelled_by, visible_text, image_alt, control["title"]].compact.join(" ").strip
    errors << "#{relative}: #{control.name} has no accessible name" if accessible_name.empty?
  end
  package = document.at_css(".hx-research-package")
  if package
    errors << "#{relative}: research package is missing its stable publication ID" if package.at_css(".hx-research-record .hx-mono")&.text.to_s.strip.empty?
    errors << "#{relative}: research package has fewer than eight standard metadata fields" if package.css(".hx-research-record > div").length < 8
    errors << "#{relative}: research package is missing visible update history" unless document.at_css(".hx-updates")
  end
  document.css("[href],[src]").each do |node|
    raw = node["href"] || node["src"]
    reference = resolve_reference.call(raw, html)
    next unless reference[:local]

    unless reference[:target]
      errors << "#{relative}: unresolved internal reference #{raw}"
      next
    end

    fragment = URI::DEFAULT_PARSER.unescape(reference[:fragment].to_s)
    next if fragment.empty? || File.extname(reference[:target]).downcase != ".html"

    target_document = documents[reference[:target]] ||= Nokogiri::HTML(File.read(reference[:target], encoding: "UTF-8"))
    anchors = target_document.css("[id],[name]").flat_map { |anchor| [anchor["id"], anchor["name"]] }.compact
    errors << "#{relative}: unresolved fragment #{raw}" unless anchors.include?(fragment)
  end
end

Dir.glob(File.join(root, "**", "*.xml")).sort.each do |xml|
  begin
    Nokogiri::XML(File.read(xml, encoding: "UTF-8")) { |config| config.strict }
  rescue Nokogiri::XML::SyntaxError => error
    relative = xml.delete_prefix(root).tr("\\", "/")
    errors << "#{relative}: invalid XML (#{error.message.lines.first.strip})"
  end
end

sitemap_path = File.join(root, "sitemap.xml")
if File.file?(sitemap_path)
  sitemap = File.read(sitemap_path, encoding: "UTF-8")
  %w[hecavex-media-kit-en.html hecavex-media-kit-lt.html].each do |filename|
    errors << "sitemap.xml: downloadable media asset is indexed (#{filename})" if sitemap.include?(filename)
  end
  %w[/en/projects/ /lt/projektai/ /en/glossary/ /lt/zodynas/].each do |public_path|
    errors << "sitemap.xml: missing public portfolio page #{public_path}" unless sitemap.include?("https://hecavex.com#{public_path}")
  end
else
  errors << "sitemap.xml: missing"
end

{
  "assets/media/hecavex-media-kit-en.html" => "https://hecavex.com/en/speaker/",
  "assets/media/hecavex-media-kit-lt.html" => "https://hecavex.com/lt/pranesejas/"
}.each do |path, expected_canonical|
  html = File.join(root, path)
  unless File.file?(html)
    errors << "#{path}: downloadable media kit missing"
    next
  end

  document = documents[html] ||= Nokogiri::HTML(File.read(html, encoding: "UTF-8"))
  robots = document.at_css('meta[name="robots"]')&.[]("content").to_s.downcase
  description = document.at_css('meta[name="description"]')&.[]("content").to_s.strip
  canonical = document.at_css('link[rel="canonical"]')&.[]("href").to_s
  errors << "#{path}: downloadable media kit must be noindex" unless robots.include?("noindex")
  errors << "#{path}: downloadable media kit is missing a description" if description.empty?
  errors << "#{path}: expected canonical #{expected_canonical}, found #{canonical}" unless canonical == expected_canonical
end

unless inline_scripts.empty?
  checker = <<~JAVASCRIPT
    const fs = require('node:fs');
    const scripts = JSON.parse(fs.readFileSync(0, 'utf8'));
    const invalid = [];
    for (const script of scripts) {
      try {
        new Function(script.source);
      } catch (error) {
        invalid.push({ path: script.path, index: script.index, message: error.message });
      }
    }
    process.stdout.write(JSON.stringify(invalid));
  JAVASCRIPT
  output, error, status = Open3.capture3("node", "-e", checker, stdin_data: JSON.generate(inline_scripts))
  if status.success?
    JSON.parse(output).each do |failure|
      errors << "#{failure['path']}: inline script #{failure['index']} has invalid JavaScript (#{failure['message']})"
    end
  else
    errors << "inline JavaScript audit could not run (#{error.lines.first.to_s.strip})"
  end
end

owned_stylesheet = File.join(root, "assets", "css", "hecavex.css")
if File.file?(owned_stylesheet)
  css = File.read(owned_stylesheet, encoding: "UTF-8")
  hx_classes = documents.values.flat_map do |document|
    document.css("[class]").flat_map { |node| node["class"].to_s.split.grep(/\Ahx-/) }
  end.uniq.sort
  structural_classes = %w[
    hx-author-proof hx-briefings-head hx-research-head hx-tag-index hx-topic-head hx-workspace-switcher
  ]
  unstyled = hx_classes.reject do |class_name|
    exact_selector = css.match?(/\.#{Regexp.escape(class_name)}(?![a-zA-Z0-9_-])/)
    base_class = class_name.split("--", 2).first
    styled_modifier = class_name.include?("--") && css.match?(/\.#{Regexp.escape(base_class)}(?![a-zA-Z0-9_-])/)
    exact_selector || styled_modifier || structural_classes.include?(class_name)
  end
  errors << "owned stylesheet has no selector for: #{unstyled.join(', ')}" unless unstyled.empty?
else
  errors << "owned stylesheet is missing"
end

if errors.any?
  warn errors.uniq.join("\n")
  exit 1
end

puts "Site audit passed: SEO, schema, social metadata, accessibility, links, fragments, XML, assets and owned component styles."
