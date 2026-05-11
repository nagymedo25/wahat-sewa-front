import { useEffect, useRef } from 'react';
import logoImg from '../../images/Logo1.png';

export default function Loader({ isHidden }) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const isMobile = typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false;

  useEffect(() => {
    if (!isHidden || !overlayRef.current) return;

    const el = overlayRef.current;
    const content = contentRef.current;

    // Primary exit: clip-path wipe
    el.style.transition = 'clip-path 1.2s cubic-bezier(0.87, 0, 0.13, 1), opacity 0.8s ease 1.1s';
    el.style.clipPath = 'circle(0% at 50% 50%)';
    el.style.opacity = '0';

    if (content) {
      content.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
      content.style.transform = 'scale(0.92)';
      content.style.opacity = '0';
    }

    // Fallback: force-hide after 2.5s (in case CSS transition fails on mobile)
    const t = setTimeout(() => {
      el.style.visibility = 'hidden';
      el.style.pointerEvents = 'none';
      el.style.opacity = '0';
      el.style.clipPath = 'circle(0% at 50% 50%)';
    }, 2500);

    return () => clearTimeout(t);
  }, [isHidden]);

  const isExiting = isHidden ? ' ldr-exiting' : '';

  return (
    <div
      ref={overlayRef}
      id="loader"
      className={`fixed inset-0 z-[9999] bg-[#0a0907] overflow-hidden ldr-overlay${isExiting}`}
    >
      {/* Layered atmospheric glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(74,90,42,0.18)_0%,transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_70%,rgba(232,168,124,0.09)_0%,transparent_45%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(184,149,107,0.06)_0%,transparent_50%)]" />

      {/* LARGE outer arabesque ring */}
      {!isMobile && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none ldr-outer-ring">
          <svg width="600" height="600" viewBox="0 0 600 600" fill="none" className="max-md:w-[380px] max-md:h-[380px]">
            {/* Big 8-point star */}
            <path d="M300 10 L340 210 L540 210 L370 320 L430 540 L300 410 L170 540 L230 320 L60 210 L260 210Z"
              stroke="var(--olive-glow)" strokeWidth="1" opacity="0.25" />
            <path d="M300 50 L325 220 L490 220 L350 305 L400 490 L300 380 L200 490 L250 305 L110 220 L275 220Z"
              stroke="var(--sand)" strokeWidth="0.7" opacity="0.18" />
            {/* Concentric circles */}
            <circle cx="300" cy="300" r="270" stroke="var(--olive-glow)" strokeWidth="0.6" opacity="0.15" />
            <circle cx="300" cy="300" r="240" stroke="var(--sand)" strokeWidth="0.5" opacity="0.12" strokeDasharray="14 10" />
            <circle cx="300" cy="300" r="210" stroke="var(--olive-glow)" strokeWidth="0.5" opacity="0.18" />
            <circle cx="300" cy="300" r="180" stroke="var(--sand)" strokeWidth="0.4" opacity="0.1" strokeDasharray="8 6" />
            {/* Corner diamond ornaments */}
            <path d="M300 35 L315 60 L300 85 L285 60Z" stroke="var(--olive-glow)" strokeWidth="0.9" opacity="0.35" />
            <path d="M300 515 L315 540 L300 565 L285 540Z" stroke="var(--olive-glow)" strokeWidth="0.9" opacity="0.35" />
            <path d="M35 300 L60 285 L85 300 L60 315Z" stroke="var(--olive-glow)" strokeWidth="0.9" opacity="0.35" />
            <path d="M515 300 L540 285 L565 300 L540 315Z" stroke="var(--olive-glow)" strokeWidth="0.9" opacity="0.35" />
            {/* Side diamond ornaments */}
            <path d="M170 90 L180 110 L170 130 L160 110Z" stroke="var(--sand)" strokeWidth="0.7" opacity="0.22" />
            <path d="M430 90 L440 110 L430 130 L420 110Z" stroke="var(--sand)" strokeWidth="0.7" opacity="0.22" />
            <path d="M170 470 L180 490 L170 510 L160 490Z" stroke="var(--sand)" strokeWidth="0.7" opacity="0.22" />
            <path d="M430 470 L440 490 L430 510 L420 490Z" stroke="var(--sand)" strokeWidth="0.7" opacity="0.22" />
          </svg>
        </div>
      )}

      {/* MID inner ring */}
      {!isMobile && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none ldr-mid-ring">
          <svg width="380" height="380" viewBox="0 0 380 380" fill="none" className="max-md:w-[260px] max-md:h-[260px]">
            <path d="M190 25 L215 130 L330 130 L245 195 L275 310 L190 250 L105 310 L135 195 L50 130 L165 130Z"
              stroke="var(--olive-glow)" strokeWidth="0.9" opacity="0.28" />
            <path d="M190 55 L205 140 L295 140 L230 190 L250 280 L190 230 L130 280 L150 190 L85 140 L175 140Z"
              stroke="var(--sand)" strokeWidth="0.6" opacity="0.2" />
            <circle cx="190" cy="190" r="160" stroke="var(--olive-glow)" strokeWidth="0.5" opacity="0.16" />
            <circle cx="190" cy="190" r="135" stroke="var(--sand)" strokeWidth="0.4" opacity="0.12" strokeDasharray="10 6" />
            {/* Inner diamond accents */}
            <path d="M190 50 L200 70 L190 90 L180 70Z" stroke="var(--olive-glow)" strokeWidth="0.7" opacity="0.3" />
            <path d="M190 290 L200 310 L190 330 L180 310Z" stroke="var(--olive-glow)" strokeWidth="0.7" opacity="0.3" />
          </svg>
        </div>
      )}

      {/* SMALL inner ornament around logo area */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none ldr-inner-ring">
        <svg width="220" height="220" viewBox="0 0 220 220" fill="none" className="max-md:w-[160px] max-md:h-[160px]">
          <path d="M110 15 L130 80 L190 80 L145 120 L165 190 L110 150 L55 190 L75 120 L30 80 L90 80Z"
            stroke="var(--sand)" strokeWidth="0.9" opacity="0.22" />
          <path d="M110 40 L122 90 L170 90 L132 122 L148 170 L110 138 L72 170 L88 122 L50 90 L98 90Z"
            stroke="var(--olive-glow)" strokeWidth="0.6" opacity="0.3" />
          <circle cx="110" cy="110" r="95" stroke="var(--sand)" strokeWidth="0.5" opacity="0.14" />
          <circle cx="110" cy="110" r="75" stroke="var(--olive-glow)" strokeWidth="0.4" opacity="0.18" strokeDasharray="6 4" />
        </svg>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none ldr-particles">
        {Array.from({ length: isMobile ? 10 : 24 }).map((_, i) => {
          const size = 1.2 + (i % 4) * 0.7;
          const left = 6 + ((i * 41) % 88);
          const top = 5 + ((i * 47) % 90);
          const delay = (i * 0.28) % 5;
          const dur = 4.5 + (i % 5);
          const colors = ['var(--olive-glow)', 'var(--sand)', 'var(--bronze-light)'];
          const color = colors[i % 3];
          return (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                width: size,
                height: size,
                left: `${left}%`,
                top: `${top}%`,
                background: color,
                boxShadow: `0 0 ${size * 5}px ${color}`,
                animation: `ldrParticleFloat ${dur}s ease-in-out infinite ${delay}s`,
              }}
            />
          );
        })}
      </div>

      {/* Content — centered higher */}
      <div ref={contentRef} className="relative z-10 flex flex-col items-center justify-center h-full ldr-content">
        {/* Logo with strong glow */}
        <div className="relative mb-5 ldr-logo-wrap">
          <div className="ldr-logo-glow absolute -inset-6 rounded-full" />
          <div className="relative">
            <img
              src={logoImg}
              alt="واحة سيوة"
              className="w-[110px] h-auto object-contain max-md:w-[88px] ldr-logo-img"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
        </div>

        {/* Text — whole line, not letter-by-letter */}
        <div className="font-ar text-[clamp(1.8rem,4.5vw,3rem)] font-light text-cream mb-6 tracking-wide ldr-text">
          واحة سيوة
        </div>

        {/* Decorative line ornament */}
        <div className="ldr-ornament flex items-center gap-3 mb-8">
          <span className="block w-10 h-px bg-[rgba(164,184,107,0.4)]" />
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2 L12 8 L18 8 L13 12 L15 18 L10 14 L5 18 L7 12 L2 8 L8 8Z"
              stroke="var(--olive-glow)" strokeWidth="0.8" opacity="0.6" />
          </svg>
          <span className="block w-10 h-px bg-[rgba(164,184,107,0.4)]" />
        </div>

        {/* Progress bar with shimmer */}
        <div className="relative w-[220px] h-[2px] max-md:w-[180px] ldr-bar">
          <div className="absolute inset-0 rounded-full bg-[rgba(212,197,169,0.12)]" />
          <div className="ldr-bar-fill absolute inset-y-0 left-0 rounded-full origin-right" />
          <div className="ldr-bar-shine absolute inset-y-0 w-[40%] rounded-full" />
        </div>

        {/* Micro label */}
        <div className="mt-5 font-en text-[0.6rem] tracking-[0.4em] text-olive-glow opacity-40 uppercase ldr-label">
          Loading
        </div>
      </div>

      <style>{`
        @keyframes ldrParticleFloat {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.15; }
          33% { transform: translate(10px, -24px) scale(1.3); opacity: 0.5; }
          66% { transform: translate(-8px, -16px) scale(0.9); opacity: 0.3; }
        }

        .ldr-overlay {
          clip-path: circle(150% at 50% 50%);
        }

        .ldr-outer-ring {
          opacity: 0;
          transform: scale(0.8) rotate(-15deg);
          animation: ldrRingIn1 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
        }
        @keyframes ldrRingIn1 {
          to { opacity: 1; transform: scale(1) rotate(0deg); }
        }

        .ldr-mid-ring {
          opacity: 0;
          transform: scale(0.65) rotate(20deg);
          animation: ldrRingIn2 2s cubic-bezier(0.16, 1, 0.3, 1) 0.25s forwards;
        }
        @keyframes ldrRingIn2 {
          to { opacity: 1; transform: scale(1) rotate(0deg); }
        }

        .ldr-inner-ring {
          opacity: 0;
          transform: scale(0.5) rotate(-25deg);
          animation: ldrRingIn3 2.2s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
        }
        @keyframes ldrRingIn3 {
          to { opacity: 1; transform: scale(1) rotate(0deg); }
        }

        .ldr-particles span {
          opacity: 0;
        }
        .ldr-particles span:nth-child(1)  { animation: ldrParticleFloat 5.2s ease-in-out infinite 0.1s, ldrFadeParticle 1s ease 0.2s forwards; }
        .ldr-particles span:nth-child(2)  { animation: ldrParticleFloat 4.8s ease-in-out infinite 0.5s, ldrFadeParticle 1s ease 0.3s forwards; }
        .ldr-particles span:nth-child(3)  { animation: ldrParticleFloat 5.5s ease-in-out infinite 0.2s, ldrFadeParticle 1s ease 0.25s forwards; }
        .ldr-particles span:nth-child(4)  { animation: ldrParticleFloat 4.5s ease-in-out infinite 0.8s, ldrFadeParticle 1s ease 0.4s forwards; }
        .ldr-particles span:nth-child(5)  { animation: ldrParticleFloat 5.0s ease-in-out infinite 0.3s, ldrFadeParticle 1s ease 0.35s forwards; }
        .ldr-particles span:nth-child(6)  { animation: ldrParticleFloat 5.8s ease-in-out infinite 0.6s, ldrFadeParticle 1s ease 0.45s forwards; }
        .ldr-particles span:nth-child(7)  { animation: ldrParticleFloat 4.6s ease-in-out infinite 0.4s, ldrFadeParticle 1s ease 0.3s forwards; }
        .ldr-particles span:nth-child(8)  { animation: ldrParticleFloat 5.3s ease-in-out infinite 0.7s, ldrFadeParticle 1s ease 0.5s forwards; }
        .ldr-particles span:nth-child(9)  { animation: ldrParticleFloat 4.9s ease-in-out infinite 0.1s, ldrFadeParticle 1s ease 0.2s forwards; }
        .ldr-particles span:nth-child(10) { animation: ldrParticleFloat 5.1s ease-in-out infinite 0.9s, ldrFadeParticle 1s ease 0.55s forwards; }
        .ldr-particles span:nth-child(11) { animation: ldrParticleFloat 4.7s ease-in-out infinite 0.5s, ldrFadeParticle 1s ease 0.35s forwards; }
        .ldr-particles span:nth-child(12) { animation: ldrParticleFloat 5.4s ease-in-out infinite 0.2s, ldrFadeParticle 1s ease 0.25s forwards; }
        .ldr-particles span:nth-child(13) { animation: ldrParticleFloat 4.4s ease-in-out infinite 0.8s, ldrFadeParticle 1s ease 0.45s forwards; }
        .ldr-particles span:nth-child(14) { animation: ldrParticleFloat 5.6s ease-in-out infinite 0.3s, ldrFadeParticle 1s ease 0.3s forwards; }
        .ldr-particles span:nth-child(15) { animation: ldrParticleFloat 4.8s ease-in-out infinite 0.6s, ldrFadeParticle 1s ease 0.4s forwards; }
        .ldr-particles span:nth-child(16) { animation: ldrParticleFloat 5.2s ease-in-out infinite 0.4s, ldrFadeParticle 1s ease 0.35s forwards; }
        .ldr-particles span:nth-child(17) { animation: ldrParticleFloat 4.5s ease-in-out infinite 0.7s, ldrFadeParticle 1s ease 0.5s forwards; }
        .ldr-particles span:nth-child(18) { animation: ldrParticleFloat 5.0s ease-in-out infinite 0.1s, ldrFadeParticle 1s ease 0.2s forwards; }
        .ldr-particles span:nth-child(19) { animation: ldrParticleFloat 5.7s ease-in-out infinite 0.5s, ldrFadeParticle 1s ease 0.4s forwards; }
        .ldr-particles span:nth-child(20) { animation: ldrParticleFloat 4.6s ease-in-out infinite 0.9s, ldrFadeParticle 1s ease 0.55s forwards; }
        .ldr-particles span:nth-child(21) { animation: ldrParticleFloat 5.3s ease-in-out infinite 0.3s, ldrFadeParticle 1s ease 0.3s forwards; }
        .ldr-particles span:nth-child(22) { animation: ldrParticleFloat 4.9s ease-in-out infinite 0.6s, ldrFadeParticle 1s ease 0.45s forwards; }
        .ldr-particles span:nth-child(23) { animation: ldrParticleFloat 5.1s ease-in-out infinite 0.2s, ldrFadeParticle 1s ease 0.25s forwards; }
        .ldr-particles span:nth-child(24) { animation: ldrParticleFloat 4.8s ease-in-out infinite 0.7s, ldrFadeParticle 1s ease 0.5s forwards; }

        @keyframes ldrFadeParticle {
          to { opacity: 0.5; }
        }

        .ldr-logo-wrap {
          opacity: 0;
          transform: scale(0.35) translateY(20px);
          filter: blur(14px);
          animation: ldrLogoIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards;
        }
        @keyframes ldrLogoIn {
          to { opacity: 1; transform: scale(1) translateY(0); filter: blur(0px); }
        }

        .ldr-logo-glow {
          background: radial-gradient(circle, rgba(164,184,107,0.22) 0%, rgba(212,197,169,0.08) 40%, transparent 70%);
          filter: blur(24px);
          opacity: 0;
          animation: ldrGlowIn 1.6s ease 0.6s forwards;
        }
        @keyframes ldrGlowIn {
          to { opacity: 1; }
        }

        .ldr-text {
          opacity: 0;
          transform: translateY(24px);
          animation: ldrTextIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.9s forwards;
        }
        @keyframes ldrTextIn {
          to { opacity: 1; transform: translateY(0); }
        }

        .ldr-ornament {
          opacity: 0;
          transform: scaleX(0.6);
          animation: ldrOrnamentIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.2s forwards;
        }
        @keyframes ldrOrnamentIn {
          to { opacity: 1; transform: scaleX(1); }
        }

        .ldr-bar {
          opacity: 0;
          transform: translateY(12px);
          animation: ldrFadeUp 0.6s ease 1.5s forwards;
        }
        @keyframes ldrFadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        .ldr-bar-fill {
          background: linear-gradient(90deg, rgba(164,184,107,0.55), rgba(212,197,169,0.35));
          transform: scaleX(0);
          transform-origin: right center;
          animation: ldrBarGrow 2s cubic-bezier(0.34, 1.56, 0.64, 1) 1.7s forwards;
        }
        @keyframes ldrBarGrow {
          to { transform: scaleX(1); }
        }

        .ldr-bar-shine {
          background: linear-gradient(90deg, transparent, rgba(245,239,227,0.35), transparent);
          transform: translateX(-200%);
          animation: ldrShineSweep 1.8s ease-in-out 2.2s forwards;
        }
        @keyframes ldrShineSweep {
          0% { transform: translateX(-200%); }
          100% { transform: translateX(350%); }
        }

        .ldr-label {
          opacity: 0;
          animation: ldrFadeIn 0.8s ease 2.4s forwards;
        }
        @keyframes ldrFadeIn {
          to { opacity: 0.4; }
        }

        /* EXIT */
        .ldr-exiting .ldr-content {
          opacity: 0 !important;
          transform: scale(0.9) !important;
          transition: transform 0.7s ease, opacity 0.7s ease !important;
        }
        .ldr-exiting .ldr-outer-ring,
        .ldr-exiting .ldr-mid-ring,
        .ldr-exiting .ldr-inner-ring,
        .ldr-exiting .ldr-particles {
          opacity: 0 !important;
          transition: opacity 0.5s ease !important;
        }
      `}</style>
    </div>
  );
}
