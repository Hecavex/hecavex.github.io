import type { APIRoute, GetStaticPaths } from 'astro';
import { getLocalizedPosts, type Lang } from '../../lib/site';

export const getStaticPaths = (() => [{ params: { lang: 'en' } }, { params: { lang: 'lt' } }]) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const posts = await getLocalizedPosts(params.lang as Lang);
  const payload = posts.map((post) => ({
    title: post.title,
    description: post.description,
    url: post.url,
    date: post.date.toISOString(),
    categories: post.categories,
    tags: post.tags,
    content: (post.entry.body ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  }));
  return new Response(JSON.stringify(payload), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
