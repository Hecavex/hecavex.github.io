# frozen_string_literal: true

require "cgi"
require "json"
require "set"

module Hecavex
  class StaticRedirectPage < Jekyll::PageWithoutAFile
    def initialize(site, source_path, target_path, lang = "en")
      directory, filename = output_location(source_path)
      super(site, site.source, directory, filename)

      data["layout"] = nil
      data["sitemap"] = false
      data["robots"] = "noindex,follow"
      data["permalink"] = source_path

      absolute_target = "#{site.config.fetch('url')}#{target_path}"
      escaped_target = CGI.escapeHTML(absolute_target)
      escaped_path = CGI.escapeHTML(target_path)
      message = lang == "lt" ? "Publikacija perkelta." : "This publication has moved."
      link_text = lang == "lt" ? "Atverti naują adresą" : "Continue to the new address"

      self.content = <<~HTML
        <!doctype html>
        <html lang="#{CGI.escapeHTML(lang)}">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <meta name="robots" content="noindex,follow">
            <meta http-equiv="refresh" content="0; url=#{escaped_target}">
            <link rel="canonical" href="#{escaped_target}">
            <title>#{CGI.escapeHTML(message)} | HECAVEX</title>
            <script>location.replace(#{target_path.to_json});</script>
          </head>
          <body>
            <p>#{CGI.escapeHTML(message)} <a href="#{escaped_path}">#{CGI.escapeHTML(link_text)}</a>.</p>
          </body>
        </html>
      HTML
    end

    private

    def output_location(source_path)
      clean_path = source_path.sub(%r{\A/}, "")
      return [clean_path.sub(%r{/\z}, ""), "index.html"] if clean_path.end_with?("/")

      [File.dirname(clean_path), File.basename(clean_path)]
    end
  end

  class RedirectsGenerator < Jekyll::Generator
    safe true
    priority :low

    def generate(site)
      redirects = Array(site.data["redirects"]).dup

      site.posts.docs.each do |post|
        Array(post.data["redirect_from"]).each do |source_path|
          redirects << {
            "from" => source_path,
            "to" => post.url,
            "lang" => post.data["lang"]
          }
        end
      end

      seen = Set.new
      redirects.each do |redirect|
        source_path = normalized_path(redirect.fetch("from"))
        target_path = normalized_path(redirect.fetch("to"))
        next if source_path == target_path || seen.include?(source_path)

        site.pages << StaticRedirectPage.new(site, source_path, target_path, redirect.fetch("lang", "en"))
        seen << source_path
      end
    end

    private

    def normalized_path(path)
      value = path.to_s.strip
      raise ArgumentError, "redirect paths must be internal absolute paths" unless value.start_with?("/") && !value.start_with?("//")

      value
    end
  end
end
