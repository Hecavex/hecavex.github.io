# Performance budgets

The publication checks generated files directly after a production Astro build. The check is offline and deterministic: it measures exact file bytes and each file compressed independently with Node's level-9 gzip implementation. It does not depend on Lighthouse, a browser network profile, a CDN or a transient deployment.

The initial limits were set from the production build measured on 22 August 2026. They leave useful room for longer investigations while still stopping accidental framework bundles, uncompressed images, duplicate fonts and runaway page markup.

| Scope | Uncompressed limit | Gzip limit | Initial measured maximum or total |
|---|---:|---:|---:|
| One HTML document | 180 KiB | 48 KiB | 149.3 KiB / 38.2 KiB |
| One CSS file | 64 KiB | 12 KiB | 50.3 KiB / 8.4 KiB |
| One JavaScript file | 24 KiB | 8 KiB | 9.5 KiB / 2.7 KiB |
| All first-party CSS and JavaScript | 112 KiB | 24 KiB | 84.1 KiB / 15.9 KiB |
| One font file | 48 KiB | 48 KiB | 36.7 KiB / 36.7 KiB |
| All font files | 512 KiB | 512 KiB | 407.7 KiB / 408.0 KiB |
| One image | 384 KiB | 384 KiB | 304.6 KiB / 294.6 KiB |
| One SVG image | 32 KiB | 12 KiB | 8.8 KiB / 2.5 KiB |
| Complete public image archive | 32 MiB | 31 MiB | 21.89 MiB / 21.25 MiB |

The font bundle is also limited to 20 files; the baseline contains 18. Images are normally already compressed, so their gzip size remains close to the uncompressed file size. The archive-wide image limit is a deliberate review threshold rather than a permanent ceiling: legitimate new research will eventually require it to be raised, but that change should be reviewed alongside image optimization and archive growth.

Run the gate after building the site:

```sh
npm run build
npm run check:performance
```

To measure another output directory, pass it after `--`:

```sh
npm run check:performance -- path/to/generated-site
```

Budget values live in `scripts/check_performance_budgets.mjs`. Raise one only after measuring a current production build, identifying the files responsible and recording why the additional payload is justified.
