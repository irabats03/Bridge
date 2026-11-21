import { useLayoutEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import '@fontsource-variable/lexend/wght.css';
import './styles.css';
import { MotionProvider, useMotion } from './MotionContext';
import { Footer, Header, Login } from './components/Shared';
import { Landing } from './pages/Landing';
import { Checkout, Contact, Policy } from './pages/Secondary';

function App() {
  const [signedIn, setSignedIn] = useState(() => localStorage.getItem('bridge-demo-login') === 'yes');
  const [loginOpen, setLoginOpen] = useState(false);
  const location = useLocation();
  const { motion } = useMotion();

  useLayoutEffect(() => {
    const target = location.hash && document.getElementById(location.hash.slice(1));
    if (target) {
      const focusTarget = location.state?.focus && document.getElementById(location.state.focus);
      focusTarget?.focus({ preventScroll: true });
      const scrollTarget = focusTarget && matchMedia('(max-width: 690px)').matches ? focusTarget : target;
      scrollTarget.scrollIntoView({ behavior: motion ? 'smooth' : 'instant', block: scrollTarget === target ? 'start' : 'center' });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    const title = { '/checkout': 'Free trial', '/privacy': 'Privacy', '/terms': 'Terms', '/contact': 'Contact' }[location.pathname];
    document.title = title ? title + ' | Bridge' : 'Bridge | Bridging Gaps to Understand Better.';
  }, [location]); // Motion changes should not navigate or move focus.

  function signIn() { localStorage.setItem('bridge-demo-login', 'yes'); setSignedIn(true); setLoginOpen(false); }
  function signOut() { localStorage.removeItem('bridge-demo-login'); setSignedIn(false); }

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <Header signedIn={signedIn} onLogin={() => setLoginOpen(true)} onLogout={signOut} />
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/checkout" element={<Checkout signedIn={signedIn} />} />
      <Route path="/privacy" element={<Policy key="privacy" />} />
      <Route path="/terms" element={<Policy key="terms" terms />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    <Footer />
    {loginOpen && <Login onClose={() => setLoginOpen(false)} onSuccess={signIn} />}
  </>;
}

createRoot(document.getElementById('root')).render(<BrowserRouter><MotionProvider><App /></MotionProvider></BrowserRouter>);
