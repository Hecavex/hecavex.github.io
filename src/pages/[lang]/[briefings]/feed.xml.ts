import type { APIRoute, GetStaticPaths } from 'astro';
import { getLocalizedPosts, latestContentUpdate, xmlEscape, type Lang } from '../../../lib/site';

export const getStaticPaths = (() => [
  { params: { lang: 'en', briefings: 'briefings' } },
  { params: { lang: 'lt', briefings: 'apzvalgos' } }
]) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const lang = params.lang as Lang;
  const posts = (await getLocalizedPosts(lang)).filter((post) => post.contentType === 'signal-brief');
  const feedUpdated = latestContentUpdate(posts) ?? new Date(0);
  const base = lang === 'lt' ? 'apzvalgos' : 'briefings';
  const self = `https://hecavex.com/${lang}/${base}/feed.xml`;
  const entries = posts.map((post) => `<entry><title>${xmlEscape(post.title)}</title><link href="https://hecavex.com${post.url}"/><id>https://hecavex.com${post.url}</id><published>${post.date.toISOString()}</published><updated>${(post.updated ?? post.date).toISOString()}</updated><summary>${xmlEscape(post.description)}</summary><author><name>Deividas Lis</name></author></entry>`).join('');
  return new Response(`<?xml version="1.0" encoding="utf-8"?><feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${lang}"><title>HECAVEX Signal Brief</title><link href="${self}" rel="self"/><link href="https://hecavex.com/${lang}/${base}/"/><id>https://hecavex.com/${lang}/${base}/</id><updated>${feedUpdated.toISOString()}</updated>${entries}</feed>`, { headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' } });
};
