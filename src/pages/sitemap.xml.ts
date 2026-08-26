import type { APIRoute } from 'astro';
import { getPages, getPublicPosts, slugify, taxonomy, xmlEscape, type Lang } from '../lib/site';

export const GET: APIRoute = async () => {
  const posts = await getPublicPosts();
  const pages = await getPages();
  const routes = new Map<string, Date | undefined>();
  routes.set('/', undefined);
  routes.set('/data/', undefined);
  for (const page of pages) {
    if (page.data.sitemap === false || page.data.robots?.includes('noindex')) continue;
    routes.set(page.data.permalink, page.data.last_modified_at);
  }
  for (const post of posts) routes.set(post.url, post.updated ?? post.date);
  for (const lang of ['en', 'lt'] as Lang[]) {
    const localized = posts.filter((post) => post.lang === lang);
    const categoryBase = lang === 'lt' ? 'kategorijos' : 'categories';
    for (const slug of Object.keys(taxonomy)) {
      if (localized.filter((post) => post.categories.includes(slug)).length >= 2) routes.set(`/${lang}/${categoryBase}/${slug}/`, undefined);
    }
    const tagCounts = new Map<string, number>();
    for (const tag of localized.flatMap((post) => post.tags)) tagCounts.set(slugify(tag), (tagCounts.get(slugify(tag)) ?? 0) + 1);
    const tagBase = lang === 'lt' ? 'zymos' : 'tags';
    for (const [slug, count] of tagCounts) if (count >= 2) routes.set(`/${lang}/${tagBase}/${slug}/`, undefined);
  }
  const urls = [...routes].sort(([a], [b]) => a.localeCompare(b)).map(([path, modified]) => `<url><loc>${xmlEscape(`https://hecavex.com${path}`)}</loc>${modified ? `<lastmod>${modified.toISOString()}</lastmod>` : ''}</url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
