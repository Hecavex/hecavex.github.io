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

  if indexable
    errors << "#{relative}: missing meta description" if document.at_css('meta[name="description"]')&.[]("content").to_s.strip.empty?
    canonical = document.at_css('link[rel="canonical"]')&.[]("href").to_s
    errors << "#{relative}: missing canonical" if canonical.empty?
    errors << "#{relative}: duplicate canonical also used by #{canonicals[canonical]}" if !canonical.empty? && canonicals[canonical]
    canonicals[canonical] = relative unless canonical.empty?
    %w[og:title og:description og:url og:image og:image:width og:image:height og:image:alt].each do |property|
      errors << "#{relative}: missing #{property}" if document.at_css("meta[property='#{property}']")&.[]("content").to_s.strip.empty?
    end
    %w[twitter:card twitter:title twitter:description twitter:image twitter:image:alt].each do |name|
      errors << "#{relative}: missing #{name}" if document.at_css("meta[name='#{name}'],meta[property='#{name}']")&.[]("content").to_s.strip.empty?
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

if errors.any?
  warn errors.uniq.join("\n")
  exit 1
end

puts "Site audit passed: SEO, consolidated schema, social metadata, accessibility structure, links, fragments and assets."
