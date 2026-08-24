/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        /* ─── Core Brand Palette ─── */
        'siwa-salt': 'var(--siwa-salt)',
        'siwa-salt-light': 'var(--siwa-salt-light)',
        'desert-sand': 'var(--desert-sand)',
        'desert-sand-deep': 'var(--desert-sand-deep)',
        'siwa-earth': 'var(--siwa-earth)',
        'siwa-earth-light': 'var(--siwa-earth-light)',
        'oasis-clay': 'var(--oasis-clay)',
        'oasis-clay-deep': 'var(--oasis-clay-deep)',
        'palm-shade': 'var(--palm-shade)',
        'palm-shade-light': 'var(--palm-shade-light)',
        'palm-shade-dark': 'var(--palm-shade-dark)',

        /* ─── Semantic Tokens ─── */
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-elevated': 'var(--bg-elevated)',
        'bg-card': 'var(--bg-card)',
        'bg-card-hover': 'var(--bg-card-hover)',

        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        'text-muted': 'var(--text-muted)',
        'text-accent': 'var(--text-accent)',

        'border-default': 'var(--border-default)',
        'border-subtle': 'var(--border-subtle)',
        'border-strong': 'var(--border-strong)',
        'border-accent': 'var(--border-accent)',

        'action-primary': 'var(--action-primary)',
        'action-primary-hover': 'var(--action-primary-hover)',
        'action-secondary': 'var(--action-secondary)',

        'discount-badge': 'var(--discount-badge)',

        'nav-bg': 'var(--nav-bg)',
        'nav-bg-scrolled': 'var(--nav-bg-scrolled)',
        'nav-text': 'var(--nav-text)',
        'nav-text-muted': 'var(--nav-text-muted)',

        'footer-bg': 'var(--footer-bg)',
        'footer-text': 'var(--footer-text)',

        /* ─── Legacy compat aliases (used in existing components) ─── */
        cream: 'var(--text-primary)',
        'warm-white': 'var(--siwa-salt-light)',
        sand: 'var(--text-secondary)',
        'sand-light': 'var(--text-secondary)',
        'sand-warm': 'var(--text-tertiary)',
        bronze: 'var(--siwa-earth)',
        'bronze-light': 'var(--siwa-earth-light)',
        sunset: 'var(--discount-badge)',
        'sunset-deep': 'var(--siwa-earth)',
        shadow: 'var(--bg-primary)',
        olive: 'var(--palm-shade)',
        'olive-light': 'var(--palm-shade-light)',
        'olive-glow': 'var(--action-primary)',
        'olive-deep': 'var(--oasis-clay-deep)',
        'accent-gold': 'var(--siwa-earth)',
        'accent-gold-hover': 'var(--siwa-earth-light)',
        'accent-gold-light': 'var(--desert-sand)',
      },
      fontFamily: {
        ar: 'var(--font-ar)',
        display: 'var(--font-display)',
        en: 'var(--font-en)',
        number: 'var(--font-number)',
      },
      transitionTimingFunction: {
        cinematic: 'var(--ease-cinematic)',
        smooth: 'var(--ease-smooth)',
        expo: 'var(--ease-expo)',
        spring: 'var(--ease-spring)',
      },
      boxShadow: {
        'siwa-sm': 'var(--shadow-sm)',
        'siwa-md': 'var(--shadow-md)',
        'siwa-lg': 'var(--shadow-lg)',
        'siwa-xl': 'var(--shadow-xl)',
        'siwa-glow': 'var(--shadow-glow)',
      },
      keyframes: {
        tickerScroll: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(40px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-40px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.92)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        sunRise: {
          from: { transform: 'rotate(-90deg) scale(0.5)', opacity: '0' },
          to: { transform: 'rotate(0deg) scale(1)', opacity: '1' },
        },
        moonRise: {
          from: { transform: 'rotate(90deg) scale(0.5)', opacity: '0' },
          to: { transform: 'rotate(0deg) scale(1)', opacity: '1' },
        },
      },
      animation: {
        ticker: 'tickerScroll 30s linear infinite',
        fadeInUp: 'fadeInUp 0.7s var(--ease-cinematic) forwards',
        fadeIn: 'fadeIn 0.5s ease forwards',
        slideInRight: 'slideInRight 0.6s var(--ease-cinematic) forwards',
        slideInLeft: 'slideInLeft 0.6s var(--ease-cinematic) forwards',
        scaleIn: 'scaleIn 0.5s var(--ease-cinematic) forwards',
        shimmer: 'shimmer 2s ease-in-out infinite',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
        float: 'float 4s ease-in-out infinite',
        sunRise: 'sunRise 0.4s var(--ease-spring) forwards',
        moonRise: 'moonRise 0.4s var(--ease-spring) forwards',
      },
    },
  },
  plugins: [],
};
