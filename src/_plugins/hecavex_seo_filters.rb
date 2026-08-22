# frozen_string_literal: true

module HecavexSeoFilters
  # Keep jekyll-seo-tag's canonical and social metadata while removing its
  # standalone JSON-LD in favour of the richer HECAVEX entity graph.
  def strip_json_ld(input)
    input.to_s.gsub(%r{<script type="application/ld\+json">.*?</script>}m, "")
  end

  # The publication head owns preview images so every page emits one complete,
  # dimensionally accurate Open Graph/Twitter image set.
  def strip_preview_metadata(input)
    input.to_s.gsub(
      %r{<meta\s+(?:name|property)="(?:og:image(?::[^"]+)?|twitter:card|twitter:image(?::[^"]+)?)"[^>]*?/?>\s*}i,
      ""
    )
  end
end

Liquid::Template.register_filter(HecavexSeoFilters)
