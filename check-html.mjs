// Pemeriksaan sederhana keseimbangan tag di app.html
import { readFileSync } from 'fs';
const html = readFileSync(new URL('./app.html', import.meta.url), 'utf8');
const voids = new Set([
  // HTML void elements
  'meta', 'link', 'br', 'hr', 'input', 'img', 'path', 'source',
  'area', 'base', 'col', 'embed', 'track', 'wbr',
  // SVG yang hampir selalu self-closed; fallback bila ditulis tanpa '/>'
  'circle', 'ellipse', 'line', 'polygon', 'polyline', 'rect', 'use', 'stop',
]);
const stack = [];
let errors = 0;
const re = /<\/?([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^"'>])*)>/g;
let m;
while ((m = re.exec(html))) {
  const [full, tag, attrs] = m;
  const t = tag.toLowerCase();
  if (voids.has(t) || full.endsWith('/>')) continue;
  if (full.startsWith('</')) {
    const top = stack.pop();
    if (top !== t) { console.log(`MISMATCH: </${t}> tapi yang terbuka <${top}>`); errors++; }
  } else {
    if (!attrs.endsWith('/')) stack.push(t);
  }
}
if (stack.length) { console.log('BELUM DITUTUP:', stack.join(', ')); errors++; }
console.log(errors === 0 ? 'OK: semua tag seimbang' : `${errors} masalah ditemukan`);
process.exit(errors ? 1 : 0);
