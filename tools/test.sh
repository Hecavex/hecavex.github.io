#!/usr/bin/env bash

set -eu

SITE_DIR="_site"

bundle exec ruby tools/validate_content.rb
npm test
bundle exec jekyll clean
JEKYLL_ENV=production bundle exec jekyll build --destination "$SITE_DIR"
bundle exec ruby tools/audit_site.rb "$SITE_DIR"
node tools/audit_responsive.mjs "$SITE_DIR"
