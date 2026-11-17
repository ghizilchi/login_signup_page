import { useEffect, useState } from 'react';
import { normalizeDigits } from '../utils/digits.js';
import TextField from './ui/TextField.jsx';
import FieldShell from './ui/FieldShell.jsx';
import { PrimaryButton, BackButton } from './ui/Button.jsx';

export default function LoginView({ hidden = true }) {
  const [step, setStep] = useState('credentials');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!hidden) { setStep('credentials'); setErrors({}); setNote(''); }
  }, [hidden]);

  const continueLogin = () => {
    const phone = normalizeDigits(mobile.trim());
    const next = {};
    if (!/^09\d{9}$/.test(phone)) next.mobile = 'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.';
    if (password.length < 8) next.password = 'رمز عبور باید حداقل ۸ کاراکتر باشد.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setMobile(phone);
    setNote('اطلاعات اولیه بررسی شد؛ ارسال کد در این نسخه شبیه‌سازی شده است.');
    setStep('otp');
  };

  const verify = () => {
    const code = normalizeDigits(otp.trim());
    if (!/^\d{6}$/.test(code)) {
      setErrors(current => ({ ...current, otp: 'کد تأیید باید ۶ رقم باشد.' }));
      return;
    }
    setErrors({});
    setOtp(code);
    setStep('complete');
  };

  return (
    <section className="login-view" id="loginView" aria-label="ورود به حساب کاربری" hidden={hidden}>
      <div className={`login-panel-step ${step === 'credentials' ? 'active' : ''}`} data-login-step="credentials">
        <div className="step-heading"><span className="eyebrow">خوش برگشتی</span><h1>ورود به حساب</h1><p>برای ورود، شماره موبایل و رمز عبورت رو وارد کن.</p></div>
        <TextField id="loginMobile" label="شماره موبایل" type="tel" value={mobile}
          onChange={e => { setMobile(e.target.value); setErrors(v => ({ ...v, mobile: '' })); }}
          error={errors.mobile} inputMode="numeric" maxLength={11} placeholder="مثلاً ۰۹۱۲۱۲۳۴۵۶۷" autoComplete="tel" dir="rtl" />
        <TextField id="loginPassword" label="رمز عبور" type="password" value={password}
          onChange={e => { setPassword(e.target.value); setErrors(v => ({ ...v, password: '' })); }}
          error={errors.password} placeholder="رمز عبور خود را وارد کنید" autoComplete="current-password" />
        <p className="login-note" id="loginCredentialNote" aria-live="polite">{note}</p>
        <PrimaryButton className="login-next-button" id="loginContinue" onClick={continueLogin}>ادامه</PrimaryButton>
      </div>
      <div className={`login-panel-step ${step === 'otp' ? 'active' : ''}`} data-login-step="otp">
        <div className="step-heading"><span className="eyebrow">تأیید هویت</span><h1>کد تأیید</h1><p>کد شش‌رقمی ارسال‌شده به شماره موبایلت رو وارد کن.</p></div>
        <FieldShell id="loginOtp" label="کد تأیید" error={errors.otp}>
          {(stateClass) => <div className={`input-wrapper ${stateClass}`}>
            <input className="ui-field-control" type="text" id="loginOtp" inputMode="numeric" maxLength={6} placeholder="کد ۶ رقمی" autoComplete="one-time-code" dir="ltr" value={otp} onChange={e => { setOtp(e.target.value); setErrors(v => ({ ...v, otp: '' })); }} aria-invalid={Boolean(errors.otp)} /><span className="input-state-icon"></span>
          </div>}
        </FieldShell>
        <p className="login-note" id="loginOtpNote" aria-live="polite">ارسال پیامک در نسخه فعلی نمایشی است و پس از اتصال بک‌اند فعال می‌شود.</p>
        <div className="button-row login-actions mt-[10px] flex w-full items-center gap-3 max-[600px]:gap-[5px]"><BackButton id="loginBack" onClick={() => setStep('credentials')} /><PrimaryButton id="loginVerify" onClick={verify}>تأیید و ورود</PrimaryButton></div>
      </div>
      <div className={`login-panel-step login-complete ${step === 'complete' ? 'active' : ''}`} data-login-step="complete"><div className="success-icon">✓</div><span className="eyebrow">تأیید نمایشی</span><h2>ورود با موفقیت تأیید شد</h2><p>اتصال به پنل و هدایت به صفحه اصلی پس از مشخص‌شدن مسیر صفحه اصلی و اتصال بک‌اند فعال می‌شود.</p></div>
    </section>
  );
}
