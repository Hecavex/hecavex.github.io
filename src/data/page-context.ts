import type { Lang } from '../lib/site';

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

export function pageFactsFor(translationKey: string, lang: Lang, updated = '—'): PageFact[] {
  if (translationKey === 'about') return lang === 'lt' ? [
    { label: 'Veikla', value: 'Nepriklausomas CTI tyrėjas ir HECAVEX redaktorius' },
    { label: 'Patirtis', value: 'Elektroninių nusikaltimų tyrimai · finansų sektoriaus saugumas' },
    { label: 'Vieta ir kalbos', value: 'Vilnius · lietuvių · anglų' },
    { label: 'Profiliai', links: [{ label: 'GitHub', href: 'https://github.com/Hecavex' }, { label: 'LinkedIn', href: 'https://www.linkedin.com/in/deilis' }] }
  ] : [
    { label: 'Role', value: 'Independent CTI researcher and HECAVEX editor' },
    { label: 'Background', value: 'Cybercrime investigations · financial-sector security' },
    { label: 'Base and languages', value: 'Vilnius · English · Lithuanian' },
    { label: 'Profiles', links: [{ label: 'GitHub', href: 'https://github.com/Hecavex' }, { label: 'LinkedIn', href: 'https://www.linkedin.com/in/deilis' }] }
  ];

  if (translationKey === 'speaker-media') return lang === 'lt' ? [
    { label: 'Dalyvavimas', value: 'Nuotoliu arba gyvai pagal susitarimą' },
    { label: 'Formatai', value: 'Konferencija · diskusija · tinklalaidė · interviu' },
    { label: 'Kalbos', value: 'Lietuvių · anglų' },
    { label: 'Medijos rinkinys', value: 'Atverti lietuvišką rinkinį', href: '/assets/media/hecavex-media-kit-lt.html' }
  ] : [
    { label: 'Availability', value: 'Remote or in person by arrangement' },
    { label: 'Formats', value: 'Conference · panel · podcast · interview' },
    { label: 'Languages', value: 'English · Lithuanian' },
    { label: 'Media kit', value: 'Open the English media kit', href: '/assets/media/hecavex-media-kit-en.html' }
  ];

  if (translationKey === 'contact') return lang === 'lt' ? [
    { label: 'Atsakymo kanalas', value: 'Profesinės užklausos priimamos el. paštu' },
    { label: 'Tinka', value: 'Pranešimams · žiniasklaidai · bendriems tyrimams' },
    { label: 'Nurodykite', value: 'Temą · formatą · terminą' },
    { label: 'Jautri medžiaga', value: 'Nesiųskite įprastu el. paštu' }
  ] : [
    { label: 'Response channel', value: 'Professional requests are handled by email' },
    { label: 'Best for', value: 'Speaking · media · research collaboration' },
    { label: 'Include', value: 'Subject · format · deadline' },
    { label: 'Sensitive material', value: 'Do not send through ordinary email' }
  ];

  if (translationKey === 'research-index') return lang === 'lt' ? [
    { label: 'Formatai', value: 'Pirminiai tyrimai · vertinimai · komentarai' },
    { label: 'Temos', value: 'CTI · kenkėjiškas kodas · sukčiavimas · informacinės operacijos' },
    { label: 'Metodas', value: 'Įrodymai atskiriami nuo išvadų ir vertinimų' },
    { label: 'Atnaujinta', value: updated }
  ] : [
    { label: 'Formats', value: 'Primary research · assessments · commentary' },
    { label: 'Coverage', value: 'CTI · malware · fraud · information operations' },
    { label: 'Method', value: 'Evidence is kept separate from inference and assessment' },
    { label: 'Updated', value: updated }
  ];

  return [];
}

export function contactRoutesFor(lang: Lang): ActionRoute[] {
  return lang === 'lt' ? [
    { label: 'El. paštas', title: 'Profesinės užklausos', description: 'Pranešimai, interviu, ekspertiniai komentarai ir bendri tyrimai.', links: [{ label: 'Rašyti Deividui', href: 'mailto:info@hecavex.com' }] },
    { label: 'Pranešimai ir žiniasklaida', title: 'Temos, formatai ir biografija', description: 'Informacija renginių organizatoriams, redaktoriams ir tinklalaidžių kūrėjams.', links: [{ label: 'Atverti informaciją žiniasklaidai', href: '/lt/pranesejas/' }] },
    { label: 'Saugumo pranešimai', title: 'Atsakingas atskleidimas', description: 'Jautrių įrodymų nesiųskite įprastu el. paštu.', links: [{ label: 'Atverti saugumo tvarką', href: 'https://github.com/Hecavex/hecavex.github.io/security/policy' }] },
    { label: 'Vieši profiliai', title: 'Kodas ir profesinis profilis', description: 'Viešos HECAVEX saugyklos ir Deivido profesinė paskyra.', links: [{ label: 'GitHub', href: 'https://github.com/Hecavex' }, { label: 'LinkedIn', href: 'https://www.linkedin.com/in/deilis' }] }
  ] : [
    { label: 'Email', title: 'Professional enquiries', description: 'Speaking, interviews, expert commentary and research collaboration.', links: [{ label: 'Write to Deividas', href: 'mailto:info@hecavex.com' }] },
    { label: 'Speaking and media', title: 'Topics, formats and biography', description: 'Information for event organisers, editors and podcast producers.', links: [{ label: 'Open media information', href: '/en/speaker/' }] },
    { label: 'Security reports', title: 'Responsible disclosure', description: 'Do not send sensitive evidence through ordinary email.', links: [{ label: 'Open the security policy', href: 'https://github.com/Hecavex/hecavex.github.io/security/policy' }] },
    { label: 'Public profiles', title: 'Code and professional profile', description: 'Public HECAVEX repositories and Deividas’s professional profile.', links: [{ label: 'GitHub', href: 'https://github.com/Hecavex' }, { label: 'LinkedIn', href: 'https://www.linkedin.com/in/deilis' }] }
  ];
}

export function researchMapFor(lang: Lang, counts: { featured: number; primary: number; assessments: number; commentary: number; briefings: number }): OutlineItem[] {
  return lang === 'lt' ? [
    ...(counts.featured > 0 ? [{ depth: 2, slug: 'featured', text: 'Pradėkite čia', note: `Autoriaus atranka · ${counts.featured}` }] : []),
    { depth: 2, slug: 'primary', text: 'Pirminiai tyrimai', note: `Pirminiai įrodymai · ${counts.primary}` },
    { depth: 2, slug: 'assessments', text: 'Techniniai vertinimai', note: `Analizė ir metodai · ${counts.assessments}` },
    { depth: 2, slug: 'commentary', text: 'Komentarai', note: `Analitinė pozicija · ${counts.commentary}` },
    { depth: 2, slug: 'briefing-path', text: 'Signal Brief', note: `Laiku apriboti signalai · ${counts.briefings}` }
  ] : [
    ...(counts.featured > 0 ? [{ depth: 2, slug: 'featured', text: 'Start here', note: `Editor’s selection · ${counts.featured}` }] : []),
    { depth: 2, slug: 'primary', text: 'Primary research', note: `First-party evidence · ${counts.primary}` },
    { depth: 2, slug: 'assessments', text: 'Technical assessments', note: `Analysis and methods · ${counts.assessments}` },
    { depth: 2, slug: 'commentary', text: 'Commentary', note: `Analytical position · ${counts.commentary}` },
    { depth: 2, slug: 'briefing-path', text: 'Signal Brief', note: `Time-bounded signals · ${counts.briefings}` }
  ];
}
