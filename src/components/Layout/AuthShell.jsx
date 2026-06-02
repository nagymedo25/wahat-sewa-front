import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import logoImg from '@/images/Logo1.png';

export default function AuthShell({ title, subtitle, children }) {
  const shellRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (!shellRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out', delay: 0.15 }
      );
    }, shellRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={shellRef} className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-10 bg-[#0A0907]">

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


    </div>
  );
}
