import { useEffect, useRef, useState } from 'react';
import Brand from './Brand.jsx';

const GEM_STATES = {
  1: { image: '/images/broken-gem.png', caption: 'شروع یک مسیر تازه' },
  2: { image: '/images/semi-broken-gem.png', caption: 'الماس در حال ترمیم است' },
  3: { image: '/images/gem.png', caption: 'الماس تو کامل شده' },
};
const PARTICLES = [
  { ox: 0, oy: 0, phase: 0 }, { ox: 18, oy: -10, phase: 1.1 },
  { ox: -20, oy: 14, phase: 2 }, { ox: 27, oy: 19, phase: 2.8 },
  { ox: -30, oy: -18, phase: 3.7 }, { ox: 10, oy: 31, phase: 4.5 },
  { ox: -12, oy: -29, phase: 5.2 },
];

export default function GemSection({ step = 1, authMode = 'signup', onAuthModeChange }) {
  const gemSectionRef = useRef(null);
  const gemWrapperRef = useRef(null);
  const gemImageRef = useRef(null);
  const [displayedGem, setDisplayedGem] = useState(GEM_STATES[1]);
  const [changing, setChanging] = useState(false);
  const particleRefs = useRef([]);
  const pointerState = useRef({ targetX: 50, targetY: 46, currentX: 50, currentY: 46, active: false, rafId: null, time: 0 });
  const targetGem = GEM_STATES[authMode === 'login' ? 3 : step] || GEM_STATES[1];

  useEffect(() => {
    setChanging(true);
    const swap = window.setTimeout(() => setDisplayedGem(targetGem), 260);
    const finish = window.setTimeout(() => setChanging(false), 580);
    return () => { window.clearTimeout(swap); window.clearTimeout(finish); };
  }, [targetGem.image, targetGem.caption]);

  useEffect(() => {
    const section = gemSectionRef.current;
    if (!section) return undefined;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(pointer: fine)');
    if (reducedMotion.matches || !finePointer.matches) return undefined;
    const state = pointerState.current;
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const render = () => {
      state.time += 0.018;
      state.currentX += (state.targetX - state.currentX) * 0.12;
      state.currentY += (state.targetY - state.currentY) * 0.12;
      section.style.setProperty('--mouse-x', `${state.currentX}%`);
      section.style.setProperty('--mouse-y', `${state.currentY}%`);
      particleRefs.current.forEach((particle, index) => {
        if (!particle) return;
        const item = PARTICLES[index];
        const px = state.currentX + (item.ox / section.clientWidth) * 100;
        const py = state.currentY + (item.oy / section.clientHeight) * 100;
        const floatX = Math.cos(state.time * 1.35 + item.phase) * (2 + index * 0.25);
        const floatY = Math.sin(state.time * 1.15 + item.phase) * (2 + index * 0.35);
        particle.style.left = `${clamp(px, -5, 105)}%`;
        particle.style.top = `${clamp(py, -5, 105)}%`;
        particle.style.transform = `translate3d(calc(-50% + ${floatX}px), calc(-50% + ${floatY}px), 0) scale(${0.82 + index * 0.035})`;
        particle.style.opacity = state.active ? `${0.55 + (Math.sin(state.time * 2 + item.phase) + 1) * 0.18}` : '0';
      });
      if (state.active || Math.abs(state.targetX - state.currentX) > 0.05 || Math.abs(state.targetY - state.currentY) > 0.05) {
        state.rafId = requestAnimationFrame(render);
      } else state.rafId = null;
    };
    const onBlur = () => {
      state.active = false;
      section.classList.remove('mouse-active');
      section.style.setProperty('--mouse-glow-opacity', '0');
      if (!state.rafId) state.rafId = requestAnimationFrame(render);
    };
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('blur', onBlur);
      if (state.rafId) cancelAnimationFrame(state.rafId);
      state.rafId = null;
      section.classList.remove('mouse-active');
      section.style.setProperty('--mouse-glow-opacity', '0');
    };
  }, []);

  const startPointerRender = () => {
    const state = pointerState.current;
    if (state.rafId) return;
    const section = gemSectionRef.current;
    if (!section) return;
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const render = () => {
      state.time += 0.018;
      state.currentX += (state.targetX - state.currentX) * 0.12;
      state.currentY += (state.targetY - state.currentY) * 0.12;
      section.style.setProperty('--mouse-x', `${state.currentX}%`);
      section.style.setProperty('--mouse-y', `${state.currentY}%`);
      particleRefs.current.forEach((particle, index) => {
        if (!particle) return;
        const item = PARTICLES[index];
        const px = state.currentX + (item.ox / section.clientWidth) * 100;
        const py = state.currentY + (item.oy / section.clientHeight) * 100;
        const floatX = Math.cos(state.time * 1.35 + item.phase) * (2 + index * 0.25);
        const floatY = Math.sin(state.time * 1.15 + item.phase) * (2 + index * 0.35);
        particle.style.left = `${clamp(px, -5, 105)}%`;
        particle.style.top = `${clamp(py, -5, 105)}%`;
        particle.style.transform = `translate3d(calc(-50% + ${floatX}px), calc(-50% + ${floatY}px), 0) scale(${0.82 + index * 0.035})`;
        particle.style.opacity = state.active ? `${0.55 + (Math.sin(state.time * 2 + item.phase) + 1) * 0.18}` : '0';
      });
      if (state.active || Math.abs(state.targetX - state.currentX) > 0.05 || Math.abs(state.targetY - state.currentY) > 0.05) state.rafId = requestAnimationFrame(render);
      else state.rafId = null;
    };
    state.rafId = requestAnimationFrame(render);
  };

  const handlePointerEnter = event => {
    if (event.pointerType && event.pointerType !== 'mouse') return;
    const state = pointerState.current;
    state.active = true;
    const gemImage = gemImageRef.current;
    const rect = gemImage.getBoundingClientRect();
    const brand = section.querySelector('.brand');
    const brandRect = brand?.getBoundingClientRect();
    const hitPadding = 3;
    const onGem = event.clientX >= rect.left - hitPadding && event.clientX <= rect.right + hitPadding && event.clientY >= rect.top - hitPadding && event.clientY <= rect.bottom + hitPadding;
    const onBrand = brandRect && event.clientX >= brandRect.left && event.clientX <= brandRect.right && event.clientY >= brandRect.top && event.clientY <= brandRect.bottom;
    const section = gemSectionRef.current;
    section.style.setProperty('--mouse-glow-opacity', onGem || onBrand ? '0' : '1');
    section.classList.toggle('mouse-active', !onGem && !onBrand);
    startPointerRender();
  };

  const handlePointerMove = event => {
    if (event.pointerType && event.pointerType !== 'mouse') return;
    const section = gemSectionRef.current;
    const rect = section.getBoundingClientRect();
    const state = pointerState.current;
    state.targetX = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
    state.targetY = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));
    const gemRect = gemImageRef.current.getBoundingClientRect();
    const brandRect = section.querySelector('.brand')?.getBoundingClientRect();
    const hitPadding = 3;
    const onGem = event.clientX >= gemRect.left - hitPadding && event.clientX <= gemRect.right + hitPadding && event.clientY >= gemRect.top - hitPadding && event.clientY <= gemRect.bottom + hitPadding;
    const onBrand = brandRect && event.clientX >= brandRect.left && event.clientX <= brandRect.right && event.clientY >= brandRect.top && event.clientY <= brandRect.bottom;
    section.style.setProperty('--mouse-glow-opacity', onGem || onBrand ? '0' : '1');
    section.classList.toggle('mouse-active', !onGem && !onBrand);
    startPointerRender();
  };

  const handlePointerLeave = () => {
    const state = pointerState.current;
    state.active = false;
    const section = gemSectionRef.current;
    section.classList.remove('mouse-active');
    section.style.setProperty('--mouse-glow-opacity', '0');
    startPointerRender();
  };


  return (
    <div className="gem-section" ref={gemSectionRef} onPointerEnter={handlePointerEnter} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      <Brand />
      <div className="gem-noise"></div><div className="gem-orbit orbit-one"></div><div className="gem-orbit orbit-two"></div>
      <div className="gem-aura"></div><div className="gem-light light-one"></div><div className="gem-light light-two"></div>
      <div className="gem-wrapper" ref={gemWrapperRef}><div className="gem-glow"></div><img ref={gemImageRef} id="gemImage" className={changing ? 'changing' : ''} src={displayedGem.image} alt="الماس قیزیلچی" /></div>
      <div className="gem-caption"><span className="caption-line"></span><span id="gemCaption">{displayedGem.caption}</span><span className="caption-line"></span></div>
      <div className="gem-progress">{[1, 2, 3].map(n => <span key={n} className={`progress-dot ${n === (authMode === 'login' ? 3 : step) ? 'active' : ''}`}></span>)}</div>
      <div className="auth-switch" role="group" aria-label="انتخاب نوع دسترسی">
        <button type="button" className={`auth-switch-button ${authMode === 'signup' ? 'active' : ''}`} data-auth-mode="signup" aria-pressed={authMode === 'signup'} onClick={() => onAuthModeChange('signup')}><span className="auth-switch-icon" aria-hidden="true">✦</span><span>ثبت‌نام</span><span className="auth-switch-glint" aria-hidden="true"></span></button>
        <button type="button" className={`auth-switch-button ${authMode === 'login' ? 'active' : ''}`} data-auth-mode="login" aria-pressed={authMode === 'login'} onClick={() => onAuthModeChange('login')}><span className="auth-switch-icon" aria-hidden="true">↗</span><span>ورود</span><span className="auth-switch-glint" aria-hidden="true"></span></button>
      </div>
      <div className="gem-mouse-layer" aria-hidden="true"><div className="gem-mouse-halo"></div><div className="gem-mouse-ring"></div>{PARTICLES.map((p, i) => <span className="gem-mouse-particle" key={i} ref={node => { particleRefs.current[i] = node; }}></span>)}</div>
    </div>
  );
}
