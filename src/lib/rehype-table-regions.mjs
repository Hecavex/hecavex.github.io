function textContent(node) {
  if (node?.type === 'text' && typeof node.value === 'string') return node.value;
  return Array.isArray(node?.children) ? node.children.map(textContent).join('') : '';
}

function headerInfo(table) {
  const cells = [];
  function collect(node) {
    if (cells.length >= 8) return;
    if (node?.type === 'element' && node.tagName === 'th') {
      const value = textContent(node).replace(/\s+/g, ' ').trim();
      if (value) cells.push(value);
      return;
    }
    if (Array.isArray(node?.children)) for (const child of node.children) collect(child);
  }
  collect(table);
  return { count: cells.length, label: cells.length ? cells.join(' · ') : 'Data table' };
}

export default function rehypeTableRegions() {
  return (tree) => {
    function transform(parent) {
      if (!Array.isArray(parent?.children)) return;
      for (let index = 0; index < parent.children.length; index += 1) {
        const child = parent.children[index];
        if (child?.type === 'element' && child.tagName === 'table') {
          const header = headerInfo(child);
          const tableClasses = Array.isArray(child.properties?.className) ? child.properties.className : [];
          const wide = header.count >= 3 || tableClasses.includes('hx-table-wide');
          parent.children[index] = {
            type: 'element',
            tagName: 'div',
            properties: {
              className: ['table-scroll-region', ...(wide ? ['table-scroll-region--wide'] : [])],
              dataTableLabel: header.label,
              ...(wide ? { role: 'region', tabIndex: 0, ariaLabel: header.label } : {})
            },
            children: [
              { type: 'element', tagName: 'div', properties: { className: ['table-scroll-hint'], ariaHidden: 'true' }, children: [] },
              child
            ]
          };
          continue;
        }
        transform(child);
      }
    }

    transform(tree);
  };
}
