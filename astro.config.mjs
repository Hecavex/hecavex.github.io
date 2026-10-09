import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import rehypeEvidenceFigures from './src/lib/rehype-evidence-figures.mjs';
import rehypeTableRegions from './src/lib/rehype-table-regions.mjs';
import remarkKramdownAttributes from './src/lib/remark-kramdown-attributes.mjs';
import remarkCanonicalCode from './src/lib/remark-canonical-code.mjs';

// Code examples share the portfolio's dark surfaces and readable syntax tokens.
const hecavexCodeTheme = {
  name: 'hecavex-editorial-dark',
  type: 'dark',
  colors: {
    'editor.background': '#171b1d',
    'editor.foreground': '#ece9e1'
  },
  tokenColors: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#8d969a', fontStyle: 'italic' } },
    { scope: ['keyword', 'storage', 'storage.type', 'entity.name.tag'], settings: { foreground: '#55b9b1', fontStyle: 'bold' } },
    { scope: ['string', 'constant', 'support.constant', 'entity.other.attribute-name'], settings: { foreground: '#86b77e' } },
    { scope: ['entity.name.function', 'support.function', 'variable.language'], settings: { foreground: '#ece9e1', fontStyle: 'bold' } },
    { scope: ['invalid', 'invalid.illegal'], settings: { foreground: '#d06c65', fontStyle: 'bold underline' } }
  ]
};

export default defineConfig({
  site: 'https://hecavex.com',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  markdown: {
    processor: unified({ remarkPlugins: [remarkCanonicalCode, remarkKramdownAttributes], rehypePlugins: [rehypeEvidenceFigures, rehypeTableRegions] }),
    shikiConfig: { theme: hecavexCodeTheme, wrap: true }
  },
  security: { checkOrigin: true }
});
