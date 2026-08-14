#!/usr/bin/env ruby
require "yaml"
require "date"

ALLOWED_LANGS = %w[en lt].freeze
ALLOWED_CATEGORIES = %w[threat-intelligence investigations fraud-scams osint malware social-engineering ai-security information-operations tradecraft commentary identity-security data-breaches security-briefings].freeze
ALLOWED_CONTENT_TYPES = %w[investigation malware-analysis incident-analysis technical-analysis technical-guide commentary threat-note signal-brief].freeze
EVIDENCE_BEARING_TYPES = %w[investigation malware-analysis incident-analysis technical-analysis technical-guide].freeze
errors = []
warnings = []
keys = {}

Dir.glob("_posts/**/*.{md,markdown}").sort.each do |path|
  raw = File.read(path, encoding: "UTF-8")
  match = raw.match(/\A---\s*\n(.*?)\n---/m)
  unless match
    errors << "#{path}: missing YAML front matter"
    next
  end
  data = YAML.safe_load(match[1], permitted_classes: [Date, Time], aliases: true) || {}
  next if data["draft"] == true
  lang = data["lang"]
  errors << "#{path}: lang must be en or lt" unless ALLOWED_LANGS.include?(lang)
  %w[title description translation_key].each { |field| errors << "#{path}: missing #{field}" if data[field].to_s.strip.empty? }
  content_type = data["content_type"].to_s
  errors << "#{path}: missing or invalid content_type" unless ALLOWED_CONTENT_TYPES.include?(content_type)
  if EVIDENCE_BEARING_TYPES.include?(content_type)
    %w[key_findings scope limitations].each do |field|
      value = data[field]
      missing = value.nil? || (value.respond_to?(:empty?) && value.empty?) || value.to_s.strip.empty?
      errors << "#{path}: evidence-bearing publication missing #{field}" if missing
    end
  end
  key = data["translation_key"]
  if key && lang
    pair = [key, lang]
    errors << "#{path}: duplicate translation_key #{key} for #{lang}" if keys[pair]
    keys[pair] = path
  end
  Array(data["categories"]).each { |category| errors << "#{path}: invalid category #{category}" unless ALLOWED_CATEGORIES.include?(category) }
  image = data["image"]
  errors << "#{path}: configured image requires alt text" if image.is_a?(Hash) && image["path"] && image["alt"].to_s.strip.empty?
  permalink = data["permalink"].to_s
  if lang == "lt" && permalink.start_with?("/lt/research/")
    errors << "#{path}: Lithuanian publication URLs must use /lt/tyrimai/"
  end
  Array(data["redirect_from"]).each do |redirect_path|
    errors << "#{path}: redirect_from must contain internal absolute paths" unless redirect_path.to_s.start_with?("/") && !redirect_path.to_s.start_with?("//")
  end
  if data["content_type"] == "signal-brief"
    %w[series issue coverage_start coverage_end information_cutoff].each do |field|
      errors << "#{path}: signal brief missing #{field}" if data[field].to_s.strip.empty?
    end
    errors << "#{path}: signal brief must use security-briefings category" unless Array(data["categories"]).include?("security-briefings")
  end
end

keys.keys.map(&:first).uniq.each do |key|
  langs = keys.keys.select { |item| item.first == key }.map(&:last)
  warnings << "#{key}: translation available only in #{langs.join(', ')}" if langs.length == 1
end
warnings.each { |message| warn "WARNING: #{message}" }
if errors.any?
  errors.each { |message| warn "ERROR: #{message}" }
  exit 1
end
puts "Content validation passed (#{keys.length} public localized posts)."
