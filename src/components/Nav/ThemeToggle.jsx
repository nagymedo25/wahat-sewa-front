import { useTheme } from '@/context/ThemeContext.jsx';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
      className={
        'relative w-9 h-9 rounded-full flex items-center justify-center ' +
        'border transition-all duration-300 cursor-pointer ' +
        'border-[var(--border-default)] bg-[var(--bg-card)] ' +
        'hover:border-[var(--border-accent)] hover:shadow-[var(--shadow-glow)] ' +
        'active:scale-95 ' +
        className
      }
    >
      <span className="sr-only">{isDark ? 'Light Mode' : 'Dark Mode'}</span>

      {/* Sun icon — visible in dark mode */}
      <Sun
        className={
          'absolute w-[18px] h-[18px] transition-all duration-300 ' +
          (isDark
            ? 'opacity-100 rotate-0 scale-100 text-[var(--desert-sand)]'
            : 'opacity-0 -rotate-90 scale-50 text-[var(--siwa-earth)]')
        }
        strokeWidth={1.8}
      />

      {/* Moon icon — visible in light mode */}
      <Moon
        className={
          'absolute w-[18px] h-[18px] transition-all duration-300 ' +
          (isDark
            ? 'opacity-0 rotate-90 scale-50 text-[var(--desert-sand)]'
            : 'opacity-100 rotate-0 scale-100 text-[var(--siwa-earth)]')
        }
        strokeWidth={1.8}
      />
    </button>
  );
}
