const labels = ['اطلاعات شخصی', 'اطلاعات تماس', 'تکمیل ثبت‌نام'];
const numerals = ['۱', '۲', '۳'];

export default function Stepper({ currentStep }) {
  return (
    <div className="stepper">
      {labels.map((label, index) => (
        <div className="step-fragment contents" key={label}>
          <div className={`step ${currentStep === index + 1 ? 'active' : ''} ${currentStep > index + 1 ? 'completed' : ''}`} data-step={index + 1}>
            <div className="step-number">{numerals[index]}</div><span>{label}</span>
          </div>
          {index < 2 && <div className={`step-line ${currentStep > index + 1 ? 'active' : ''}`}></div>}
        </div>
      ))}
    </div>
  );
}
