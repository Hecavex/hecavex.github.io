import type { APIRoute, GetStaticPaths } from 'astro';
import { briefingsPath, copy, getLocalizedPosts, latestContentUpdate, xmlEscape, type Lang } from '../../../lib/site';

export const getStaticPaths = (() => (['en', 'lt'] as Lang[]).map((lang) => (
  { params: { lang, briefings: briefingsPath[lang].split('/').filter(Boolean)[1] } }
))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const lang = params.lang as Lang;
  const posts = (await getLocalizedPosts(lang)).filter((post) => post.contentType === 'signal-brief');
  const feedUpdated = latestContentUpdate(posts) ?? new Date(0);
  const home = `https://hecavex.com${briefingsPath[lang]}`;
  const self = `${home}feed.xml`;
  const entries = posts.map((post) => `<entry><title>${xmlEscape(post.title)}</title><link href="https://hecavex.com${post.url}"/><id>https://hecavex.com${post.url}</id><published>${post.date.toISOString()}</published><updated>${(post.updated ?? post.date).toISOString()}</updated><summary>${xmlEscape(post.description)}</summary><author><name>Deividas Lis</name></author></entry>`).join('');
  return new Response(`<?xml version="1.0" encoding="utf-8"?><feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${lang}"><title>${xmlEscape(copy[lang].briefing_feed_title!)}</title><link href="${self}" rel="self"/><link href="${home}"/><id>${home}</id><updated>${feedUpdated.toISOString()}</updated>${entries}</feed>`, { headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' } });
};
