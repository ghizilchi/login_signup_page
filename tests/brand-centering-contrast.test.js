import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const css = readFileSync(new URL('../legacy/style.css', import.meta.url), 'utf8');
const gem = readFileSync(new URL('../src/components/GemSection.jsx', import.meta.url), 'utf8');
const brand = readFileSync(new URL('../src/components/Brand.jsx', import.meta.url), 'utf8');
test('brand uses explicit centered positioning independent of RTL direction', () => {
 const b = css.match(/\.gem-section > \.brand\s*\{([^}]*)\}/)?.[1] ?? '';
 assert.match(b,/left:\s*50% !important/); assert.match(b,/right:\s*auto !important/);
 assert.match(b,/transform:\s*translateX\(-50%\) !important/);
});
test('brand text has high contrast on the green gem panel', () => {
 assert.match(css,/\.brand-name span\s*\{[^}]*color:\s*#fff4d6 !important/s);
 assert.match(css,/\.brand-name small\s*\{[^}]*color:\s*#e9d7a5 !important/s);
 assert.match(brand,/#fff4d6/);
});
test('pointer glow is suppressed over both the gem and brand', () => {
 assert.match(gem,/const onBrand = brandRect/);
 assert.match(gem,/onGem \|\| onBrand \? '0' : '1'/);
});
