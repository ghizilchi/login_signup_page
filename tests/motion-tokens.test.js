import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const tokens = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');
const legacy = readFileSync(new URL('../legacy/style.css', import.meta.url), 'utf8');

test('shared motion tokens retain the original interaction timings', () => {
  assert.match(tokens, /--motion-field: border-color \.3s ease, box-shadow \.3s ease, background \.3s ease, transform \.3s var\(--ease\)/);
  assert.match(tokens, /--motion-button: transform \.35s var\(--ease\), box-shadow \.35s ease, background-position \.5s ease/);
  assert.match(tokens, /--motion-button-shine: right \.8s ease/);
});

test('shared controls consume centralized motion tokens', () => {
  for (const token of ['--motion-field', '--motion-button', '--motion-secondary-button', '--motion-button-arrow', '--motion-button-shine', '--motion-back-button']) {
    assert.ok(legacy.includes(`transition: var(${token});`), `Missing use of ${token}`);
  }
});

test('original animation keyframes and reduced-motion support remain present', () => {
  for (const keyframe of ['fadeDown', 'containerReveal', 'gemFloatElegant', 'successReveal', 'loginPanelIn']) {
    assert.match(legacy, new RegExp(`@keyframes ${keyframe}\\s*\\{`));
  }
  assert.match(legacy, /@media \(prefers-reduced-motion: reduce\)/);
});
