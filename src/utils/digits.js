const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

/** Convert Persian and Arabic-Indic digits to ASCII digits. */
export function normalizeDigits(value = '') {
  return String(value)
    .replace(/[۰-۹]/g, digit => String(PERSIAN_DIGITS.indexOf(digit)))
    .replace(/[٠-٩]/g, digit => String(ARABIC_DIGITS.indexOf(digit)));
}

/** Keep only ASCII digits after normalizing localized numerals. */
export function digitsOnly(value = '') {
  return normalizeDigits(value).replace(/[^\d]/g, '');
}
