import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');

test('brand is inside the gem panel and removed from the page-level flow', () => {
  const app = read('../src/App.jsx');
  const gem = read('../src/components/GemSection.jsx');
  const css = read('../legacy/style.css');
  assert.doesNotMatch(app, /<Brand\s*\/>/);
  assert.match(gem, /<Brand\s*\/>/);
  assert.match(css, /\.gem-section > \.brand\s*\{[\s\S]*?position:\s*absolute/);
});

test('gem pointer hit testing uses the visible gem image bounds, not the wrapper', () => {
  const gem = read('../src/components/GemSection.jsx');
  assert.match(gem, /gemImageRef\.current\.getBoundingClientRect\(\)/);
  assert.doesNotMatch(gem, /gemWrapperRef\.current\.getBoundingClientRect\(\)/);
});

test('signup card scales independently of viewport and step spacing is reduced', () => {
  const css = read('../legacy/style.css');
  assert.match(css, /\.signup-container\s*\{\s*zoom:\s*\.9;/);
  assert.match(css, /#signupForm \.form-step > \.next-button\s*\{\s*margin-top:\s*20px !important;/);
  assert.match(css, /\.stepper\s*\{\s*margin-bottom:\s*32px;/);
});
