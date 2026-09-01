#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { deflateSync } from 'node:zlib';

const outputRoot = resolve(import.meta.dirname, '..', 'public');
const checkOnly = process.argv.includes('--check');
const sampleGrid = 4;
const palette = {
  background: [17, 20, 22, 255],
  signal: [85, 185, 177, 255],
  text: [236, 233, 225, 255],
  transparent: [0, 0, 0, 0],
};

const crcTable = new Uint32Array(256);
for (let value = 0; value < 256; value += 1) {
  let crc = value;
  for (let bit = 0; bit < 8; bit += 1) {
    crc = (crc & 1) === 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
  }
  crcTable[value] = crc >>> 0;
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const name = Buffer.from(type, 'ascii');
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([length, name, data, checksum]);
}

function encodePng(width, height, rgba) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 6;
  const raw = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y += 1) {
    const target = y * (1 + width * 4);
    raw[target] = 0;
    rgba.copy(raw, target + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([
    Buffer.from('89504e470d0a1a0a', 'hex'),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function distanceToSegment(x, y, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSquared = dx * dx + dy * dy;
  const projected = lengthSquared === 0 ? 0 : ((x - x1) * dx + (y - y1) * dy) / lengthSquared;
  const t = Math.max(0, Math.min(1, projected));
  return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy));
}

function insideRoundedSquare(x, y) {
  if (x < 0 || y < 0 || x > 64 || y > 64) return false;
  const nearestX = Math.max(10, Math.min(54, x));
  const nearestY = Math.max(10, Math.min(54, y));
  return Math.hypot(x - nearestX, y - nearestY) <= 10;
}

const markSegments = [
  [12, 10, 12, 54],
  [52, 10, 52, 54],
  [12, 32, 52, 32],
  [17, 14, 47, 50],
  [47, 14, 17, 50],
];

function sampleColor(x, y) {
  let color = insideRoundedSquare(x, y) ? palette.background : palette.transparent;
  if (markSegments.some(([x1, y1, x2, y2]) => distanceToSegment(x, y, x1, y1, x2, y2) <= 3)) {
    color = palette.signal;
  }
  if (Math.hypot(x - 32, y - 32) <= 4) color = palette.text;
  return color;
}

function renderIcon(size) {
  const rgba = Buffer.alloc(size * size * 4);
  const sampleCount = sampleGrid * sampleGrid;
  for (let py = 0; py < size; py += 1) {
    for (let px = 0; px < size; px += 1) {
      const totals = [0, 0, 0, 0];
      for (let sy = 0; sy < sampleGrid; sy += 1) {
        for (let sx = 0; sx < sampleGrid; sx += 1) {
          const x = (px + (sx + 0.5) / sampleGrid) * (64 / size);
          const y = (py + (sy + 0.5) / sampleGrid) * (64 / size);
          const color = sampleColor(x, y);
          for (let channel = 0; channel < 4; channel += 1) totals[channel] += color[channel];
        }
      }
      const offset = (py * size + px) * 4;
      for (let channel = 0; channel < 4; channel += 1) {
        rgba[offset + channel] = Math.round(totals[channel] / sampleCount);
      }
    }
  }
  return encodePng(size, size, rgba);
}

function encodeIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const entries = [];
  let offset = 6 + images.length * 16;
  for (const { size, data } of images) {
    const entry = Buffer.alloc(16);
    entry[0] = size === 256 ? 0 : size;
    entry[1] = size === 256 ? 0 : size;
    entry[2] = 0;
    entry[3] = 0;
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += data.length;
  }
  return Buffer.concat([header, ...entries, ...images.map(({ data }) => data)]);
}

const outputs = new Map();
for (const [name, size] of [
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
]) {
  outputs.set(name, renderIcon(size));
}
outputs.set(
  'favicon.ico',
  encodeIco([16, 32, 48].map((size) => ({ size, data: renderIcon(size) }))),
);

await mkdir(outputRoot, { recursive: true });
const mismatches = [];
for (const [name, data] of outputs) {
  const path = join(outputRoot, name);
  if (checkOnly) {
    let current;
    try {
      current = await readFile(path);
    } catch {
      mismatches.push(`${name} is missing`);
      continue;
    }
    if (!current.equals(data)) mismatches.push(`${name} is stale`);
  } else {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, data);
  }
}

if (mismatches.length > 0) {
  throw new Error(`Identity asset check failed:\n- ${mismatches.join('\n- ')}`);
}
console.log(checkOnly ? 'Favicon assets are current.' : `Generated ${outputs.size} favicon assets.`);
