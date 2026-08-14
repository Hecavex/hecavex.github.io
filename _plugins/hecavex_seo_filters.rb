# frozen_string_literal: true

module HecavexSeoFilters
  # Keep jekyll-seo-tag's canonical and social metadata while removing its
  # standalone JSON-LD in favour of the richer HECAVEX entity graph.
  def strip_json_ld(input)
    input.to_s.gsub(%r{<script type="application/ld\+json">.*?</script>}m, "")
  end
end

Liquid::Template.register_filter(HecavexSeoFilters)
