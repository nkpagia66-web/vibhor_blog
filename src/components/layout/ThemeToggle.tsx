'use client';

/**
 * ThemeToggle — dark/light mode with localStorage persistence.
 * The initial theme is applied by an inline script in the root layout to
 * avoid a flash of wrong theme.
 */
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {
      /* storage may be unavailable */
    }
    setDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={
        className ??
        'inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:border-accent/50 hover:text-accent'
      }
      aria-label={dark === null ? 'Toggle theme' : dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {dark ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
    </button>
  );
}
