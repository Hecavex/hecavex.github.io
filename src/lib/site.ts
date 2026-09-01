import { getCollection, type CollectionEntry } from 'astro:content';
import { parse } from 'yaml';
import contentTypesSource from '../data/content_types.yml?raw';
import glossarySource from '../data/glossary.yml?raw';
import copyEnSource from '../data/hecavex/en.yml?raw';
import copyLtSource from '../data/hecavex/lt.yml?raw';
import portfolioSource from '../data/portfolio.yml?raw';
import publicationClassesSource from '../data/publication_classes.yml?raw';
import taxonomySource from '../data/taxonomy.yml?raw';

export type Lang = 'en' | 'lt';
export type PostEntry = CollectionEntry<'posts'>;
export type PageEntry = CollectionEntry<'pages'>;

type Localized = Record<Lang, string>;

const readYaml = <T>(source: string): T => parse(source) as T;

export const copy = {
  en: readYaml<Record<string, string>>(copyEnSource),
  lt: readYaml<Record<string, string>>(copyLtSource)
};
export const taxonomy = readYaml<Record<string, Localized>>(taxonomySource);
export const contentTypes = readYaml<Record<string, Localized>>(contentTypesSource);
export const publicationClasses = readYaml<Record<string, Localized>>(publicationClassesSource);
export const glossary = readYaml<{ terms: Array<{ id: string; term: Localized; definition: Localized }> }>(glossarySource);
export const portfolio = readYaml<{ owner: string; projects: Array<Record<string, unknown>> }>(portfolioSource);

const defaults: Array<[string, string]> = [
  ['/blogs/', 'commentary'],
  ['/bulletins/', 'signal-brief'],
  ['/research/investigations/', 'primary-research'],
  ['/research/malware-analyses/', 'primary-research'],
  ['/research/incident-analyses/', 'technical-assessment'],
  ['/research/technical-analyses/', 'technical-assessment'],
  ['/research/technical-guides/', 'technical-assessment'],
  ['/research/threat-notes/', 'commentary']
];

const dateFromId = (id: string) => {
  const value = id.match(/(?:^|\/)(\d{4}-\d{2}-\d{2})-/)?.[1];
  return value ? new Date(`${value}T00:00:00Z`) : new Date(0);
};

export const slugify = (value: string) => value
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

export const normalizePath = (value: string) => {
  if (!value.startsWith('/') || value.startsWith('//')) throw new Error(`Unsafe internal path: ${value}`);
  if (/\.[a-z0-9]+$/i.test(value)) return value;
  return value.endsWith('/') ? value : `${value}/`;
};

export interface Post {
  entry: PostEntry;
  id: string;
  lang: Lang;
  title: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords: string[];
  cardTitle: string;
  description: string;
  date: Date;
  updated?: Date;
  translationKey: string;
  slug: string;
  url: string;
  contentType: string;
  publicationClass: string;
  categories: string[];
  tags: string[];
  featured: boolean;
  image?: PostEntry['data']['image'];
  readingMinutes: number;
}

