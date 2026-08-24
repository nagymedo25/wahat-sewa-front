import { Link } from 'react-router-dom';
import Logo from '@/components/Logo.jsx';
import ThemeToggle from '@/components/Nav/ThemeToggle.jsx';
import heroBg1 from '@/images/hero-bg1.png';

export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4 py-12 bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-400">
      
      {/* Background ambient lighting and subtle oasis texture */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10 dark:opacity-25 filter blur-[3px]"
          style={{ backgroundImage: `url(${heroBg1})` }}
        />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[var(--bg-primary)]/85 to-[var(--bg-primary)]" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-[var(--desert-sand)]/20 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-[var(--siwa-earth)]/10 blur-3xl" />
      </div>

      {/* Top Controls Bar */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        <ThemeToggle />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[480px] animate-fadeInUp">
        
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link to="/" className="inline-block transition-transform duration-300 hover:scale-105 py-1">
            <div className="text-[var(--text-primary)]">
              <Logo className="h-20 md:h-24 w-auto" />
            </div>
          </Link>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="font-ar text-2xl sm:text-3xl font-black text-[var(--text-primary)] leading-tight">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 text-[var(--text-secondary)] text-sm leading-relaxed font-normal">
              {subtitle}
            </p>
          ) : null}
        </div>

        {/* Card: High opacity, frosted glass with rich backdrop blur in Dark & Light mode */}
        <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-card)]/95 dark:bg-[#1E130B]/95 backdrop-blur-3xl p-7 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.25)] border-[var(--border-accent)]/30">
          {children}
        </div>
      </div>
    </div>
  );
}
