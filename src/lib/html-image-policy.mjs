function attribute(tag, name) {
  return tag.match(new RegExp(`\\s${name}=(?:["']([^"']*)["']|([^\\s>]+))`, 'i'))?.slice(1).find((value) => value !== undefined);
}

export function applyArticleImagePolicy(html, dimensionMap = new Map()) {
  if (!/class=["'][^"']*\barticle-body\b[^"']*\bprose\b/i.test(html)) return html;
  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    if (/\bsrc=["']\/assets\/img\/brand\//i.test(tag)) return tag;
    let updated = tag;
    const source = attribute(updated, 'src');
    const dimensions = source ? dimensionMap.get(source) : undefined;
    if (dimensions && !/\swidth=(?:["']|[^\s>]+)/i.test(updated)) updated = updated.replace(/\/?>$/, (closing) => ` width="${dimensions.width}"${closing}`);
    if (dimensions && !/\sheight=(?:["']|[^\s>]+)/i.test(updated)) updated = updated.replace(/\/?>$/, (closing) => ` height="${dimensions.height}"${closing}`);
    if (!/\sloading=(?:["']|[^\s>]+)/i.test(updated)) updated = updated.replace(/\/?>$/, (closing) => ` loading="lazy"${closing}`);
    if (!/\sdecoding=(?:["']|[^\s>]+)/i.test(updated)) updated = updated.replace(/\/?>$/, (closing) => ` decoding="async"${closing}`);
    return updated;
  });
}
