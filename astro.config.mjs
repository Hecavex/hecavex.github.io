import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkKramdownAttributes from './src/lib/remark-kramdown-attributes.mjs';

export default defineConfig({
  site: 'https://hecavex.com',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  markdown: {
    processor: unified({ remarkPlugins: [remarkKramdownAttributes] }),
    shikiConfig: { theme: 'github-dark-default', wrap: true }
  },
  security: { checkOrigin: true }
});
