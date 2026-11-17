import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const app = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
const brand = readFileSync(new URL('../src/components/Brand.jsx', import.meta.url), 'utf8');
const signup = readFileSync(new URL('../src/components/SignupForm.jsx', import.meta.url), 'utf8');
const login = readFileSync(new URL('../src/components/LoginView.jsx', import.meta.url), 'utf8');
const tailwind = readFileSync(new URL('../src/styles/tailwind.css', import.meta.url), 'utf8');
const legacy = readFileSync(new URL('../legacy/style.css', import.meta.url), 'utf8');

test('legacy stylesheet is loaded in the component layer before Tailwind utilities', () => {
  assert.match(tailwind, /@import "\.\.\/\.\.\/legacy\/style\.css" layer\(components\)/);
  assert.match(tailwind, /@import "tailwindcss\/utilities" layer\(utilities\)/);
  assert.doesNotMatch(app, /legacy\/style\.css/);
});

test('page and brand layout are expressed with responsive Tailwind utilities', () => {
  assert.match(app, /min-h-screen[\s\S]*justify-center[\s\S]*max-\[600px\]:py-\[20px\]/);
  assert.match(brand, /flex items-center gap-\[11px\][\s\S]*max-\[600px\]:mb-\[18px\]/);
});

test('form layout utilities preserve the original desktop and mobile dimensions', () => {
  assert.match(app, /px-\[55px\] py-\[50px\] max-\[900px\]:p-\[40px\][\s\S]*max-\[380px\]:py-\[27px\]/);
  assert.match(signup, /grid-cols-2 gap-\[18px\] max-\[600px\]:grid-cols-1 max-\[600px\]:gap-0/);
  assert.match(signup, /gap-3 max-\[600px\]:gap-\[5px\]/);
  assert.match(login, /gap-3 max-\[600px\]:gap-\[5px\]/);
});

test('migrated base selectors no longer own duplicate layout declarations', () => {
  const pageBlock = legacy.match(/\/\* PAGE \*\/[\s\S]*?\/\* AMBIENT GRID \*\//)?.[0] ?? '';
  assert.doesNotMatch(pageBlock, /\.signup-page\s*\{[\s\S]*?display:\s*flex/);
  const gridBlock = legacy.match(/\/\* INPUT GRID \*\/[\s\S]*?\/\* INPUT GROUP \*\//)?.[0] ?? '';
  assert.doesNotMatch(gridBlock, /\.input-grid\s*\{[\s\S]*?display:\s*grid/);
});


test('shared button and input primitives are used by React components', () => {
  const button = readFileSync(new URL('../src/components/ui/Button.jsx', import.meta.url), 'utf8');
  const textField = readFileSync(new URL('../src/components/ui/TextField.jsx', import.meta.url), 'utf8');
  const componentStyles = readFileSync(new URL('../src/styles/components.css', import.meta.url), 'utf8');
  assert.equal((button.match(/ui-button/g) || []).length, 3);
  assert.match(textField, /ui-field-control/);
  assert.match(componentStyles, /\.ui-button\s*\{[^}]*font-family:\s*inherit/);
  assert.match(componentStyles, /\.ui-field-control\s*\{[^}]*width:\s*100%/);
});

test('visual button and input states remain in the legacy stylesheet', () => {
  assert.match(legacy, /\.primary-button:hover\s*\{/);
  assert.match(legacy, /\.secondary-button:disabled\s*\{/);
  assert.match(legacy, /\.input-wrapper input:focus\s*\{/);
  assert.match(legacy, /\.input-wrapper\.error input\s*\{/);
});
