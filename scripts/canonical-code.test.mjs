import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import canonicalPlugin, { canonicalCode, readCanonicalCode } from '../src/lib/remark-canonical-code.mjs';

test('each executable Adform example has one source and both editions include it', () => {
  for (const lang of ['en', 'lt']) {
    const source = readFileSync(`src/content/posts/${lang}/research/malware-analyses/2026-08-08-adform-supply-chain-crypto-clipper.md`, 'utf8');
    for (const id of Object.keys(canonicalCode)) assert.equal(source.split(`\n${id}\n`).length, 2, `${lang}: ${id}`);
    assert(!source.includes('let start ='));
  }
});
test('canonical inclusion is allowlisted and preserves bytes through the Markdown AST', () => {
  for (const id of Object.keys(canonicalCode)) {
    const tree = {children: [{type:'code',lang:'hecavex-code',value:id}]};
    canonicalPlugin()(tree);
    assert.equal(tree.children[0].value,readCanonicalCode(id).code);
  }
  assert.throws(() => readCanonicalCode('../../package.json'), /Unknown/);
  assert.throws(() => readCanonicalCode('__proto__'), /Unknown/);
});
test('mandatory KQL and Suricata separators survive editorial changes', () => {
  const kql=readCanonicalCode('adform/hunt.kql').code;
  for (const line of kql.split('\n').filter(line=>line.startsWith('let '))) assert(line.endsWith(';'));
  const rules=readCanonicalCode('adform/telemetry.rules').code;
  for (const line of rules.split('\n').filter(line=>/^\s+(msg|flow|http|content|classtype)/.test(line))) assert(line.replace(/\s*\\$/, '').endsWith(';'));
  for (const line of rules.split('\n').slice(0,-1)) assert(line.endsWith('\\'), 'Multiline Suricata rule requires line continuation');
  assert.match(rules,/http\.uri; content:/);
});
