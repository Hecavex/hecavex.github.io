/** UTC exercise arithmetic only. Not legal advice, reportability logic or an SRP client. */
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

function utc(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value)) throw new Error('An explicit UTC timestamp is required');
  const date = new Date(value);
  if (!Number.isFinite(date.valueOf()) || date.toISOString().slice(0, 19) !== value.slice(0, 19)) throw new Error('Invalid UTC date');
  return date;
}
const plusHours = (date, hours) => new Date(date.valueOf() + hours * 3600000).toISOString();
function sameDayNextMonth(value) {
  const date = utc(value);
  const day = date.getUTCDate();
  date.setUTCMonth(date.getUTCMonth() + 1);
  if (date.getUTCDate() !== day) throw new Error('Month-end legal computation needs qualified review; this exercise does not choose a rollover rule');
  return date.toISOString();
}
export function exerciseOuterTimes(record) {
  const awareness = utc(record.awarenessAt);
  if (record.notificationSubmittedAt && utc(record.notificationSubmittedAt) < awareness) throw new Error('Notification precedes awareness in this fixture');
  if (!['actively-exploited-vulnerability', 'severe-incident'].includes(record.kind)) throw new Error('Unknown exercise path');
  const final = record.kind === 'actively-exploited-vulnerability'
    ? (record.correctiveMeasureAvailableAt ? plusHours(utc(record.correctiveMeasureAvailableAt), 14 * 24) : null)
    : (record.notificationSubmittedAt ? sameDayNextMonth(record.notificationSubmittedAt) : null);
  return { earlyWarningNoLaterThan: plusHours(awareness, 24), notificationNoLaterThan: plusHours(awareness, 72), finalReportNoLaterThan: final };
}
export function rehearse(scenario) {
  if (scenario.fictional !== true || scenario.notOfficialForm !== true) throw new Error('Only the explicitly fictional exercise is accepted');
  return scenario.cases.map(record => ({ id: record.id, fictional: true, basis: 'outer limits only; without-undue-delay and real legal assessment remain separate', ...exerciseOuterTimes(record) }));
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const scenario = JSON.parse(await readFile(new URL('scenario.json', import.meta.url), 'utf8'));
  console.log(JSON.stringify({ release: scenario.release, legalReview: scenario.legalReview, results: rehearse(scenario) }, null, 2));
}
