import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import rehypeEvidenceFigures from './src/lib/rehype-evidence-figures.mjs';
import rehypeTableRegions from './src/lib/rehype-table-regions.mjs';
import remarkKramdownAttributes from './src/lib/remark-kramdown-attributes.mjs';

export default defineConfig({
  site: 'https://hecavex.com',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  markdown: {
    processor: unified({ remarkPlugins: [remarkKramdownAttributes], rehypePlugins: [rehypeEvidenceFigures, rehypeTableRegions] }),
    shikiConfig: { theme: 'github-dark-default', wrap: true }
  },
  security: { checkOrigin: true }
});
