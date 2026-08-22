#!/usr/bin/env bash

set -euo pipefail

# Run the same HECAVEX checks locally and in CI from any working directory.
project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_dir"
site_dir="${SITE_DIR:-_site}"

bundle exec ruby tools/validate_content.rb
npm test
bundle exec jekyll clean
JEKYLL_ENV=production bundle exec jekyll build --destination "$site_dir"
bundle exec ruby tools/audit_site.rb "$site_dir"
node tools/audit_responsive.mjs "$site_dir"
