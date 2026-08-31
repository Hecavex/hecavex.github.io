import type { APIRoute, GetStaticPaths } from 'astro';
import { getLocalizedPosts, type Lang } from '../../lib/site';

export const getStaticPaths = (() => [{ params: { lang: 'en' } }, { params: { lang: 'lt' } }]) satisfies GetStaticPaths;

const searchableProse = (source: string) => source
  .replace(/^---[\s\S]*?---\s*/u, ' ')
  .replace(/```[\s\S]*?```/g, ' ')
  .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
  .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  .replace(/https?:\/\/\S+/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/[`*_#>|~]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

export const GET: APIRoute = async ({ params }) => {
  const posts = await getLocalizedPosts(params.lang as Lang);
  const payload = posts.map((post) => ({
    title: post.title,
    description: post.description,
    url: post.url,
    date: post.date.toISOString(),
    categories: post.categories,
    tags: post.tags,
    keywords: post.seoKeywords,
    searchText: [
      post.title,
      post.seoTitle,
      post.description,
      post.seoDescription,
      ...post.categories,
      ...post.tags,
      ...post.seoKeywords,
      searchableProse(post.entry.body ?? '')
    ].filter(Boolean).join(' ')
  }));
  return new Response(JSON.stringify(payload), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
