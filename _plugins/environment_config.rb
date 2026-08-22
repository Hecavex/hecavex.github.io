# frozen_string_literal: true

Jekyll::Hooks.register :site, :after_init do |site|
  site.config["privacy_measurement_token"] = ENV.fetch("HECAVEX_ANALYTICS_TOKEN", "").strip
end
