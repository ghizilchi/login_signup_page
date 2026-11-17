import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const css = readFileSync(new URL('../legacy/style.css', import.meta.url), 'utf8');

test('global reduced-motion rule is retained only once', () => {
  const blocks = [...css.matchAll(/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{([\s\S]*?)\n\}/g)].map(x => x[1]);
  assert.equal(blocks.filter(x => /animation-duration:\s*\.01ms !important/.test(x)).length, 1);
});
test('gem and auth switch reduced-motion overrides remain', () => {
  assert.match(css, /\.gem-mouse-layer\s*\{[\s\S]*?display:\s*none !important/);
  assert.match(css, /\.auth-switch-button\.active \.auth-switch-glint\s*\{\s*animation:\s*none;/);
});
test('responsive breakpoints and critical visual selectors remain', () => {
  for (const q of ['max-width: 900px','max-width: 600px','max-width: 380px','min-width: 901px']) assert.ok(css.includes(q), q);
  for (const s of ['.signup-container','.gem-section','.form-section','.primary-button','.success-state','.login-view']) assert.ok(css.includes(s), s);
});
