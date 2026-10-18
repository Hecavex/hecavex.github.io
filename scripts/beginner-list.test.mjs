import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { beginnerList } from '../src/lib/beginner-list.mjs';
import { validateAudience } from './validate-content.mjs';

const post = (translationKey, day, audience = 'in-depth', contentType = 'technical-guide') => ({ translationKey, audience, contentType, lang: 'en', date: new Date(`2026-01-${String(day).padStart(2, '0')}T00:00:00Z`) });
const posts = [post('a', 1, 'beginner'), post('b', 5, 'beginner'), post('c', 9), post('d', 3, 'beginner'), post('brief', 20, 'beginner', 'signal-brief')];
const keys = (list) => list.map((item) => item.translationKey);

test('curated keys come first in file order, then other beginner posts newest first, without duplicates', () => {
  assert.deepEqual(keys(beginnerList(posts, ['c', 'a'])), ['c', 'a', 'b', 'd']);
});

test('signal briefs are excluded', () => {
  assert.deepEqual(keys(beginnerList(posts, [])), ['b', 'd', 'a']);
});

test('a curated key without a post throws', () => {
  assert.throws(() => beginnerList(posts, ['missing']), /Missing start-here publication: missing\/en/);
});

const problems = (data) => { const errors = []; validateAudience(data, 'x.md', errors); return errors; };
const summary = 'A plain summary that is comfortably longer than forty characters.';

test('audience and summary rules', () => {
  assert.deepEqual(problems({}), []);
  assert.deepEqual(problems({ audience: 'beginner', summary, content_type: 'technical-guide' }), []);
  assert(problems({ audience: 'expert' })[0].includes('audience must be'));
  assert(problems({ audience: 'beginner' }).some((e) => e.includes('requires summary')));
  assert(problems({ audience: 'beginner', summary, content_type: 'signal-brief' }).some((e) => e.includes('signal brief')));
  assert(problems({ summary: 'too short' }).some((e) => e.includes('40-280')));
  assert(problems({ summary: `${summary}\nsecond line` }).some((e) => e.includes('single line')));
  assert(problems({ summary: `${summary} hxxp://bad.example` }).some((e) => e.includes('links')));
  assert(problems({ summary: `${summary} https://bad.example` }).some((e) => e.includes('links')));
});

test('article_newcomer keeps exactly two {link} placeholders in both languages', () => {
  for (const lang of ['en', 'lt']) {
    const text = parse(readFileSync(new URL(`../src/data/hecavex/${lang}.yml`, import.meta.url), 'utf8')).article_newcomer;
    assert.equal((text.match(/\{[^}]+\}/g) ?? []).length, 2, lang);
  }
});

test('summary rejects defanged domains', () => {
  assert(problems({ summary: `${summary} bad[.]example` }).some((e) => e.includes('links')));
});
