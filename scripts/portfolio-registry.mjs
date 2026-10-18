import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'yaml';

// Shared by the audit scripts: expectations come from src/data/portfolio.yml.
const source = readFileSync(resolve(import.meta.dirname, '..', 'src', 'data', 'portfolio.yml'), 'utf8');
export const projects = [...parse(source).projects].sort((a, b) => a.order - b.order);

export const localized = (value, lang) => (value !== null && typeof value === 'object' ? value[lang] : value) ?? '';

export const navLabels = (lang) => projects.filter((project) => project.nav).map((project) => localized(project.nav.label, lang));
export const cardCount = () => projects.filter((project) => project.card).length;
export const siteIds = () => projects.filter((project) => project.site).map((project) => `${project.site}#website`);
export const navHrefs = (lang) => projects.filter((project) => project.nav).map((project) => localized(project.nav.href, lang));

// Header network bar = registry nav entries, then the fixed Projects link (net_projects in the copy table).
const projectsLabel = (lang) => parse(readFileSync(resolve(import.meta.dirname, '..', 'src', 'data', 'hecavex', `${lang}.yml`), 'utf8')).net_projects;
export const networkLabels = (lang) => [...navLabels(lang), projectsLabel(lang)];
