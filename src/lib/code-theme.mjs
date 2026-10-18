// Code examples share the portfolio's dark surfaces and readable syntax tokens.
export const codeTheme = {
  name: 'hecavex-editorial-dark',
  type: 'dark',
  colors: {
    'editor.background': '#171b1d',
    'editor.foreground': '#ece9e1'
  },
  tokenColors: [
    { name: 'comment', scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#8d969a', fontStyle: 'italic' } },
    { name: 'keyword', scope: ['keyword', 'storage', 'storage.type', 'entity.name.tag'], settings: { foreground: '#55b9b1', fontStyle: 'bold' } },
    { name: 'string', scope: ['string', 'constant', 'support.constant', 'entity.other.attribute-name'], settings: { foreground: '#86b77e' } },
    { name: 'function', scope: ['entity.name.function', 'support.function', 'variable.language'], settings: { foreground: '#ece9e1', fontStyle: 'bold' } },
    { name: 'invalid', scope: ['invalid', 'invalid.illegal'], settings: { foreground: '#d06c65', fontStyle: 'bold underline' } }
  ]
};

// Shiki writes token colours as inline style attributes, which would force
// CSP style-src 'unsafe-inline'. This transformer swaps every declaration for
// a class from public/assets/css/modules/foundation.css and fails the build on any
// declaration it does not know, so a theme change cannot silently need inline CSS.

const fixed = new Map([
  ['font-weight:bold', 'hx-code-bold'],
  ['font-style:italic', 'hx-code-italic'],
  ['text-decoration:underline', 'hx-code-underline'],
  ['user-select:none', 'hx-code-nosel'],
  // Block layout from Astro's `wrap: true`; foundation.css restates it on .astro-code.
  ['overflow-x:auto', ''],
  ['white-space:pre-wrap', ''],
  ['word-wrap:break-word', '']
]);

// One class per distinct colour; the first rule naming a colour owns it.
export const codeColorClasses = (theme) => {
  const classes = new Map([[theme.colors['editor.foreground'].toLowerCase(), 'hx-code-text']]);
  for (const rule of theme.tokenColors) {
    const color = rule.settings.foreground.toLowerCase();
    if (!classes.has(color)) classes.set(color, `hx-code-${rule.name}`);
  }
  return classes;
};

export function codeThemeClasses(theme) {
  const colors = codeColorClasses(theme);
  const background = theme.colors['editor.background'].toLowerCase();
  const classesFor = (style) => style.split(';').map((part) => part.replace(/\s+/g, '').toLowerCase()).filter(Boolean).map((declaration) => {
    const [property, value] = declaration.split(':');
    if (property === 'color' && colors.has(value)) return colors.get(value);
    if (property === 'background-color' && value === background) return '';
    if (fixed.has(declaration)) return fixed.get(declaration);
    throw new Error(`Unmapped Shiki inline style "${declaration}"; add a class to foundation.css and code-theme.mjs`);
  }).filter(Boolean);
  const visit = (node) => {
    if (node.type === 'element' && node.properties?.style !== undefined) {
      const added = classesFor(String(node.properties.style));
      delete node.properties.style;
      const existing = [node.properties.class ?? node.properties.className ?? []].flat().join(' ');
      const merged = [...new Set([...existing.split(/\s+/), ...added])].filter(Boolean);
      delete node.properties.className;
      if (merged.length) node.properties.class = merged.join(' ');
    }
    for (const child of node.children ?? []) visit(child);
  };
  return { name: 'hecavex-style-classes', root: visit };
}
