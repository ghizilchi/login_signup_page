import { useEffect, useMemo, useRef, useState } from 'react';
import { digitsOnly, normalizeDigits } from '../utils/digits.js';
import { getPasswordStrength } from '../utils/password.js';
import { validateSignupStep } from '../utils/validation.js';
import { useResendCountdown } from '../hooks/useResendCountdown.js';
import TextField from './ui/TextField.jsx';
import FieldShell from './ui/FieldShell.jsx';
import { PrimaryButton, SecondaryButton, BackButton } from './ui/Button.jsx';

const INITIAL_VALUES = {
  firstName: '', lastName: '', mobile: '', verificationCode: '',
  email: '', password: '', confirmPassword: '',
};

function PasswordToggle({ visible, onClick }) {
  return (
    <button type="button" className={`password-toggle ${visible ? 'visible' : ''}`}
      onClick={onClick} aria-label={visible ? 'مخفی کردن رمز عبور' : 'نمایش رمز عبور'} aria-pressed={visible}>
      <svg className="eye-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path className="eye-outline" d="M2.5 12C4.8 8.2 8.1 6 12 6s7.2 2.2 9.5 6C19.2 15.8 15.9 18 12 18S4.8 15.8 2.5 12Z"></path>
        <circle className="eye-pupil" cx="12" cy="12" r="3"></circle>
        <circle className="eye-highlight" cx="13" cy="11" r=".8"></circle>
      </svg>
    </button>
  );
}

