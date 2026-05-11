import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import logoImg from '../../images/Logo1.png';

export default function AuthShell({ title, subtitle, children }) {
  const shellRef = useRef(null);
  const cardRef = useRef(null);
  const decorRef = useRef(null);
  const particlesRef = useRef(null);

  useEffect(() => {
    if (!shellRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out', delay: 0.15 }
      );
      const decorEls = decorRef.current?.querySelectorAll('.decor-shape');
      if (decorEls?.length) {
        gsap.fromTo(
          decorEls,
          { opacity: 0, scale: 0.8, rotate: -10 },
          { opacity: 1, scale: 1, rotate: 0, duration: 1.2, ease: 'power2.out', stagger: 0.2, delay: 0.4 }
        );
      }
      const pEls = particlesRef.current?.querySelectorAll('.auth-particle');
      if (pEls?.length) {
        gsap.fromTo(
          pEls,
          { opacity: 0, y: 20 },
          { opacity: 0.6, y: 0, duration: 1.5, ease: 'power1.out', stagger: 0.08, delay: 0.6 }
        );
      }
    }, shellRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={shellRef} className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-10">
      {/* Layered animated gradient background */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(10,9,7,0.98)_0%,rgba(18,16,12,0.98)_40%,rgba(26,24,20,0.98)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(74,90,42,0.12)_0%,transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(232,168,124,0.08)_0%,transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(164,184,107,0.04)_0%,transparent_60%)]" />

      {/* Floating particles */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(24)].map((_, i) => (
          <span
            key={i}
            className="auth-particle absolute rounded-full bg-sand"
            style={{
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0,
              animation: `authFloat ${6 + Math.random() * 8}s ease-in-out infinite ${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Decorative geometric shapes */}
      <div ref={decorRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="decor-shape absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full border border-[rgba(164,184,107,0.06)]"
          style={{ animation: 'authSpin 60s linear infinite' }}
        />
        <div
          className="decor-shape absolute -top-10 -right-10 w-[300px] h-[300px] rounded-full border border-[rgba(164,184,107,0.04)]"
          style={{ animation: 'authSpin 45s linear infinite reverse' }}
        />
        <div
          className="decor-shape absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full border border-[rgba(232,168,124,0.05)]"
          style={{ animation: 'authSpin 70s linear infinite' }}
        />
        <div
          className="decor-shape absolute top-[15%] left-[8%] w-[180px] h-[180px] rounded-full bg-[radial-gradient(circle,rgba(164,184,107,0.06)_0%,transparent_70%)] blur-xl"
        />
        <div
          className="decor-shape absolute bottom-[20%] right-[10%] w-[220px] h-[220px] rounded-full bg-[radial-gradient(circle,rgba(232,168,124,0.05)_0%,transparent_70%)] blur-xl"
        />
        {/* Ornamental lines */}
        <svg className="decor-shape absolute top-[10%] left-[5%] w-[120px] h-[120px] opacity-[0.07]" viewBox="0 0 100 100">
          <path d="M10,50 Q50,10 90,50 Q50,90 10,50" fill="none" stroke="var(--olive-glow)" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="var(--olive-glow)" strokeWidth="0.3" />
        </svg>
        <svg className="decor-shape absolute bottom-[15%] right-[5%] w-[100px] h-[100px] opacity-[0.06]" viewBox="0 0 100 100">
          <path d="M50,10 L90,50 L50,90 L10,50 Z" fill="none" stroke="var(--sunset)" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[460px]">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="inline-block transition-transform duration-500 hover:scale-105">
            <img
              src={logoImg}
              alt="واحة سيوة"
              className="h-[72px] w-auto object-contain [filter:brightness(1.15)_drop-shadow(0_2px_12px_rgba(0,0,0,0.4))]"
            />
          </Link>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="font-ar text-[1.6rem] font-semibold text-cream leading-tight">{title}</h1>
          {subtitle ? <p className="mt-2 text-sand opacity-70 text-[0.92rem] leading-relaxed">{subtitle}</p> : null}
        </div>

        {/* Card */}
        <div
          ref={cardRef}
          className="rounded-[2rem] border border-[rgba(212,197,169,0.12)] bg-[rgba(26,24,20,0.65)] [backdrop-filter:blur(40px)] [-webkit-backdrop-filter:blur(40px)] p-8 shadow-[0_32px_80px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)] opacity-0"
        >
          {children}
        </div>
      </div>

      <style>{`
        @keyframes authFloat {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { transform: translateY(-30px) translateX(15px); opacity: 0.6; }
        }
        @keyframes authSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
