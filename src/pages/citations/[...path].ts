import type { APIRoute } from 'astro';
import { getPublicPosts } from '../../lib/site';
import { citationFormats, citationPath, publicationRecord, toBibtex, toCslJson } from '../../lib/publication-citations.mjs';

export async function getStaticPaths() {
  const posts = await getPublicPosts();
  return posts.flatMap(post => citationFormats.map(format => ({
    params: { path: citationPath(post, format).slice('/citations/'.length) },
    props: { record: publicationRecord(post, posts), format }
  })));
}

export const GET: APIRoute = ({ props }) => new Response(
  props.format === 'bib' ? toBibtex(props.record) : `${JSON.stringify(toCslJson(props.record), null, 2)}\n`,
  { headers: { 'Content-Type': props.format === 'bib' ? 'application/x-bibtex; charset=utf-8' : 'application/vnd.citationstyles.csl+json; charset=utf-8' } }
);
