import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');

test('TextField delegates its shared layout and state classes to FieldShell', () => {
  const field = read('../src/components/ui/TextField.jsx');
  assert.match(field, /import FieldShell/);
  assert.match(field, /<FieldShell/);
  assert.match(field, /input-wrapper/);
});

test('signup custom controls use the same field shell', () => {
  const signup = read('../src/components/SignupForm.jsx');
  for (const id of ['mobile', 'verificationCode', 'password', 'confirmPassword']) {
    assert.match(signup, new RegExp(`<FieldShell[^>]*id="${id}"`));
  }
});

test('login OTP uses the shared field shell and keeps accessibility state', () => {
  const login = read('../src/components/LoginView.jsx');
  assert.match(login, /<FieldShell[^>]*id="loginOtp"/);
  assert.match(login, /aria-invalid=\{Boolean\(errors\.otp\)\}/);
});