export const hydratePost = (entry: PostEntry): Post => {
  const path = `/${entry.id.replaceAll('\\', '/')}`;
  const filename = path.split('/').at(-1) ?? '';
  const slug = filename.replace(/\.(?:md|markdown)$/i, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
  const lang = entry.data.lang;
  const publicationClass = entry.data.publication_class
    ?? defaults.find(([segment]) => path.includes(segment))?.[1]
    ?? (entry.data.content_type === 'signal-brief' ? 'signal-brief' : 'commentary');
  const url = normalizePath(entry.data.permalink ?? `/${lang}/${lang === 'lt' ? 'tyrimai' : 'research'}/${slug}/`);
  const words = (entry.body ?? '').replace(/<[^>]*>|[`*_#>|\[\]()-]/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  return {
    entry,
    id: entry.id,
    lang,
    title: entry.data.title,
    seoTitle: entry.data.seo_title,
    seoDescription: entry.data.seo_description,
    seoKeywords: entry.data.seo_keywords,
    cardTitle: entry.data.card_title ?? entry.data.title,
    description: entry.data.description,
    date: entry.data.date ?? dateFromId(entry.id),
    updated: entry.data.last_modified_at,
    translationKey: entry.data.translation_key,
    slug,
    url,
    contentType: entry.data.content_type,
    publicationClass,
    categories: entry.data.categories,
    tags: entry.data.tags,
    featured: entry.data.featured,
    image: entry.data.image,
    readingMinutes: Math.max(1, Math.ceil(words / 220))
  };
};

let postCache: Post[] | undefined;
export const getPublicPosts = async () => {
  if (!postCache) {
    const entries = await getCollection('posts', ({ data }) => data.draft !== true && data.published !== false);
    postCache = entries.map(hydratePost).sort((a, b) => b.date.valueOf() - a.date.valueOf());
  }
  return postCache;
};

export const getLocalizedPosts = async (lang: Lang) => (await getPublicPosts()).filter((post) => post.lang === lang);
export const findTranslation = async (post: Post) => (await getPublicPosts()).find((candidate) => candidate.translationKey === post.translationKey && candidate.lang !== post.lang);

export const latestContentUpdate = (posts: Post[]) => posts.reduce<Date | undefined>((latest, post) => {
  const candidate = post.updated ?? post.date;
  return !latest || candidate.valueOf() > latest.valueOf() ? candidate : latest;
}, undefined);

const postSeries = (post: Post) => {
  const data = post.entry.data as typeof post.entry.data & { series?: unknown; series_key?: unknown };
  const value = data.series_key ?? data.series;
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
};

const postSeriesPart = (post: Post) => {
  const data = post.entry.data as typeof post.entry.data & { series_part?: unknown; issue?: unknown };
  const value = data.series_part ?? data.issue;
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
};

const normalizedTerms = (values: string[]) => new Set(values.map((value) => slugify(value)).filter(Boolean));
const intersectionSize = (left: Set<string>, right: Set<string>) => [...left].filter((value) => right.has(value)).length;

export const relatedPostsFor = (post: Post, candidates: Post[], limit = 3) => {
  const categories = normalizedTerms(post.categories);
  const tags = normalizedTerms(post.tags);
  const series = postSeries(post);
  return candidates
    .filter((candidate) => candidate.url !== post.url)
    .map((candidate) => {
      const sharedCategories = intersectionSize(categories, normalizedTerms(candidate.categories));
      const sharedTags = intersectionSize(tags, normalizedTerms(candidate.tags));
      const sameSeries = Boolean(series && postSeries(candidate) === series);
      const score = (sameSeries ? 100 : 0)
        + sharedCategories * 12
        + sharedTags * 4
        + (candidate.contentType === post.contentType ? 8 : 0)
        + (candidate.publicationClass === post.publicationClass ? 4 : 0);
      return { candidate, score, distance: Math.abs(candidate.date.valueOf() - post.date.valueOf()) };
    })
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score || left.distance - right.distance || right.candidate.date.valueOf() - left.candidate.date.valueOf())
    .slice(0, limit)
    .map(({ candidate }) => candidate);
};

const sequenceOrder = (left: Post, right: Post) => right.date.valueOf() - left.date.valueOf()
  || (postSeriesPart(right) ?? 0) - (postSeriesPart(left) ?? 0)
  || left.url.localeCompare(right.url);

export const postNeighboursFor = (post: Post, candidates: Post[]) => {
  const series = postSeries(post);
  const sameSeries = series ? candidates.filter((candidate) => postSeries(candidate) === series) : [];
  const sameTypeAndClass = candidates.filter((candidate) => candidate.contentType === post.contentType && candidate.publicationClass === post.publicationClass);
  const sameClass = candidates.filter((candidate) => candidate.publicationClass === post.publicationClass);
  const sequence = (sameSeries.length > 1 ? sameSeries : sameTypeAndClass.length > 1 ? sameTypeAndClass : sameClass).sort(sequenceOrder);
  const position = sequence.findIndex((candidate) => candidate.url === post.url);
  return {
    newer: position > 0 ? sequence[position - 1] : undefined,
    older: position >= 0 && position < sequence.length - 1 ? sequence[position + 1] : undefined
  };
};

export const getPages = async () => getCollection('pages');
export const findPage = async (permalink: string) => (await getPages()).find((page) => normalizePath(page.data.permalink) === normalizePath(permalink));

export const labelForPost = (post: Post) => publicationClasses[post.publicationClass]?.[post.lang]
  ?? contentTypes[post.contentType]?.[post.lang]
  ?? (post.lang === 'lt' ? 'HECAVEX tyrimas' : 'HECAVEX Research');

export const imagePath = (post: Post, kind: 'hero' | 'thumbnail' | 'social' = 'hero') => {
  // Signal Briefs are recurring text-led publications. Their issue-specific
  // cards remain available for social sharing, while the catalogue and article
  // avoid promoting a generic series illustration as if it were evidence.
  if (post.contentType === 'signal-brief' && kind !== 'social') return undefined;
  if (!post.image) return kind === 'social' ? `/assets/img/og/hecavex-default-${post.lang}.png` : undefined;
  if (typeof post.image === 'string') return post.image;
  if (kind === 'social') return post.image.social ?? `/assets/img/social/${post.translationKey}-${post.lang}.png`;
  if (kind === 'thumbnail') return post.image.thumbnail ?? post.image.hero ?? post.image.path;
  return post.image.hero ?? post.image.path;
};

export const imageAlt = (post: Post) => typeof post.image === 'object' ? post.image.alt : '';
export const dateText = (date: Date) => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Vilnius', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(date);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
};
export const xmlEscape = (value: string) => value.replace(/[<>&"']/g, (character) => ({
  '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;'
})[character] ?? character);

export const languagePairPath = async (translationKey: string, lang: Lang) => {
  const post = (await getPublicPosts()).find((candidate) => candidate.translationKey === translationKey && candidate.lang !== lang);
  if (post) return post.url;
  const page = (await getPages()).find((candidate) => candidate.data.translation_key === translationKey && candidate.data.lang !== lang);
  return page?.data.permalink;
};

export const networkNavigation = [
  { name: 'Research', href: 'https://hecavex.com/en/research/' },
  { name: 'Radar', href: 'https://radar.hecavex.com/' },
  { name: 'APT Notes', href: 'https://apt.hecavex.com/' },
  { name: 'Labs', href: 'https://labs.hecavex.com/' },
  { name: 'Data', href: 'https://hecavex.com/data/' }
] as const;

export const productNavigation = {
  en: [
    ['Overview', '/en/'], ['Research', '/en/research/'], ['Briefings', '/en/briefings/'], ['Projects', '/en/projects/'],
    ['About', '/en/about/'], ['Speaking', '/en/speaker/'], ['Contact', '/en/contact/']
  ],
  lt: [
    ['Apžvalga', '/lt/'], ['Tyrimai', '/lt/tyrimai/'], ['Apžvalgos', '/lt/apzvalgos/'], ['Projektai', '/lt/projektai/'],
    ['Apie', '/lt/apie/'], ['Pranešimai', '/lt/pranesejas/'], ['Kontaktai', '/lt/kontaktai/']
  ]
} as const;
