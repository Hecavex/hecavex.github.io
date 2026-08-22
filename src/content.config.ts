import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const imageSchema = z.union([
  z.string(),
  z.object({
    path: z.string(),
    hero: z.string().optional(),
    thumbnail: z.string().optional(),
    social: z.string().optional(),
    alt: z.string().default(''),
    width: z.number().optional(),
    height: z.number().optional(),
    hero_width: z.number().optional(),
    hero_height: z.number().optional()
  }).loose()
]);

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,markdown}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    card_title: z.string().optional(),
    description: z.string(),
    date: z.coerce.date().optional(),
    last_modified_at: z.coerce.date().optional(),
    lang: z.enum(['en', 'lt']),
    translation_key: z.string(),
    permalink: z.string().optional(),
    author: z.string().default('deividas-lis'),
    content_type: z.enum(['investigation', 'malware-analysis', 'incident-analysis', 'technical-analysis', 'technical-guide', 'commentary', 'threat-note', 'signal-brief']),
    publication_class: z.enum(['primary-research', 'technical-assessment', 'commentary', 'signal-brief']).optional(),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    image: imageSchema.optional(),
    confidence: z.string().optional(),
    tlp: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    published: z.boolean().optional(),
    toc: z.boolean().default(true),
    redirect_from: z.array(z.string()).default([]),
    key_findings: z.array(z.string()).optional(),
    scope: z.string().optional(),
    limitations: z.string().optional(),
    methods: z.array(z.string()).optional(),
    evidence_basis: z.string().optional(),
    updates: z.array(z.object({ date: z.coerce.date(), note: z.string() })).optional()
  }).loose()
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    layout: z.string(),
    lang: z.enum(['en', 'lt']),
    translation_key: z.string(),
    title: z.string(),
    seo_title: z.string().optional(),
    description: z.string(),
    permalink: z.string(),
    last_modified_at: z.coerce.date().optional(),
    sitemap: z.boolean().optional(),
    robots: z.string().optional()
  }).loose()
});

export const collections = { posts, pages };
