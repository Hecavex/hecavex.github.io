const ATTRIBUTE_LINE = /^\{:\s*([.#][\w-]+(?:\s+[.#][\w-]+)*)\s*\}$/;
const TRAILING_ATTRIBUTE_LINE = /(?:^|\n)\{:\s*([.#][\w-]+(?:\s+[.#][\w-]+)*)\s*\}\s*$/;

function attributesFrom(value) {
  const properties = {};
  const classes = [];
  for (const token of value.trim().split(/\s+/)) {
    if (token.startsWith('.')) classes.push(token.slice(1));
    if (token.startsWith('#')) properties.id = token.slice(1);
  }
  if (classes.length) properties.className = classes;
  return properties;
}

function attach(node, value) {
  const attributes = attributesFrom(value);
  node.data ??= {};
  const existing = node.data.hProperties ?? {};
  const existingClasses = Array.isArray(existing.className)
    ? existing.className
    : typeof existing.className === 'string'
      ? existing.className.split(/\s+/).filter(Boolean)
      : [];
  const classes = [...new Set([...existingClasses, ...(attributes.className ?? [])])];
  node.data.hProperties = { ...existing, ...attributes, ...(classes.length ? { className: classes } : {}) };
}

function textContent(node) {
  if (typeof node?.value === 'string') return node.value;
  return Array.isArray(node?.children) ? node.children.map(textContent).join('') : '';
}

function consumeTableMarker(table) {
  const row = table.children?.at(-1);
  if (row?.type !== 'tableRow' || !Array.isArray(row.children) || row.children.length === 0) return false;
  const cells = row.children.map((cell) => textContent(cell).trim());
  const match = cells[0]?.match(ATTRIBUTE_LINE);
  if (!match || cells.slice(1).some(Boolean)) return false;
  attach(table, match[1]);
  table.children.pop();
  return true;
}

function consumeBlockquoteMarker(blockquote) {
  const paragraph = blockquote.children?.at(-1);
  if (paragraph?.type !== 'paragraph' || !Array.isArray(paragraph.children)) return false;
  for (let index = paragraph.children.length - 1; index >= 0; index -= 1) {
    const child = paragraph.children[index];
    if (child?.type !== 'text' || typeof child.value !== 'string') continue;
    const match = child.value.match(TRAILING_ATTRIBUTE_LINE);
    if (!match) return false;
    child.value = child.value.slice(0, match.index).trimEnd();
    if (!child.value) paragraph.children.splice(index, 1);
    attach(blockquote, match[1]);
    return true;
  }
  return false;
}

export default function remarkKramdownAttributes() {
  return (tree) => {
    function transform(parent) {
      if (!Array.isArray(parent.children)) return;

      for (const child of parent.children) {
        if (child?.type === 'table') consumeTableMarker(child);
        if (child?.type === 'blockquote') consumeBlockquoteMarker(child);
      }

      for (let index = parent.children.length - 1; index >= 0; index -= 1) {
        const child = parent.children[index];
        if (child?.type !== 'paragraph' || child.children?.length !== 1 || child.children[0]?.type !== 'text') continue;
        const match = child.children[0].value.match(ATTRIBUTE_LINE);
        if (!match || index === 0) continue;
        attach(parent.children[index - 1], match[1]);
        parent.children.splice(index, 1);
      }

      for (const child of parent.children) transform(child);
    }

    transform(tree);
  };
}
