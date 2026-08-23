function significantChildren(node) {
  return (node.children ?? []).filter((child) => child.type !== 'text' || child.value.trim());
}

export default function rehypeEvidenceFigures() {
  return (tree) => {
    function transform(parent) {
      if (!Array.isArray(parent?.children)) return;
      for (let index = 0; index < parent.children.length; index += 1) {
        const child = parent.children[index];
        if (child?.type === 'element' && child.tagName === 'p') {
          const content = significantChildren(child);
          const image = content[0];
          const caption = content[1];
          if (content.length === 2 && image?.type === 'element' && image.tagName === 'img' && caption?.type === 'element' && caption.tagName === 'em') {
            parent.children[index] = {
              type: 'element',
              tagName: 'figure',
              properties: { className: ['hx-evidence-figure'] },
              children: [
                image,
                { type: 'element', tagName: 'figcaption', properties: {}, children: caption.children ?? [] }
              ]
            };
            continue;
          }
        }
        transform(child);
      }
    }

    transform(tree);
  };
}
