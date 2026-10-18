import { parse } from 'yaml';
import { copy, withCount, type Lang } from '../lib/site';
import contextSource from './page-context.yml?raw';

export interface ContextLink {
  label: string;
  href: string;
}

export interface PageFact {
  label: string;
  value?: string;
  href?: string;
  links?: ContextLink[];
}

export interface OutlineItem {
  depth: number;
  slug: string;
  text: string;
  note?: string;
}

export interface ActionRoute {
  label: string;
  title: string;
  description: string;
  links: ContextLink[];
}

type PerLang<T> = Record<Lang, T>;
const context = parse(contextSource) as {
  facts: Record<string, PerLang<PageFact[]>>;
  contact_routes: PerLang<ActionRoute[]>;
};

export function pageFactsFor(translationKey: string, lang: Lang, updated = '—'): PageFact[] {
  return (context.facts[translationKey]?.[lang] ?? []).map((fact) => fact.value === '{updated}' ? { ...fact, value: updated } : fact);
}

export function contactRoutesFor(lang: Lang): ActionRoute[] {
  return context.contact_routes[lang];
}

export function researchMapFor(lang: Lang, counts: { featured: number; primary: number; assessments: number; commentary: number; briefings: number }): OutlineItem[] {
  const c = copy[lang];
  return [
    ...(counts.featured > 0 ? [{ depth: 2, slug: 'featured', text: c.research_featured_h2!, note: withCount(c.map_note_featured!, counts.featured) }] : []),
    { depth: 2, slug: 'primary', text: c.cat_primary_h2!, note: withCount(c.map_note_primary!, counts.primary) },
    { depth: 2, slug: 'assessments', text: c.cat_assess_h2!, note: withCount(c.map_note_assessments!, counts.assessments) },
    { depth: 2, slug: 'commentary', text: c.cat_comm_h2!, note: withCount(c.map_note_commentary!, counts.commentary) },
    { depth: 2, slug: 'briefing-path', text: 'Signal Brief', note: withCount(c.map_note_briefing!, counts.briefings) }
  ];
}
