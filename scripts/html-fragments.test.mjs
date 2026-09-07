import assert from 'node:assert/strict';
import test from 'node:test';
import { hasFragment } from '../src/lib/html-fragments.mjs';
import { recordLabel } from '../src/lib/record-labels.mjs';

test('Unicode and encoded internal headings resolve without transliteration', () => {
  const html = '<h2 id="ką-daryti-po-duomenų-suvedimo">Heading</h2>';
  assert.ok(hasFragment(html, '#ką-daryti-po-duomenų-suvedimo'));
  assert.ok(hasFragment(html, '#k%C4%85-daryti-po-duomen%C5%B3-suvedimo'));
  assert.equal(hasFragment(html, '#ka-daryti-po-duomenu-suvedimo'), false);
  assert.equal(hasFragment(html, '#%ZZ'), false);
  assert.ok(hasFragment(html, '#'));
});
test('controlled Lithuanian record labels are translated and unknown is explicit', () => {
  assert.equal(recordLabel('high', 'lt'), 'Aukštas');
  assert.equal(recordLabel('moderate', 'lt'), 'Vidutinis');
  assert.equal(recordLabel('published', 'lt'), 'Paskelbta');
  assert.equal(recordLabel('updated', 'lt'), 'Atnaujinta');
  assert.equal(recordLabel(undefined, 'lt'), 'Nenurodyta');
});
