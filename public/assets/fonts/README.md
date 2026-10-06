# Self-hosted fonts

HECAVEX serves its interface fonts from this directory so a page view does not request font files from a third-party CDN.

The WOFF2 files are selected Latin and Latin Extended subsets from the Fontsource 5.3.0 distributions:

- **Inter** — `@fontsource/inter`, normal weights 400–700 and italic weight 400. Upstream project: <https://github.com/rsms/inter>. Fontsource package: <https://fontsource.org/fonts/inter>.
- **IBM Plex Mono** — `@fontsource/ibm-plex-mono`, normal weights 400–700. Upstream project: <https://github.com/IBM/plex>. Fontsource package: <https://fontsource.org/fonts/ibm-plex-mono>.
- **Space Grotesk** — `@fontsource-variable/space-grotesk@5.3.0`, variable normal weights 300–700, Latin and Latin Extended. Fontsource package: <https://fontsource.org/fonts/space-grotesk>. Installed from the npm package without executing package scripts; original font bytes are retained. Package SHA-1: `f35f8915850afbefe92b0fe15b1db49928e55186`.

All three families are distributed under the SIL Open Font License 1.1. Complete license texts and upstream copyright notices are retained in [`INTER-OFL.txt`](INTER-OFL.txt), [`IBM-PLEX-MONO-OFL.txt`](IBM-PLEX-MONO-OFL.txt) and [`space-grotesk/LICENSE`](space-grotesk/LICENSE). Font binaries are unmodified; only required families, subsets, styles and weights are included.
