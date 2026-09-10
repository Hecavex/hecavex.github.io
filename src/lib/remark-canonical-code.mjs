import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export const canonicalCode = Object.freeze(Object.fromEntries([
  ['xor_decode.py', 'python'], ['hunt.spl', 'plaintext'], ['hunt.kql', 'plaintext'],
  ['telemetry.rules', 'plaintext'], ['structure.yar', 'plaintext']
].map(([file, language]) => [`adform/${file}`, { path: `public/assets/detections/adform/v1.0.0/${file}`, language }])));

export function readCanonicalCode(id) {
  if (!Object.hasOwn(canonicalCode, id)) throw new Error(`Unknown canonical code reference: ${id}`);
  const entry = canonicalCode[id];
  return { ...entry, code: readFileSync(resolve(entry.path), 'utf8').replaceAll('\r\n', '\n').trimEnd() };
}

export default function remarkCanonicalCode() {
  return tree => {
    function visit(node) {
      if (node.type === 'code' && node.lang === 'hecavex-code') {
        const entry = readCanonicalCode(node.value.trim());
        node.lang = entry.language;
        node.value = entry.code;
      }
      for (const child of node.children ?? []) visit(child);
    }
    visit(tree);
  };
}
