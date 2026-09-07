const labels = {
  high: { en: 'High', lt: 'Aukštas' },
  moderate: { en: 'Moderate', lt: 'Vidutinis' },
  low: { en: 'Low', lt: 'Žemas' },
  published: { en: 'Published', lt: 'Paskelbta' },
  updated: { en: 'Updated', lt: 'Atnaujinta' },
  corrected: { en: 'Corrected', lt: 'Pataisyta' },
  retracted: { en: 'Retracted', lt: 'Atšaukta' },
  'not stated': { en: 'Not stated', lt: 'Nenurodyta' }
};
export const recordLabel = (value, lang) => labels[value]?.[lang] ?? labels['not stated'][lang];
