# frozen_string_literal: true

module Hecavex
  module TaxonomyIndexability
    private

    def apply_indexability(site, post_count)
      minimum = site.config.fetch("taxonomy_min_index_count", 2).to_i
      return if post_count >= minimum

      data["sitemap"] = false
      data["robots"] = "noindex,follow"
    end
  end

  class LocalizedCategoryPage < Jekyll::PageWithoutAFile
    include TaxonomyIndexability

    def initialize(site, lang, slug, label, post_count)
      base = lang == "lt" ? "kategorijos" : "categories"
      super(site, site.source, File.join(lang, base, slug), "index.html")
      data["layout"] = "category-hx"
      data["lang"] = lang
      data["title"] = label
      data["description"] = lang == "lt" ? "HECAVEX publikacijos kategorijoje „#{label}“." : "HECAVEX publications in #{label}."
      data["category_slug"] = slug
      data["translation_key"] = "category-#{slug}"
      data["post_count"] = post_count
      apply_indexability(site, post_count)
    end
  end

  class LocalizedCategoriesGenerator < Jekyll::Generator
    safe true
    priority :low

    def generate(site)
      taxonomy = site.data.fetch("taxonomy", {})
      taxonomy.each do |slug, labels|
        %w[en lt].each do |lang|
          post_count = site.posts.docs.count do |post|
            post.data["lang"] == lang && Array(post.data["categories"]).include?(slug)
          end
          next if post_count.zero?

          site.pages << LocalizedCategoryPage.new(site, lang, slug, labels[lang], post_count)
        end
      end
    end
  end

  class LocalizedTagPage < Jekyll::PageWithoutAFile
    include TaxonomyIndexability

    def initialize(site, lang, tag, post_count)
      base = lang == "lt" ? "zymos" : "tags"
      slug = Jekyll::Utils.slugify(tag, mode: "latin")
      super(site, site.source, File.join(lang, base, slug), "index.html")
      data["layout"] = "tag-hx"
      data["lang"] = lang
      data["title"] = tag
      data["tag_name"] = tag
      data["tag_slug"] = slug
      data["description"] = lang == "lt" ? "HECAVEX publikacijos su žyma „#{tag}“." : "HECAVEX publications tagged #{tag}."
      data["translation_key"] = "tag-#{slug}"
      data["post_count"] = post_count
      apply_indexability(site, post_count)
    end
  end

  class LocalizedTagsGenerator < Jekyll::Generator
    safe true
    priority :low

    def generate(site)
      %w[en lt].each do |lang|
        tag_groups = {}

        site.posts.docs.select { |post| post.data["lang"] == lang }.each do |post|
          Array(post.data["tags"]).each do |tag|
            slug = Jekyll::Utils.slugify(tag, mode: "latin")
            tag_groups[slug] ||= { "label" => tag, "posts" => [] }
            tag_groups[slug]["posts"] << post
          end
        end

        tag_groups.each_value do |group|
          post_count = group["posts"].uniq.length
          site.pages << LocalizedTagPage.new(site, lang, group["label"], post_count)
        end
      end
    end
  end
end
