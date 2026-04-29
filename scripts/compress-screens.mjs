import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const dir = new URL('../public/screens/', import.meta.url).pathname;
const files = (await readdir(dir)).filter((f) => f.endsWith('.png'));

const TARGET_WIDTH = 720;

for (const file of files) {
  const src = join(dir, file);
  const base = file.replace(/\.png$/, '');
  const before = (await stat(src)).size;

  const webp = join(dir, `${base}.webp`);
  const avif = join(dir, `${base}.avif`);

  const pipeline = sharp(src).resize({ width: TARGET_WIDTH, withoutEnlargement: true });

  await pipeline.clone().webp({ quality: 82, effort: 6 }).toFile(webp);
  await pipeline.clone().avif({ quality: 60, effort: 6 }).toFile(avif);

  const webpSize = (await stat(webp)).size;
  const avifSize = (await stat(avif)).size;
  const fmt = (n) => `${(n / 1024).toFixed(0)}KB`;
  console.log(
    `${file}: ${fmt(before)} → webp ${fmt(webpSize)} (${Math.round((webpSize / before) * 100)}%), avif ${fmt(avifSize)} (${Math.round((avifSize / before) * 100)}%)`,
  );
}
