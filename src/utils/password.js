export const PASSWORD_RULE_MESSAGES = Object.freeze({
  length: 'حداقل ۸ کاراکتر',
  uppercase: 'یک حرف بزرگ انگلیسی (A-Z)',
  special: 'یک کاراکتر ویژه (مثل ! @ #)',
  allowed: 'فقط حروف انگلیسی، عدد و کاراکتر ویژه',
});

/** Keep the exact password policy used by the original signup page. */
export function getPasswordChecks(value = '') {
  return {
    length: value.length >= 8,
    uppercase: /[A-Z]/.test(value),
    special: /[!-\/:-@\[-`{-~]/.test(value),
    allowed: value.length > 0 && /^[\x21-\x7E]+$/.test(value),
  };
}

export function getPasswordStrength(value = '') {
  const checks = getPasswordChecks(value);
  const keys = Object.keys(checks);
  const passed = keys.filter(key => checks[key]).length;
  return {
    checks,
    passed,
    total: keys.length,
    percentage: Math.round((passed / keys.length) * 100),
    valid: passed === keys.length,
    missing: keys.filter(key => !checks[key]),
  };
}
