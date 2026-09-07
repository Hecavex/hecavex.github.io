import { readFileSync } from 'node:fs';
import { resolve, sep } from 'node:path';

function imageDimensions(src) {
  if (typeof src !== 'string' || !src.startsWith('/assets/')) return '';
  const root = resolve('public');
  const path = resolve(root, `.${src}`);
  if (!path.startsWith(`${root}${sep}`)) return '';
  try {
    const bytes = readFileSync(path);
    if (bytes.length > 24 && bytes.subarray(1, 4).toString() === 'PNG') return ` (${bytes.readUInt32BE(16)} × ${bytes.readUInt32BE(20)} px)`;
    return '';
  } catch { return ''; }
}

function significantChildren(node) {
  return (node.children ?? []).filter((child) => child.type !== 'text' || child.value.trim());
}

export default function rehypeEvidenceFigures() {
  return (tree, file) => {
    const lt = String(file?.path ?? '').replaceAll('\\', '/').includes('/lt/');
    function transform(parent) {
      if (!Array.isArray(parent?.children)) return;
      for (let index = 0; index < parent.children.length; index += 1) {
        const child = parent.children[index];
        if (child?.type === 'element' && child.tagName === 'p') {
          const content = significantChildren(child);
          const image = content[0];
          let caption = content[1];
          let nextIndex = index + 1;
          while (parent.children[nextIndex]?.type === 'text' && !parent.children[nextIndex].value.trim()) nextIndex += 1;
          const next = parent.children[nextIndex];
          const nextContent = significantChildren(next ?? {});
          const separate = content.length === 1 && next?.tagName === 'p' && nextContent.length === 1 && nextContent[0]?.tagName === 'em';
          if (separate) caption = nextContent[0];
          if ((content.length === 2 || separate) && image?.type === 'element' && image.tagName === 'img' && caption?.type === 'element' && caption.tagName === 'em') {
            const original = typeof image.properties?.src === 'string' && image.properties.src.startsWith('/assets/')
              ? [{ type: 'text', value: ' ' }, { type: 'element', tagName: 'a', properties: { href: image.properties.src, className: ['evidence-original'] }, children: [{ type: 'text', value: (lt ? 'Atverti originalų vaizdą' : 'Open original image') + imageDimensions(image.properties.src) }] }] : [];
            parent.children[index] = {
              type: 'element',
              tagName: 'figure',
              properties: { className: ['hx-evidence-figure'] },
              children: [
                image,
                { type: 'element', tagName: 'figcaption', properties: {}, children: [...(caption.children ?? []), ...original] }
              ]
            };
            if (separate) parent.children.splice(index + 1, nextIndex - index);
            continue;
          }
        }
        transform(child);
      }
    }

    transform(tree);
  };
}
