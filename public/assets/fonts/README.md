# Self-hosted fonts

HECAVEX serves its interface fonts from this directory so a page view does not request font files from a third-party CDN.

The WOFF2 files are selected Latin and Latin Extended subsets from the Fontsource 5.3.0 distributions:

- **Inter** — `@fontsource/inter`, normal weights 400–700 and italic weight 400. Upstream project: <https://github.com/rsms/inter>. Fontsource package: <https://fontsource.org/fonts/inter>.
- **IBM Plex Mono** — `@fontsource/ibm-plex-mono`, normal weights 400–700. Upstream project: <https://github.com/IBM/plex>. Fontsource package: <https://fontsource.org/fonts/ibm-plex-mono>.

Both families are distributed under the SIL Open Font License 1.1. The complete license texts and upstream copyright notices are retained in [`INTER-OFL.txt`](INTER-OFL.txt) and [`IBM-PLEX-MONO-OFL.txt`](IBM-PLEX-MONO-OFL.txt). The font binaries are unmodified; only the required families, subsets, styles and weights are included.
