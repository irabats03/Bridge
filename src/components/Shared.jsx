import { useEffect, useId, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogIn, LogOut, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useInView, useMotion } from '../MotionContext';
import { demoEmail, demoPassword } from '../data/sampleChat';

const sections = [
  ['why-us', 'Why us'], ['psychologists', 'Psychologists'],
  ['plans', 'Plans'], ['instant-call', 'Instant call']
];

export const EmergencyLink = ({ children = '112' }) => <a className="helpline" href="tel:112">{children}</a>;
export const TeleManas = () => <a className="helpline" href="tel:+9114416?oai_link_source=model_response_hotline">Tele-MANAS 14416</a>;

export function Logo() {
  return <Link to="/" className="brand" aria-label="Bridge home"><img src="/bridge.svg" alt="" width="38" height="38" /><span>Bridge<span className="brand-period">.</span></span></Link>;
}

export function Header({ signedIn, onLogin, onLogout }) {
  const { motion, toggle, reduced } = useMotion();
  return <header className="header">
    <div className="header-inner">
      <div className="header-brand"><Logo /><span className="header-tagline">Bridging Gaps to Understand Better.</span></div>
      <HeaderNav />
      <div className="header-actions">
        <ThemeToggle />
        <button className="motion-button" type="button" role="switch" aria-checked={motion} onClick={toggle} disabled={reduced} title={reduced ? 'Reduced motion is enabled on this device' : undefined}>
          <span>Motion</span><span className="switch-track" aria-hidden="true"><i /></span>
        </button>
        {signedIn ? <><span className="greeting">Hi, Demo Parent</span><button className="login-button" onClick={onLogout}><LogOut size={15} />Log out</button></> :
          <button className="login-button" onClick={onLogin} aria-label="Login / Sign up"><LogIn size={15} /><span>Login<span className="login-extra"> / Sign up</span></span></button>}
      </div>
    </div>
  </header>;
}

function HeaderNav() {
  const { pathname } = useLocation();
  const [active, setActive] = useState('');
  useEffect(() => {
    if (pathname !== '/') return;
    const header = document.querySelector('.header');
    const targets = sections.map(([id]) => ({ id, element: document.getElementById(id) }));
    let frame = 0;
    function update() {
      frame = 0;
      const threshold = header.offsetHeight + 94;
      const current = targets.findLast(({ element }) => element && element.getBoundingClientRect().top <= threshold);
      setActive(current?.id ?? '');
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);
  return <nav className="header-nav" aria-label="Landing page sections">
    {sections.map(([id, name]) => <Link to={'/#' + id} key={id} aria-current={pathname === '/' && active === id ? 'location' : undefined}>{name}</Link>)}
  </nav>;
}

export function Footer() {
  return <footer className="footer">
    <div className="shell">
      <div className="footer-main">
        <div><Logo /><p>Bridging Gaps to Understand Better.</p></div>
        <nav aria-label="Footer"><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/contact">Contact</Link></nav>
      </div>
      <div className="footer-end">
        <p>Bridge shares general guidance to help you. It is not medical advice or a diagnosis.</p>
        <p>Emergency <EmergencyLink /> <span aria-hidden="true">·</span> Mental health support <TeleManas /></p>
      </div>
    </div>
  </footer>;
}

export function Modal({ title, children, onClose }) {
  const ref = useRef(null);
  const id = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog.open) dialog.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
      if (dialog.open) dialog.close();
    };
  }, []);
  return <dialog ref={ref} aria-labelledby={id} className="modal" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === ref.current) onClose(); }}>
    <div className="modal-content">
      <div className="modal-head"><h2 id={id}>{title}</h2><button aria-label="Close dialog" className="icon-button" onClick={onClose}><X size={21} /></button></div>
      {children}
    </div>
  </dialog>;
}

export function Login({ onClose, onSuccess }) {
  const [error, setError] = useState('');
  function submit(event) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    if (String(fields.get('email')).trim().toLowerCase() !== demoEmail || fields.get('password') !== demoPassword) {
      setError('Use the demo email and password shown below.');
      return;
    }
    onSuccess();
  }
  return <Modal title="Login / Sign up" onClose={onClose}>
    <p>Demo account for testing only.</p>
    <form className="form-stack" onSubmit={submit}>
      <label>Email<input type="email" name="email" placeholder={demoEmail} autoComplete="off" required /></label>
      <label>Password<input type="password" name="password" autoComplete="off" required /></label>
      {error && <p role="alert" className="form-error">{error}</p>}
      <button className="button primary">Log in</button>
    </form>
    <p className="demo-note"><strong>{demoEmail}</strong><br />Password <kbd>{demoPassword}</kbd></p>
  </Modal>;
}

export function SectionHeading({ id, children, description, action }) {
  const ref = useRef(null);
  const visible = useInView(ref);
  return <div ref={ref} className="section-head" data-scroll-reveal>
    <div><h2 id={id} className={visible ? 'in-view' : ''}>{children}</h2>{description && <p>{description}</p>}</div>
    {action}
  </div>;
}

export function setupCardGlow(event) {
  if (event.pointerType !== 'mouse' || document.documentElement.dataset.motion !== 'on') return;
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty('--card-x', (event.clientX - rect.x) + 'px');
  event.currentTarget.style.setProperty('--card-y', (event.clientY - rect.y) + 'px');
}
