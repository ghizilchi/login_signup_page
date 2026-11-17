import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');

test('shared Panel supports semantic element, variants, props and children', () => {
  const panel = read('../src/components/ui/Panel.jsx');
  assert.match(panel, /as: Element = 'div'/);
  assert.match(panel, /variant = 'default'/);
  assert.match(panel, /ui-panel--\$\{variant\}/);
  assert.match(panel, /\.\.\.props/);
});

test('main glass surface and content surface use the shared Panel', () => {
  const app = read('../src/App.jsx');
  assert.match(app, /<Panel as="section" variant="glass" className=\{`signup-container/);
  assert.match(app, /<Panel variant="content" className="form-section/);
  assert.match(app, /<\/Panel>\s*<\/Panel>/);
});

test('success surface uses the shared Panel without removing legacy hooks', () => {
  const success = read('../src/components/SuccessState.jsx');
  assert.match(success, /<Panel variant="success" className="success-state active" id="successState">/);
  assert.match(success, /<\/Panel>/);
  assert.match(success, /success-orbit/);
  assert.match(success, /success-icon/);
});
