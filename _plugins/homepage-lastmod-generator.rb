# frozen_string_literal: true

require "time"

module Hecavex
  class HomepageLastmodGenerator < Jekyll::Generator
    safe true
    priority :highest

    def generate(site)
      site.pages.each do |page|
        next unless %w[home landing].include?(page.data["layout"])

        posts = site.posts.docs
        posts = posts.select { |post| post.data["lang"] == page.data["lang"] } if page.data["lang"]
        candidates = posts.filter_map { |post| normalized_time(post.data["last_modified_at"] || post.date) }
        candidates << normalized_time(page.data["last_modified_at"])
        candidates.compact!
        page.data["last_modified_at"] = candidates.max unless candidates.empty?
      end
    end

    private

    def normalized_time(value)
      return value.to_time if value.respond_to?(:to_time)

      Time.parse(value.to_s) unless value.nil?
    rescue ArgumentError
      nil
    end
  end
end
