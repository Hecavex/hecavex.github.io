# HECAVEX customization map

## Baseline

- Full theme fork, not Chirpy Starter.
- `jekyll-theme-chirpy` 7.6.0.
- Jekyll 4.4.1 from `Gemfile.lock` (theme requirement is `~> 4.3`).
- GitHub Pages deployment through `.github/workflows/pages-deploy.yml`.

## Architecture

All localized public content uses `/en/` or `/lt/`. `_data/hecavex/` holds publication interface strings, `_data/navigation/` holds language-specific navigation, and `_data/taxonomy.yml` maps stable category IDs to localized labels. Posts use `lang` and `translation_key`; `_includes/language-switcher.html` searches posts and pages for a direct peer, falling back to the selected-language homepage only when no peer exists.

Separate feed and search endpoints are generated per language. `_includes/hreflang.html` supplies valid direct alternates and the root landing is `x-default`. `_includes/head.html` adds locale metadata and localized JSON-LD.

## Overrides

- `_config.yml`: production identity, domain, timezone, localized post permalink/defaults, disabled comments/archives.
- `_layouts/default.html`: skip link, main target, accessible back-to-top label.
- `_layouts/home.html`, `research.html`, `taxonomy.html`, `archive-hx.html`, `landing.html`, `feed-hx.xml`: publication and language-aware pages.
- `_layouts/post.html`: intelligence metadata, translation state, update history.
- `_includes/sidebar.html`, `footer.html`, `head.html`, `search-loader.html`: branded navigation, localized discovery and metadata.
- `assets/css/jekyll-theme-chirpy.scss`: centralized HECAVEX tokens and responsive components.
- `.github/workflows/pages-deploy.yml`: content validation and asset build gates.

New page sources live in `en/` and `lt/`. Authoring starters live in `_templates/`; structural checks live in `tools/validate_content.rb`. Brand assets live under `assets/img/brand`, `assets/img/favicons`, and `assets/img/og`.

## Colour system

All dark and light brand colours are defined in `_sass/hecavex/_colors.scss`. Future palette changes should be made there rather than in layouts or generated CSS. Components consume semantic roles:

- `--hx-bg`, `--hx-sidebar`, and `--hx-surface-1` through `--hx-surface-3` control elevation;
- `--hx-text`, `--hx-text-soft`, `--hx-text-muted`, and `--hx-text-faint` control hierarchy;
- `--hx-ember` is reserved for brand actions, active navigation and critical findings;
- `--hx-steel` is used for links, references and assessment states;
- `--hx-bronze` identifies categories, classifications and intelligence metadata;
- `--hx-success`, `--hx-warning`, `--hx-danger`, and `--hx-info` are status roles.

The partial also maps these roles onto Chirpy's native variables so upstream components inherit the same palette. Component behaviour and layout remain in `assets/css/jekyll-theme-chirpy.scss`; that file should reference roles and must not introduce independent brand colours.

## Upgrade procedure

1. Create a branch and compare the next Chirpy release against 7.6.0.
2. Update upstream files while retaining the overrides listed above.
3. Pay special attention to `head.html`, `default.html`, sidebar JavaScript selectors and the asset pipeline.
4. Run content validation, Node lint/build, the production Jekyll build and HTMLProofer.
5. Inspect `/`, `/en/`, `/lt/`, paired and unpaired posts, both feeds, both search JSON files, canonical tags and hreflang.

Known limitation: Jekyll Archives is disabled because its stock generator cannot emit clean language-prefixed, localized taxonomy routes. The localized category index remains available; per-category generated detail pages can be added with a dedicated generator when content volume justifies them.
