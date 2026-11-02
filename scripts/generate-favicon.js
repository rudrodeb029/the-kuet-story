import fs from 'fs';
import zlib from 'zlib';

function createPng(width, height, rgbaBuffer) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdr);

  // IDAT chunk: filter byte (0 = None) before each scanline
  const scanlineLength = width * 4;
  const filtered = Buffer.alloc(height * (scanlineLength + 1));
  for (let y = 0; y < height; y++) {
    filtered[y * (scanlineLength + 1)] = 0; // Filter: None
    rgbaBuffer.copy(filtered, y * (scanlineLength + 1) + 1, y * scanlineLength, (y + 1) * scanlineLength);
  }
  const compressed = zlib.deflateSync(filtered);
  const idatChunk = makeChunk('IDAT', compressed);

  // IEND chunk
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = crc32(Buffer.concat([typeBuf, data]));
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc, 0);
  return Buffer.concat([length, typeBuf, data, crcBuf]);
}

function crc32(buf) {
  let table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c;
  }
  let crc = 0 ^ -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

function renderHeart(size) {
  const buf = Buffer.alloc(size * size * 4);
  const cx = (size - 1) / 2;
  const cy = (size - 1) / 2 + 1;
  const scale = size / 32;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      // Heart formula: (x^2 + y^2 - 1)^3 - x^2 * y^3 <= 0
      // Normalize coords to [-1.4, 1.4]
      const nx = (x - cx) / (11 * scale);
      const ny = -(y - cy + 2 * scale) / (11 * scale);

      const val = Math.pow(nx * nx + ny * ny - 1, 3) - nx * nx * Math.pow(ny, 3);
      if (val <= 0.05) {
        const t = Math.max(0, Math.min(1, (ny + 1.2) / 2.2));
        // Gradient from rose pink to deep red
        const r = Math.round(255 - t * 40);
        const g = Math.round(30 + t * 40);
        const b = Math.round(85 + t * 30);
        const alpha = val <= 0 ? 255 : Math.round((1 - val / 0.05) * 255);
        buf[idx] = r;
        buf[idx + 1] = g;
        buf[idx + 2] = b;
        buf[idx + 3] = alpha;
      }
    }
  }
  return buf;
}

const size = 32;
const rgba = renderHeart(size);
const png = createPng(size, size, rgba);
fs.writeFileSync('public/favicon.png', png);

// Create ICO containing the PNG
const icoHeader = Buffer.alloc(22);
icoHeader.writeUInt16LE(0, 0); // reserved
icoHeader.writeUInt16LE(1, 2); // type 1 = icon
icoHeader.writeUInt16LE(1, 4); // 1 image
icoHeader[6] = size;           // width
icoHeader[7] = size;           // height
icoHeader[8] = 0;              // color palette
icoHeader[9] = 0;              // reserved
icoHeader.writeUInt16LE(1, 10); // color planes
icoHeader.writeUInt16LE(32, 12); // bpp
icoHeader.writeUInt32LE(png.length, 14); // data size
icoHeader.writeUInt32LE(22, 18); // offset

const ico = Buffer.concat([icoHeader, png]);
fs.writeFileSync('public/favicon.ico', ico);
console.log('Favicon generated successfully!');

