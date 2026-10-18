// Curated `basics` keys first (in file order), then every other beginner post
// (newest first), deduplicated. Signal Briefs are never listed. A curated key
// with no post in this language fails the build rather than silently vanishing.
export const beginnerList = (posts, basics) => {
  const lang = posts[0]?.lang ?? '';
  const eligible = posts.filter((post) => post.contentType !== 'signal-brief');
  const curated = basics.map((key) => {
    const post = eligible.find((candidate) => candidate.translationKey === key);
    if (!post) throw new Error(`Missing start-here publication: ${key}/${lang}`);
    return post;
  });
  const rest = eligible
    .filter((post) => post.audience === 'beginner')
    .sort((a, b) => b.date.valueOf() - a.date.valueOf());
  return [...new Set([...curated, ...rest])];
};
