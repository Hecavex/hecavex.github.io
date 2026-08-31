import type { APIRoute } from 'astro';
import { getPages, getPublicPosts, imagePath, slugify, taxonomy, xmlEscape, type Lang } from '../lib/site';

interface SitemapRoute {
  modified?: Date;
  alternates?: Partial<Record<Lang, string>>;
  xDefault?: string;
  image?: { loc: string; title: string };
}

const absoluteUrl = (path: string) => new URL(path, 'https://hecavex.com').href;
const isIndexablePage = (page: Awaited<ReturnType<typeof getPages>>[number]) =>
  page.data.sitemap !== false && !page.data.robots?.includes('noindex');

export const GET: APIRoute = async () => {
  const posts = await getPublicPosts();
  const pages = await getPages();
  const routes = new Map<string, SitemapRoute>();

  routes.set('/', { alternates: { en: '/en/', lt: '/lt/' }, xDefault: '/' });
  routes.set('/data/', { alternates: { en: '/data/' }, xDefault: '/data/' });

  const indexablePages = pages.filter(isIndexablePage);
  for (const page of indexablePages) {
    const siblings = indexablePages.filter((candidate) => candidate.data.translation_key === page.data.translation_key);
    const alternates = Object.fromEntries(siblings.map((candidate) => [candidate.data.lang, candidate.data.permalink])) as Partial<Record<Lang, string>>;
    routes.set(page.data.permalink, {
      modified: page.data.last_modified_at,
      alternates,
      xDefault: alternates.en ?? (page.data.lang === 'en' ? page.data.permalink : undefined)
    });
  }

  for (const post of posts) {
    const siblings = posts.filter((candidate) => candidate.translationKey === post.translationKey);
    const alternates = Object.fromEntries(siblings.map((candidate) => [candidate.lang, candidate.url])) as Partial<Record<Lang, string>>;
    const hero = imagePath(post, 'hero');
    routes.set(post.url, {
      modified: post.updated ?? post.date,
      alternates,
      xDefault: alternates.en ?? (post.lang === 'en' ? post.url : undefined),
      image: hero ? { loc: absoluteUrl(hero), title: post.title } : undefined
    });
  }

  const taxonomyPairs = new Map<string, Partial<Record<Lang, string>>>();
  for (const lang of ['en', 'lt'] as Lang[]) {
    const localized = posts.filter((post) => post.lang === lang);
    const categoryBase = lang === 'lt' ? 'kategorijos' : 'categories';
    for (const slug of Object.keys(taxonomy)) {
      if (localized.filter((post) => post.categories.includes(slug)).length < 2) continue;
      const path = `/${lang}/${categoryBase}/${slug}/`;
      routes.set(path, {});
      const pair = taxonomyPairs.get(`category:${slug}`) ?? {};
      pair[lang] = path;
      taxonomyPairs.set(`category:${slug}`, pair);
    }

    const tagCounts = new Map<string, number>();
    for (const tag of localized.flatMap((post) => post.tags)) tagCounts.set(slugify(tag), (tagCounts.get(slugify(tag)) ?? 0) + 1);
    const tagBase = lang === 'lt' ? 'zymos' : 'tags';
    for (const [slug, count] of tagCounts) {
      if (count < 2) continue;
      const path = `/${lang}/${tagBase}/${slug}/`;
      routes.set(path, {});
      const pair = taxonomyPairs.get(`tag:${slug}`) ?? {};
      pair[lang] = path;
      taxonomyPairs.set(`tag:${slug}`, pair);
    }
  }

  for (const alternates of taxonomyPairs.values()) {
    for (const path of Object.values(alternates)) {
      if (!path) continue;
      const route = routes.get(path);
      if (!route) continue;
      route.alternates = alternates;
      route.xDefault = alternates.en ?? path;
    }
  }

  const urls = [...routes].sort(([a], [b]) => a.localeCompare(b)).map(([path, route]) => {
    const alternateLinks = Object.entries(route.alternates ?? {})
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([lang, alternatePath]) => `<xhtml:link rel="alternate" hreflang="${xmlEscape(lang)}" href="${xmlEscape(absoluteUrl(alternatePath))}"/>`)
      .join('');
    const xDefaultLink = route.xDefault
      ? `<xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(absoluteUrl(route.xDefault))}"/>`
      : '';
    const image = route.image
      ? `<image:image><image:loc>${xmlEscape(route.image.loc)}</image:loc><image:title>${xmlEscape(route.image.title)}</image:title></image:image>`
      : '';
    return `<url><loc>${xmlEscape(absoluteUrl(path))}</loc>${route.modified ? `<lastmod>${route.modified.toISOString()}</lastmod>` : ''}${alternateLinks}${xDefaultLink}${image}</url>`;
  }).join('');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls}</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
  );
};
