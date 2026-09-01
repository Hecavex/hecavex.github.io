import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import rehypeEvidenceFigures from './src/lib/rehype-evidence-figures.mjs';
import rehypeTableRegions from './src/lib/rehype-table-regions.mjs';
import remarkKramdownAttributes from './src/lib/remark-kramdown-attributes.mjs';

// Keep code examples inside the same editorial colour system as the article.
// The previous bundled dark theme produced a near-black slab and introduced a
// second, unrelated syntax palette. This deliberately restrained light theme
// uses weight and the ink/rule contrast to express syntax without sacrificing
// legibility on the paper reading surface.
const hecavexCodeTheme = {
  name: 'hecavex-editorial-light',
  type: 'light',
  colors: {
    'editor.background': '#ece9e1',
    'editor.foreground': '#151719'
  },
  tokenColors: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#30383b', fontStyle: 'italic' } },
    { scope: ['keyword', 'storage', 'storage.type', 'entity.name.tag'], settings: { foreground: '#151719', fontStyle: 'bold' } },
    { scope: ['string', 'constant', 'support.constant', 'entity.other.attribute-name'], settings: { foreground: '#30383b' } },
    { scope: ['entity.name.function', 'support.function', 'variable.language'], settings: { foreground: '#151719', fontStyle: 'bold' } },
    { scope: ['invalid', 'invalid.illegal'], settings: { foreground: '#151719', fontStyle: 'bold underline' } }
  ]
};

export default defineConfig({
  site: 'https://hecavex.com',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  markdown: {
    processor: unified({ remarkPlugins: [remarkKramdownAttributes], rehypePlugins: [rehypeEvidenceFigures, rehypeTableRegions] }),
    shikiConfig: { theme: hecavexCodeTheme, wrap: true }
  },
  security: { checkOrigin: true }
});
