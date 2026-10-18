import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import rehypeEvidenceFigures from './src/lib/rehype-evidence-figures.mjs';
import rehypeTableRegions from './src/lib/rehype-table-regions.mjs';
import remarkKramdownAttributes from './src/lib/remark-kramdown-attributes.mjs';
import remarkCanonicalCode from './src/lib/remark-canonical-code.mjs';
import { codeTheme, codeThemeClasses } from './src/lib/code-theme.mjs';

export default defineConfig({
  site: 'https://hecavex.com',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  markdown: {
    processor: unified({ remarkPlugins: [remarkCanonicalCode, remarkKramdownAttributes], rehypePlugins: [rehypeEvidenceFigures, rehypeTableRegions] }),
    shikiConfig: { theme: codeTheme, wrap: true, transformers: [codeThemeClasses(codeTheme)] }
  },
  security: { checkOrigin: true }
});
