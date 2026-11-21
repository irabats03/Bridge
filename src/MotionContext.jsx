import { createContext, useContext, useEffect, useState } from 'react';

const MotionContext = createContext(null);
export const useMotion = () => useContext(MotionContext);

export function MotionProvider({ children }) {
  const [enabled, setEnabled] = useState(() => localStorage.getItem('bridge-motion') !== 'off');
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const motion = enabled && !reduced;
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(preference.matches);
    preference.addEventListener('change', sync);
    return () => preference.removeEventListener('change', sync);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.motion = motion ? 'on' : 'off';
  }, [motion]);
  const toggle = () => {
    localStorage.setItem('bridge-motion', enabled ? 'off' : 'on');
    setEnabled(!enabled);
  };
  return <MotionContext.Provider value={{ motion, toggle, reduced }}>{children}</MotionContext.Provider>;
}

export function useInView(ref) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setInView(true);
      observer.disconnect();
    }, { threshold: 0.14 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return inView;
}
