import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const tokens = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');
const legacyCss = readFileSync(new URL('../legacy/style.css', import.meta.url), 'utf8');
const tailwind = readFileSync(new URL('../src/styles/tailwind.css', import.meta.url), 'utf8');
const button = readFileSync(new URL('../src/components/ui/Button.jsx', import.meta.url), 'utf8');
const field = readFileSync(new URL('../src/components/ui/TextField.jsx', import.meta.url), 'utf8');

test('original palette is centralized exactly once', () => {
  for (const [name, value] of Object.entries({
    cream: '#f7f3e8', green: '#075b4a', 'green-soft': '#0b6b58',
    'dark-green': '#03483b', gold: '#c89b3c', 'light-gold': '#e2c56b',
    'pale-gold': '#f3df9b', text: '#18342e', muted: '#6b7c76',
    white: '#ffffff', border: '#e3e8e5', error: '#c94b4b', success: '#23865f',
  })) {
    assert.match(tokens, new RegExp(`--${name}:\\s*${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
    assert.doesNotMatch(legacyCss, new RegExp(`--${name}:\\s*`));
  }
});

test('Tailwind exposes semantic color and font tokens without Preflight', () => {
  assert.match(tailwind, /--color-brand-green:\s*var\(--green\)/);
  assert.match(tailwind, /--color-danger:\s*var\(--error\)/);
  assert.match(tailwind, /--font-vazirmatn:/);
  assert.doesNotMatch(tailwind, /@import\s+["']tailwindcss["']/);
});

test('shared controls retain the original visual class hooks', () => {
  assert.match(button, /primary-button/);
  assert.match(button, /secondary-button/);
  assert.match(button, /back-button/);
  assert.match(field, /FieldShell/);
  assert.match(field, /input-wrapper/);
});
