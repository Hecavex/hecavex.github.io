import type { APIRoute } from 'astro';
import { getPublicPosts } from '../../lib/site';
import { publicationRecord } from '../../lib/publication-citations.mjs';

export const GET: APIRoute = async () => {
  const posts = await getPublicPosts();
  return new Response(`${JSON.stringify({
    schemaVersion: 1,
    publisher: 'HECAVEX',
    sourceRevision: process.env.GITHUB_SHA ?? null,
    description: 'Metadata for explicitly approved public publications, not a threat-indicator or evidence dataset. Each language edition is a separate entry; translations are not additional investigations.',
    dateSemantics: 'published is the original visible publication date; modified is the recorded page update date; substantiveReview is only an explicitly recorded review date. Unknown fields remain null. Research and evidence-package versions are separate.',
    identifierSemantics: 'id is the canonical URL of this language edition. researchId is only an explicitly recorded frontmatter ID, not a generated fallback identifier shown on some article pages.',
    reuse: 'Metadata supports discovery and citation. Article text, images, datasets and upstream evidence retain their page- or package-specific terms.',
    publicationCount: new Set(posts.map(post => post.translationKey)).size,
    languageEditionCount: posts.length,
    publications: posts.slice().sort((a, b) => a.url.localeCompare(b.url, 'en')).map(post => publicationRecord(post, posts))
  }, null, 2)}\n`, { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
