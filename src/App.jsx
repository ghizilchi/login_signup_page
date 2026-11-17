import { useEffect, useState } from 'react';
import AmbientBackground from './components/AmbientBackground.jsx';
import GemSection from './components/GemSection.jsx';
import Stepper from './components/Stepper.jsx';
import SignupForm from './components/SignupForm.jsx';
import LoginView from './components/LoginView.jsx';
import SuccessState from './components/SuccessState.jsx';
import Panel from './components/ui/Panel.jsx';
import './styles/tailwind.css';

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [authMode, setAuthMode] = useState('signup');
  const [completed, setCompleted] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const changeAuthMode = mode => {
    if (mode === authMode || transitioning) return;
    setTransitioning(true);
    window.setTimeout(() => {
      setAuthMode(mode);
      setTransitioning(false);
    }, 130);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return (
    <main className="signup-page relative flex min-h-screen flex-col items-center overflow-hidden justify-center px-[25px] py-[35px] max-[600px]:px-[12px] max-[600px]:py-[20px]">
      <AmbientBackground />
      <Panel as="section" variant="glass" className={`signup-container ${authMode === 'login' ? 'login-mode' : ''} ${transitioning ? 'auth-transitioning' : ''}`}>
        <GemSection step={currentStep} authMode={authMode} onAuthModeChange={changeAuthMode} />
        <Panel variant="content" className="form-section relative bg-[rgba(255,255,255,0.93)] px-[55px] py-[50px] max-[900px]:p-[40px] max-[600px]:px-[22px] max-[600px]:py-[30px] max-[380px]:px-[18px] max-[380px]:py-[27px]">
          {!completed && <Stepper currentStep={currentStep} />}
          {!completed && <SignupForm currentStep={currentStep} onStepChange={setCurrentStep} onComplete={() => setCompleted(true)} />}
          <LoginView hidden={authMode !== 'login'} />
          {completed && <SuccessState onLogin={() => changeAuthMode('login')} />}
        </Panel>
      </Panel>
    </main>
  );
}
