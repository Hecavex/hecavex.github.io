import type { APIRoute, GetStaticPaths } from 'astro';
import { getLocalizedPosts, xmlEscape, type Lang } from '../../lib/site';

export const getStaticPaths = (() => [{ params: { lang: 'en' } }, { params: { lang: 'lt' } }]) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const lang = params.lang as Lang;
  const posts = await getLocalizedPosts(lang);
  const self = `https://hecavex.com/${lang}/feed.xml`;
  const entries = posts.map((post) => `<entry><title>${xmlEscape(post.title)}</title><link href="https://hecavex.com${post.url}"/><id>https://hecavex.com${post.url}</id><published>${post.date.toISOString()}</published><updated>${(post.updated ?? post.date).toISOString()}</updated><summary>${xmlEscape(post.description)}</summary><author><name>Deividas Lis</name></author></entry>`).join('');
  return new Response(`<?xml version="1.0" encoding="utf-8"?><feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${lang}"><title>HECAVEX ${lang === 'lt' ? 'tyrimai' : 'Research'}</title><link href="${self}" rel="self"/><link href="https://hecavex.com/${lang}/"/><id>https://hecavex.com/${lang}/</id><updated>${(posts[0]?.updated ?? posts[0]?.date ?? new Date(0)).toISOString()}</updated>${entries}</feed>`, { headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' } });
};
