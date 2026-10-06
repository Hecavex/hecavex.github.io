/** Publication chrome must not present illustrative artwork as source evidence.
 * Evidence within article bodies is unaffected. A future genuine cover preview
 * requires explicit opt-in in frontmatter; the default is a typographic card.
 */
export function publicationPreview(post, kind = 'hero') {
  if (kind === 'social') return `/assets/img/social/${post.translationKey}-${post.lang}.png`;
  if (post.contentType === 'signal-brief') return undefined;
  const image = post.image;
  if (!image || typeof image === 'string' || image.presentation !== 'evidence') return undefined;
  return kind === 'thumbnail' ? image.thumbnail ?? image.hero ?? image.path : image.hero ?? image.path;
}