export default function SignupForm({ currentStep, onStepChange, onComplete }) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [validatedFields, setValidatedFields] = useState({});
  const [codeSent, setCodeSent] = useState(false);
  const { seconds: resendSeconds, start: startResendCountdown, stop: stopResendCountdown } = useResendCountdown(60);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const verificationInputRef = useRef(null);
  const strength = useMemo(() => getPasswordStrength(values.password), [values.password]);

  useEffect(() => {
    if (codeSent) verificationInputRef.current?.focus();
  }, [codeSent]);


  const update = (name, rawValue, numeric = false) => {
    const value = numeric ? digitsOnly(rawValue) : rawValue;
    setValues(current => ({ ...current, [name]: value }));
    setValidatedFields(current => { const next = { ...current }; delete next[name]; return next; });
    setErrors(current => {
      if (!(name in current)) return current;
      const next = { ...current }; delete next[name]; return next;
    });
    if (name === 'mobile' && codeSent) {
      setCodeSent(false);
      stopResendCountdown();
      setValues(current => ({ ...current, mobile: value, verificationCode: '' }));
    }
  };

  const setFieldError = (name, message) => setErrors(current => ({ ...current, [name]: message }));
  const validateStep = (step) => {
    const next = validateSignupStep(step, values, { codeSent });
    const fields = step === 1 ? ['firstName', 'lastName'] : step === 2 ? ['mobile', 'verificationCode', 'email'] : ['password', 'confirmPassword'];
    setValidatedFields(current => ({ ...current, ...Object.fromEntries(fields.map(field => [field, !(field in next)])) }));
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goTo = (target) => {
    if (target > currentStep && !validateStep(currentStep)) return;
    onStepChange(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sendCode = () => {
    const mobile = normalizeDigits(values.mobile.trim());
    if (!/^09\d{9}$/.test(mobile)) {
      setFieldError('mobile', 'ابتدا یک شماره موبایل معتبر وارد کنید.');
      return;
    }
    setErrors(current => { const next = { ...current }; delete next.mobile; return next; });
    setCodeSent(true);
    setValues(current => ({ ...current, mobile, verificationCode: '' }));
    startResendCountdown();
  };


  const submit = (event) => {
    event.preventDefault();
    if (!validateStep(3)) return;
    window.setTimeout(onComplete, 550);
  };

  const numericChange = name => event => update(name, event.target.value, true);
  const textChange = name => event => update(name, event.target.value);

  return (
    <form id="signupForm" noValidate onSubmit={submit}>
      <div className={`form-step ${currentStep === 1 ? 'active' : ''}`} data-form-step="1">
        <div className="step-heading"><span className="eyebrow">مرحله اول</span><h1>اطلاعات شخصی</h1><p>برای شروع، مشخصات خودت رو وارد کن.</p></div>
        <div className="input-grid grid grid-cols-2 gap-[18px] max-[600px]:grid-cols-1 max-[600px]:gap-0">
          <TextField id="firstName" label="نام" value={values.firstName} onChange={textChange('firstName')} error={errors.firstName} isValid={validatedFields.firstName} placeholder="نام خود را وارد کنید" autoComplete="given-name" />
          <TextField id="lastName" label="نام خانوادگی" value={values.lastName} onChange={textChange('lastName')} error={errors.lastName} isValid={validatedFields.lastName} placeholder="نام خانوادگی خود را وارد کنید" autoComplete="family-name" />
        </div>
        <PrimaryButton type="button" className="next-button" onClick={() => goTo(2)}>ادامه</PrimaryButton>
      </div>

      <div className={`form-step ${currentStep === 2 ? 'active' : ''}`} data-form-step="2">
        <div className="step-heading"><span className="eyebrow">مرحله دوم</span><h1>اطلاعات تماس</h1><p>راه ارتباطی خودت رو وارد کن تا حساب کاربری‌ات تأیید بشه.</p></div>
        <FieldShell id="mobile" wrapperId="phoneGroup" hidden={codeSent} label="شماره موبایل" className="swap-group" error={errors.mobile} isValid={validatedFields.mobile}>
          {(stateClass) => <div className="input-with-button">
            <div className={`input-wrapper ${stateClass}`}>
              <input className="ui-field-control" type="tel" id="mobile" name="mobile" inputMode="numeric" maxLength={11} placeholder="مثلاً ۰۹۱۲۱۲۳۴۵۶۷" autoComplete="tel" value={values.mobile} onChange={numericChange('mobile')} aria-invalid={Boolean(errors.mobile)} />
              <span className="input-state-icon"></span>
            </div>
            <SecondaryButton id="sendCodeButton" onClick={sendCode}><span className="send-text">ارسال کد</span><span className="send-loader"></span></SecondaryButton>
          </div>}
        </FieldShell>
        <FieldShell id="verificationCode" wrapperId="codeGroup" hidden={!codeSent} label="کد تأیید" className="swap-group" error={errors.verificationCode} isValid={validatedFields.verificationCode} afterError={<div className="code-meta"><small className="verification-hint" id="codeHint">کد به شماره <bdi id="codeMobile">{values.mobile}</bdi> ارسال شد.</small>
            <span className="code-actions"><button type="button" className="link-button" id="editMobileButton" onClick={() => { setCodeSent(false); stopResendCountdown(); setValues(v => ({ ...v, verificationCode: '' })); }}>ویرایش شماره</button>
              <button type="button" className="link-button" id="resendCodeButton" disabled={resendSeconds > 0} onClick={startResendCountdown}>{resendSeconds > 0 ? `ارسال مجدد (${resendSeconds})` : 'ارسال مجدد'}</button></span>
          </div>}>
          {(stateClass) => <div className={`input-wrapper verification-wrapper ${stateClass}`}>
            <input className="ui-field-control" type="text" id="verificationCode" name="verificationCode" ref={verificationInputRef} inputMode="numeric" maxLength={6} placeholder="کد ۶ رقمی" autoComplete="one-time-code" value={values.verificationCode} onChange={numericChange('verificationCode')} aria-invalid={Boolean(errors.verificationCode)} />
            <span className="verification-status">✓</span>
          </div>}
        </FieldShell>
        <TextField id="email" label="ایمیل" type="email" value={values.email} onChange={textChange('email')} error={errors.email} isValid={validatedFields.email} placeholder="example@email.com" autoComplete="email" />
        <div className="button-row mt-[10px] flex w-full items-center gap-3 max-[600px]:gap-[5px]"><BackButton onClick={() => goTo(1)} /><PrimaryButton type="button" className="next-button" onClick={() => goTo(3)}>ادامه</PrimaryButton></div>
      </div>

      <div className={`form-step ${currentStep === 3 ? 'active' : ''}`} data-form-step="3">
        <div className="step-heading"><span className="eyebrow">مرحله سوم</span><h1>تکمیل ثبت‌نام</h1><p>یک رمز عبور امن برای حساب قیزیلچی خودت انتخاب کن.</p></div>
        <FieldShell id="password" label="رمز عبور" error={errors.password} isValid={validatedFields.password && strength.valid}>
          {(stateClass) => <><div className={`input-wrapper password-wrapper ${stateClass}`}>
            <input className="ui-field-control" type={showPassword ? 'text' : 'password'} id="password" name="password" value={values.password} onChange={textChange('password')} placeholder="رمز عبور خود را وارد کنید" autoComplete="new-password" aria-invalid={Boolean(errors.password)} />
            <PasswordToggle visible={showPassword} onClick={() => setShowPassword(v => !v)} />
          </div>
          <div className="password-strength"><div className="strength-bar"><span style={{ width: `${strength.percentage}%`, background: !values.password ? 'var(--border)' : (strength.valid ? 'var(--success)' : 'var(--gold)') }}></span></div>
            <div className="strength-info"><small id="passwordHint" className="password-issues" aria-live="polite">{!values.password ? '' : strength.valid ? <span className="password-issue ok">رمز عبور معتبر است ✓</span> : strength.missing.map(key => <span className="password-issue" key={key}>{({ length: 'حداقل ۸ کاراکتر', uppercase: 'یک حرف بزرگ انگلیسی (A-Z)', special: 'یک کاراکتر ویژه (مثل ! @ #)', allowed: 'فقط حروف انگلیسی، عدد و کاراکتر ویژه' })[key]}</span>)}</small><small id="strengthPercent">{strength.percentage.toLocaleString('fa-IR')}٪</small></div>
          </div></>}
        </FieldShell>
        <FieldShell id="confirmPassword" label="تکرار رمز عبور" error={errors.confirmPassword} isValid={values.confirmPassword && values.confirmPassword === values.password}>
          {(stateClass) => <div className={`input-wrapper password-wrapper ${stateClass}`}>
            <input className="ui-field-control" type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" value={values.confirmPassword} onChange={textChange('confirmPassword')} placeholder="رمز عبور را دوباره وارد کنید" autoComplete="new-password" aria-invalid={Boolean(errors.confirmPassword)} />
            <PasswordToggle visible={showConfirmPassword} onClick={() => setShowConfirmPassword(v => !v)} />
          </div>}
        </FieldShell>
        <div className="button-row mt-[10px] flex w-full items-center gap-3 max-[600px]:gap-[5px]"><BackButton onClick={() => goTo(2)} /><PrimaryButton type="submit" className="submit-button">عضویت در قیزیلچی</PrimaryButton></div>
      </div>
    </form>
  );
}
