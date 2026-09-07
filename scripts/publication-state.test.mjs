import assert from 'node:assert/strict';
import test from 'node:test';
import { isApprovedPublication } from '../src/lib/publication-state.mjs';

test('only two explicit boolean approvals publish a record', () => {
  for (const draft of [undefined, null, true, false, 'false']) {
    for (const published of [undefined, null, true, false, 'true']) {
      assert.equal(isApprovedPublication({ draft, published }), draft === false && published === true);
    }
  }
});
test('an unpaired withheld draft does not become part of the public bilingual population', () => {
  const records = [
    { lang: 'en', draft: false, published: true },
    { lang: 'lt', draft: false, published: true },
    { lang: 'en', draft: true, published: false }
  ];
  assert.deepEqual(records.filter(isApprovedPublication).map((record) => record.lang), ['en', 'lt']);
});
