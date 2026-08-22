export function applyArticleImagePolicy(html) {
  if (!/class=["'][^"']*\barticle-body\b[^"']*\bprose\b/i.test(html)) return html;
  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    if (/\bsrc=["']\/assets\/img\/brand\//i.test(tag)) return tag;
    let updated = tag;
    if (!/\sloading=(?:["']|[^\s>]+)/i.test(updated)) updated = updated.replace(/\/?>$/, (closing) => ` loading="lazy"${closing}`);
    if (!/\sdecoding=(?:["']|[^\s>]+)/i.test(updated)) updated = updated.replace(/\/?>$/, (closing) => ` decoding="async"${closing}`);
    return updated;
  });
}
