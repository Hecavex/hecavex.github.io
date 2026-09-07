export function decodeFragment(value) {
  try { return decodeURIComponent(value).normalize('NFC'); }
  catch { return undefined; }
}
export function hasFragment(html, hash) {
  const id = decodeFragment(hash.replace(/^#/, ''));
  if (id === undefined) return false;
  if (!id || id.startsWith(':~:text=')) return true;
  return [...html.matchAll(/\s(?:id|name)=["']([^"']*)["']/g)]
    .some((match) => match[1].normalize('NFC') === id);
}
