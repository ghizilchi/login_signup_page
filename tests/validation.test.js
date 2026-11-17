import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeDigits, digitsOnly } from '../src/utils/digits.js';
import { getPasswordChecks, getPasswordStrength } from '../src/utils/password.js';
import { validateSignupStep, isValidMobile, isValidEmail } from '../src/utils/validation.js';

test('normalizes Persian and Arabic digits', () => {
  assert.equal(normalizeDigits('۰۱۲٣۴۵'), '012345');
  assert.equal(digitsOnly('۰۹۱۲-۳۴۵'), '0912345');
});

test('mobile and email validation', () => {
  assert.equal(isValidMobile('۰۹۱۲۳۴۵۶۷۸۹'), true);
  assert.equal(isValidMobile('0912345678'), false);
  assert.equal(isValidEmail('user@example.com'), true);
  assert.equal(isValidEmail('bad-email'), false);
});

test('password policy matches the original page', () => {
  assert.deepEqual(getPasswordChecks('Abcdef1!'), {
    length: true, uppercase: true, special: true, allowed: true,
  });
  assert.equal(getPasswordStrength('Abcdef1!').valid, true);
  assert.equal(getPasswordStrength('فارسی123').valid, false);
});

test('step 1 returns field-specific errors without touching the DOM', () => {
  assert.deepEqual(validateSignupStep(1, {
    firstName: 'ع', lastName: '',
  }), {
    firstName: 'لطفاً نام خود را وارد کنید.',
    lastName: 'لطفاً نام خانوادگی خود را وارد کنید.',
  });
});

test('step 2 requires a sent code and valid email', () => {
  const errors = validateSignupStep(2, {
    mobile: '09123456789', verificationCode: '123456', email: 'a@b.com',
  }, { codeSent: false });
  assert.equal(errors.mobile, 'ابتدا کد تأیید را برای این شماره ارسال کنید.');
  assert.equal('verificationCode' in errors, false);
});

test('step 2 accepts a valid mobile only after the demo code is sent', () => {
  const values = {
    mobile: '۰۹۱۲۳۴۵۶۷۸۹', verificationCode: '۱۲۳۴۵۶', email: 'person@example.com',
  };
  assert.deepEqual(validateSignupStep(2, values, { codeSent: true }), {});
});

test('step 3 checks password policy and confirmation', () => {
  assert.deepEqual(validateSignupStep(3, {
    password: 'Abcdef1!', confirmPassword: 'Abcdef1!',
  }), {});
  assert.equal(validateSignupStep(3, {
    password: 'Abcdef1!', confirmPassword: 'different',
  }).confirmPassword, 'تکرار رمز عبور با رمز عبور یکسان نیست.');
});

test('step 1 no longer requires or validates a national ID', () => {
  assert.deepEqual(validateSignupStep(1, { firstName: 'Ali', lastName: 'Test' }), {});
});
