# frozen_string_literal: true

module Hecavex
  class HomepageLastmodGenerator < Jekyll::Generator
    safe true
    priority :highest

    def generate(site)
      site.pages.each do |page|
        next unless %w[home landing].include?(page.data["layout"])

        posts = site.posts.docs
        posts = posts.select { |post| post.data["lang"] == page.data["lang"] } if page.data["lang"]
        latest = posts.filter_map { |post| post.data["last_modified_at"] || post.date }.max
        page.data["last_modified_at"] = latest if latest
      end
    end
  end
end
