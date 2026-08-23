import { readFile, readdir } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

const rasterExtensions = new Set(['.gif', '.jpeg', '.jpg', '.png', '.webp']);

function unsigned24(buffer, offset) {
  return buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16);
}

function pngDimensions(buffer) {
  if (buffer.length < 24 || buffer.toString('hex', 0, 8) !== '89504e470d0a1a0a') return undefined;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function gifDimensions(buffer) {
  if (buffer.length < 10 || !/^GIF8[79]a$/.test(buffer.toString('ascii', 0, 6))) return undefined;
  return { width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8) };
}

function jpegDimensions(buffer) {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return undefined;
  const startOfFrame = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
  let offset = 2;
  while (offset + 3 < buffer.length) {
    while (buffer[offset] === 0xff) offset += 1;
    const marker = buffer[offset];
    offset += 1;
    if (marker === 0xd8 || marker === 0xd9) continue;
    if (marker === 0xda) break;
    const length = buffer.readUInt16BE(offset);
    if (length < 2 || offset + length > buffer.length) break;
    if (startOfFrame.has(marker) && length >= 7) {
      return { width: buffer.readUInt16BE(offset + 5), height: buffer.readUInt16BE(offset + 3) };
    }
    offset += length;
  }
  return undefined;
}

function webpDimensions(buffer) {
  if (buffer.length < 30 || buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WEBP') return undefined;
  const format = buffer.toString('ascii', 12, 16);
  if (format === 'VP8X') return { width: unsigned24(buffer, 24) + 1, height: unsigned24(buffer, 27) + 1 };
  if (format === 'VP8L' && buffer[20] === 0x2f) {
    const width = 1 + buffer[21] + ((buffer[22] & 0x3f) << 8);
    const height = 1 + ((buffer[22] & 0xc0) >> 6) + (buffer[23] << 2) + ((buffer[24] & 0x0f) << 10);
    return { width, height };
  }
  if (format === 'VP8 ' && buffer.toString('hex', 23, 26) === '9d012a') {
    return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
  }
  return undefined;
}

function svgDimensions(buffer) {
  const source = buffer.toString('utf8');
  const tag = source.match(/<svg\b[^>]*>/i)?.[0];
  if (!tag) return undefined;
  const number = (name) => {
    const raw = tag.match(new RegExp(`\\s${name}=["']([0-9]+(?:\\.[0-9]+)?)(?:px)?["']`, 'i'))?.[1];
    return raw ? Math.round(Number(raw)) : undefined;
  };
  const width = number('width');
  const height = number('height');
  if (width && height) return { width, height };
  const viewBox = tag.match(/\sviewBox=["']\s*[-+0-9.eE]+\s+[-+0-9.eE]+\s+([-+0-9.eE]+)\s+([-+0-9.eE]+)\s*["']/i);
  if (!viewBox) return undefined;
  const viewWidth = Math.round(Number(viewBox[1]));
  const viewHeight = Math.round(Number(viewBox[2]));
  return viewWidth > 0 && viewHeight > 0 ? { width: viewWidth, height: viewHeight } : undefined;
}

export function imageDimensions(buffer) {
  return pngDimensions(buffer) ?? gifDimensions(buffer) ?? jpegDimensions(buffer) ?? webpDimensions(buffer) ?? svgDimensions(buffer);
}

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
}

export async function buildImageDimensionMap(publicationRoot) {
  const imageRoot = join(publicationRoot, 'assets', 'img');
  const output = new Map();
  for (const file of await walk(imageRoot)) {
    const extension = extname(file).toLowerCase();
    if (!rasterExtensions.has(extension) && extension !== '.svg') continue;
    const dimensions = imageDimensions(await readFile(file));
    if (!dimensions?.width || !dimensions?.height) throw new Error(`Unable to read intrinsic dimensions for ${file}`);
    const url = `/assets/img/${relative(imageRoot, file).replaceAll('\\', '/')}`;
    output.set(url, dimensions);
  }
  return output;
}
