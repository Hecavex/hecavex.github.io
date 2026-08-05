#!/usr/bin/env ruby

require 'cgi'
require 'net/http'
require 'uri'
require 'yaml'

FEED_URL = URI('https://apt.hecavex.com/feed.xml')
OUTPUT = File.expand_path('../_data/apt_notes_live.yml', __dir__)

def value(entry, element)
  match = entry.match(%r{<#{element}(?:\s[^>]*)?>(.*?)</#{element}>}m)
  CGI.unescapeHTML(match ? match[1].gsub(%r{<[^>]+>}, '').strip : '')
end

begin
  response = Net::HTTP.start(FEED_URL.host, FEED_URL.port, use_ssl: true, open_timeout: 5, read_timeout: 10) do |http|
    http.get(FEED_URL.request_uri, 'User-Agent' => 'HECAVEX-Pages-Build/1.0')
  end
  raise "HTTP #{response.code}" unless response.is_a?(Net::HTTPSuccess)

  entry = response.body.match(%r{<entry>(.*?)</entry>}m)&.captures&.first
  raise 'feed contains no entry' unless entry

  link = entry.match(%r{<link\s+href="([^"]+)"})&.captures&.first.to_s
  raise 'entry URL is outside apt.hecavex.com' unless link.start_with?('https://apt.hecavex.com/')

  record = {
    'title' => value(entry, 'title')[0, 180],
    'summary' => value(entry, 'summary')[0, 320],
    'url' => link,
    'date' => value(entry, 'updated')[0, 10],
    'type' => 'Knowledge-base update'
  }
  File.write(OUTPUT, record.to_yaml, mode: 'w', encoding: 'UTF-8')
  puts "Synced latest APT Notes entry: #{record['title']}"
rescue StandardError => error
  warn "APT Notes sync unavailable; using committed fallback (#{error.message})"
end
