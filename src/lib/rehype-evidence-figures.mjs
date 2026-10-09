import { readFileSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { parse } from 'yaml';
import { imageDimensions as intrinsicDimensions } from './image-dimensions.mjs';

export function removeRepeatedOpeningIllustration(tree, image) {
  if (!image || typeof image !== 'object' || image.presentation !== 'illustration') return;
  const openingIndex = (tree.children ?? []).findIndex((child) => child.type !== 'text' || child.value.trim());
  const opening = tree.children?.[openingIndex];
  if (opening?.type !== 'element' || opening.tagName !== 'p') return;
  const content = significantChildren(opening);
  const cover = image.hero ?? image.path;
  if (content[0]?.tagName !== 'img' || content[0].properties?.src !== cover) return;
  // The same editorial image is now shown at the article opening. Remove only
  // that repeated image node; retain every caption, paragraph and source anchor.
  const imageIndex = opening.children.indexOf(content[0]);
  opening.children.splice(imageIndex, 1);
  if (significantChildren(opening).length === 0) tree.children.splice(openingIndex, 1);
}

function coverFromSource(file) {
  const path = typeof file?.path === 'string' ? resolve(file.path) : undefined;
  const root = resolve('src/content/posts');
  if (!path?.startsWith(`${root}${sep}`)) return undefined;
  try {
    const source = readFileSync(path, 'utf8');
    const yaml = source.replace(/^\uFEFF/, '').match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const data = yaml ? parse(yaml[1]) : undefined;
    return data?.draft === false && data?.published === true && data?.content_type !== 'signal-brief' ? data.image : undefined;
  } catch { return undefined; }
}

function imageDimensions(src) {
  if (typeof src !== 'string' || !src.startsWith('/assets/')) return '';
  const root = resolve('public');
  const path = resolve(root, `.${src}`);
  if (!path.startsWith(`${root}${sep}`)) return '';
  try {
    const bytes = readFileSync(path);
    const dimensions = intrinsicDimensions(bytes);
    return dimensions ? ` (${dimensions.width} × ${dimensions.height} px)` : '';
  } catch { return ''; }
}

function significantChildren(node) {
  return (node.children ?? []).filter((child) => child.type !== 'text' || child.value.trim());
}

export default function rehypeEvidenceFigures() {
  return (tree, file) => {
    const lt = String(file?.path ?? '').replaceAll('\\', '/').includes('/lt/');
    removeRepeatedOpeningIllustration(tree, coverFromSource(file));
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
            const editorial = /^(AI-generated|DI sukurta)/.test(String(caption.children?.[0]?.value ?? ''));
            const original = typeof image.properties?.src === 'string' && image.properties.src.startsWith('/assets/')
              ? [{ type: 'text', value: ' ' }, { type: 'element', tagName: 'a', properties: { href: image.properties.src, className: ['evidence-original'] }, children: [{ type: 'text', value: (editorial ? (lt ? 'Atverti viso dydžio iliustraciją' : 'Open full-size illustration') : (lt ? 'Atverti originalų vaizdą' : 'Open original image')) + imageDimensions(image.properties.src) }] }] : [];
            parent.children[index] = {
              type: 'element',
              tagName: 'figure',
              properties: { className: ['hx-evidence-figure'], ...(editorial ? { 'data-presentation': 'illustration' } : {}) },
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
