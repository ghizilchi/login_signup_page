import { PrimaryButton } from './ui/Button.jsx';
import Panel from './ui/Panel.jsx';

export default function SuccessState({ onLogin }) {
  return (
    <Panel variant="success" className="success-state active" id="successState">
      <div className="success-orbit"></div><div className="success-icon">✓</div><span className="eyebrow">تبریک!</span><h2>الماس کامل شد</h2>
      <p>حساب کاربری شما با موفقیت ایجاد شد. به خانواده قیزیلچی خوش آمدید.</p>
      <PrimaryButton className="success-button" onClick={onLogin}>ورود به حساب</PrimaryButton>
    </Panel>
  );
}
