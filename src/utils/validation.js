import { normalizeDigits } from './digits.js';
import { getPasswordChecks } from './password.js';

export const VALIDATION_MESSAGES = Object.freeze({
  firstName: 'لطفاً نام خود را وارد کنید.',
  lastName: 'لطفاً نام خانوادگی خود را وارد کنید.',
  mobile: 'شماره موبایل معتبر وارد کنید.',
  mobileCode: 'ابتدا کد تأیید را برای این شماره ارسال کنید.',
  verificationCode: 'کد تأیید باید ۶ رقم باشد.',
  email: 'لطفاً یک ایمیل معتبر وارد کنید.',
  password: 'لطفاً تمام شرایط رمز عبور را رعایت کنید.',
  confirmPassword: 'تکرار رمز عبور با رمز عبور یکسان نیست.',
});

export const isValidMobile = value => /^09\d{9}$/.test(normalizeDigits(value.trim()));
export const isValidEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
export const isValidVerificationCode = value => /^\d{6}$/.test(normalizeDigits(value.trim()));

/** Validate one signup step and return field-keyed errors (no DOM access). */
export function validateSignupStep(step, values, { codeSent = false } = {}) {
  const errors = {};

  if (step === 1) {
    if ((values.firstName ?? '').trim().length < 2) errors.firstName = VALIDATION_MESSAGES.firstName;
    if ((values.lastName ?? '').trim().length < 2) errors.lastName = VALIDATION_MESSAGES.lastName;
  }

  if (step === 2) {
    const mobile = values.mobile ?? '';
    if (!isValidMobile(mobile)) errors.mobile = VALIDATION_MESSAGES.mobile;
    if (!codeSent && isValidMobile(mobile)) errors.mobile = VALIDATION_MESSAGES.mobileCode;
    if (codeSent && !isValidVerificationCode(values.verificationCode ?? '')) {
      errors.verificationCode = VALIDATION_MESSAGES.verificationCode;
    }
    if (!isValidEmail(values.email ?? '')) errors.email = VALIDATION_MESSAGES.email;
  }

  if (step === 3) {
    const password = values.password ?? '';
    if (!Object.values(getPasswordChecks(password)).every(Boolean)) errors.password = VALIDATION_MESSAGES.password;
    if ((values.confirmPassword ?? '') !== password) errors.confirmPassword = VALIDATION_MESSAGES.confirmPassword;
  }

  return errors;
}
