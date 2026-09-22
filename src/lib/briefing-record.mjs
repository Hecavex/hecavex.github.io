/** YAML may hydrate a date-only value as a Date. Preserve its UTC calendar day,
 * without leaking the build machine's timezone or native Date string into UI. */
export function coverageDate(value) {
  if (value instanceof Date) return Number.isFinite(value.valueOf()) ? value.toISOString().slice(0, 10) : '—';
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return '—';
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.valueOf()) && date.toISOString().slice(0, 10) === value ? value : '—';
}
