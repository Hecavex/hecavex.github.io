#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "nokogiri"
require "uri"

root = File.expand_path(ARGV.fetch(0, "_site"))
errors = []
canonicals = {}

resolve_local = lambda do |raw, html|
  clean = raw.to_s.split(/[?#]/, 2).first
  return true if clean.empty? || clean.start_with?("#", "mailto:", "tel:", "data:", "javascript:", "//") || clean.match?(%r{\Ahttps?://})
  clean = URI.decode_www_form_component(clean)
  target = clean.start_with?("/") ? File.join(root, clean.delete_prefix("/")) : File.expand_path(clean, File.dirname(html))
  candidates = [target]
  candidates << File.join(target, "index.html") if File.extname(target).empty? || target.end_with?("/")
  candidates << "#{target}.html" if File.extname(target).empty?
  candidates.any? { |candidate| File.file?(candidate) }
rescue ArgumentError
  false
end

Dir.glob(File.join(root, "**", "*.html")).sort.each do |html|
  relative = html.delete_prefix(root).tr("\\", "/")
  document = Nokogiri::HTML(File.read(html, encoding: "UTF-8"))
  robots = document.at_css('meta[name="robots"]')&.[]("content").to_s.downcase
  indexable = !robots.include?("noindex")

  errors << "#{relative}: missing html lang" if document.at_css("html")&.[]("lang").to_s.strip.empty?
  errors << "#{relative}: missing title" if document.at_css("title")&.text.to_s.strip.empty?

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
  package = document.at_css(".hx-research-package")
  if package
    errors << "#{relative}: research package is missing its stable publication ID" if package.at_css(".hx-research-record .hx-mono")&.text.to_s.strip.empty?
    errors << "#{relative}: research package has fewer than eight standard metadata fields" if package.css(".hx-research-record > div").length < 8
    errors << "#{relative}: research package is missing visible update history" unless document.at_css(".hx-updates")
  end
  document.css("[href],[src]").each do |node|
    raw = node["href"] || node["src"]
    errors << "#{relative}: unresolved internal reference #{raw}" unless resolve_local.call(raw, html)
  end
end

if errors.any?
  warn errors.uniq.join("\n")
  exit 1
end

puts "Site audit passed: SEO, consolidated schema, social metadata, accessibility structure, links and assets."
