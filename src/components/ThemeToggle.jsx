import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

function applyTheme(dark) {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.getElementById('bridge-theme-color').content = dark ? '#172526' : '#FFFFFF';
}

export function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.dataset.theme === 'dark');

  useEffect(() => {
    const system = matchMedia('(prefers-color-scheme: dark)');
    function syncSystem(event) {
      let saved = null;
      try {
        saved = localStorage.getItem('bridge-theme');
      } catch {
        // The theme still works for the current page when storage is disabled.
      }
      if (saved) return;
      applyTheme(event.matches);
      setDark(event.matches);
    }
    system.addEventListener('change', syncSystem);
    return () => system.removeEventListener('change', syncSystem);
  }, []);

  function toggle() {
    const choice = dark ? 'light' : 'dark';
    applyTheme(!dark);
    setDark(!dark);
    try {
      localStorage.setItem('bridge-theme', choice);
    } catch {
      // A private browser may disable storage.
    }
  }

  return <button className="theme-button" type="button" role="switch" aria-label="Dark mode" aria-checked={dark} title={dark ? 'Switch to light mode' : 'Switch to dark mode'} onClick={toggle}>
    {dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
  </button>;
}
