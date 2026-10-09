/** Covers require an explicit editorial/evidence classification. A generated
 * illustration can identify a topic, but cannot establish an analytical claim.
 * Unclassified legacy images remain text-led; classified Briefings use the same cover system.
 */
export function publicationImagePresentation(post) {
  const image = post.image;
  if (!image || typeof image === 'string') return undefined;
  return ['illustration', 'evidence'].includes(image.presentation) ? image.presentation : undefined;
}

export function publicationPreview(post, kind = 'hero') {
  if (kind === 'social') return `/assets/img/social/${post.translationKey}-${post.lang}.png`;
  if (!publicationImagePresentation(post)) return undefined;
  const image = post.image;
  return kind === 'thumbnail' ? image.thumbnail ?? image.hero ?? image.path : image.hero ?? image.path;
}

export function publicationImageCaption(post) {
  const presentation = publicationImagePresentation(post);
  if (!presentation) return '';
  if (presentation === 'evidence') return post.lang === 'lt' ? 'Įrodymų peržiūra' : 'Evidence preview';
  if (post.image.source_type === 'generated') return post.lang === 'lt' ? 'DI sukurta iliustracija · ne įrodymas' : 'AI-generated illustration · not evidence';
  return post.lang === 'lt' ? 'Redakcinė iliustracija · ne įrodymas' : 'Editorial illustration · not evidence';
}

export function publicationSocialAlt(post) {
  return `${post.lang === 'lt' ? 'HECAVEX tipografinė dalijimosi kortelė' : 'HECAVEX typographic social card'}: ${post.title}`;
}

export function publicationImageDimensions(post, kind = 'hero') {
  if (!publicationPreview(post, kind) || kind === 'social') return undefined;
  const image = post.image;
  const thumbnail = kind === 'thumbnail' && image.thumbnail;
  const width = thumbnail ? image.thumbnail_width : image.hero_width ?? image.width;
  const height = thumbnail ? image.thumbnail_height : image.hero_height ?? image.height;
  return Number.isInteger(width) && width > 0 && Number.isInteger(height) && height > 0 ? { width, height } : undefined;
}

export function publicationImageSrcSet(post, kind = 'hero') {
  if (kind === 'social') return undefined;
  const hero = publicationPreview(post, 'hero');
  const card = publicationPreview(post, 'thumbnail');
  const full = publicationImageDimensions(post, 'hero');
  const small = publicationImageDimensions(post, 'thumbnail');
  if (!hero || !card || hero === card || !full || !small || small.width >= full.width) return undefined;
  // Rounded legacy crops (1280×719 / 720×404) differ slightly. A genuinely
  // different aspect ratio must not silently switch the visible composition.
  if (Math.abs((small.width / small.height) / (full.width / full.height) - 1) > 0.01) return undefined;
  return `${card} ${small.width}w, ${hero} ${full.width}w`;
}
