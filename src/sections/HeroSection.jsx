import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import heroBg1 from '../images/hero-bg1.png';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection({ isLoaded }) {
  const sectionRef = useRef(null);
  const word1Ref = useRef(null);
  const word2Ref = useRef(null);
  const word3Ref = useRef(null);
  const subRef = useRef(null);
  const btnRef = useRef(null);
  const scrollRef = useRef(null);
  const vegGroupRef = useRef(null);
  const dustRef = useRef(null);
  useLayoutEffect(() => {
    if (!isLoaded) return;

    const section = sectionRef.current;
    if (!section) return;

    const w1 = word1Ref.current;
    const w2 = word2Ref.current;
    const w3 = word3Ref.current;
    const sub = subRef.current;
    const btn = btnRef.current;
    const scroll = scrollRef.current;
    const veg = vegGroupRef.current;
    const dust = dustRef.current;

    const ctx = gsap.context(() => {
      // Set initial scattered states
      gsap.set([w1, w2, w3], { opacity: 0 });
      gsap.set(w1, { x: -window.innerWidth * 0.45, y: -120, rotate: -25, scale: 0.4 });
      gsap.set(w2, { y: -window.innerHeight * 0.5, rotate: 8, scale: 0.3 });
      gsap.set(w3, { x: window.innerWidth * 0.45, y: 80, rotate: 20, scale: 0.4 });
      gsap.set(sub, { opacity: 0, y: 40, filter: 'blur(12px)' });
      gsap.set(btn, { opacity: 0, y: 30, scale: 0.85 });
      gsap.set(scroll, { opacity: 0, y: 20 });
      if (veg) gsap.set(veg, { scaleY: 0, transformOrigin: '50% 100%' });
      if (dust) gsap.set(dust.children, { opacity: 0, scale: 0 });

      const tl = gsap.timeline({
        delay: 0.4,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'bottom top',
          toggleActions: 'play none none reverse',
          invalidateOnRefresh: true,
        },
      });

      // --- Word 1 "من" flies from left with trail glow ---
      tl.to(w1, {
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
      }, 0);

      // --- Word 2 "قلب" drops from sky with elastic bounce ---
      tl.to(w2, {
        y: 0,
        rotate: 0,
        scale: 1,
        opacity: 1,
        duration: 1.1,
        ease: 'back.out(1.6)',
      }, 0.25);

      // --- Word 3 "سيوة" sweeps from right ---
      tl.to(w3, {
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
      }, 0.5);

      // --- Title settle micro-bounce ---
      tl.to([w1, w2, w3], {
        y: -6,
        duration: 0.25,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1,
      }, 1.5);

      // --- Dust burst on landing ---
      if (dust) {
        tl.to(dust.children, {
          opacity: (i) => 0.15 + i * 0.02,
          scale: 1,
          duration: 0.8,
          stagger: 0.04,
          ease: 'power2.out',
        }, 1.4);
      }

      // --- Subtitle reveals from blur ---
      tl.to(sub, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1.0,
        ease: 'power2.out',
      }, 1.7);

      // --- CTA button rises & pulses ---
      tl.to(btn, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'back.out(1.4)',
      }, 2.1);

      // --- Scroll hint ---
      tl.to(scroll, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
      }, 2.6);

      // --- Vegetation grows from earth ---
      if (veg) {
        tl.to(veg, {
          scaleY: 1,
          duration: 1.6,
          ease: 'power2.out',
        }, 2.0);
        // Individual leaves stagger
        const leaves = veg.querySelectorAll('.hero-veg-leaf');
        if (leaves.length) {
          tl.fromTo(leaves,
            { scale: 0, rotate: -20 },
            { scale: 1, rotate: 0, duration: 0.7, stagger: 0.1, ease: 'back.out(2)' },
            2.4
          );
        }
      }
    }, section);

    return () => ctx.revert();
  }, [isLoaded]);

  return (
    <section ref={sectionRef} className="section hero relative min-h-screen flex items-center justify-center overflow-hidden" id="hero">
      <div className="hero-bg absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#1a1e0e_0%,#2a2818_25%,#3a3524_50%,#4a4230_75%,#5a5038_100%)]" />
        <div className="hero-dunes hero-dunes-far absolute bottom-0 left-0 right-0 h-[70%] bg-[linear-gradient(to_top,rgba(45,52,24,0.8)_0%,rgba(45,52,24,0.4)_30%,transparent_100%)] [clip-path:polygon(0%_100%,0%_55%,15%_45%,30%_50%,45%_40%,60%_48%,75%_38%,90%_45%,100%_35%,100%_100%)] animate-duneBreath" />
        <div className="hero-dunes hero-dunes-mid absolute bottom-0 left-0 right-0 h-1/2 bg-[linear-gradient(to_top,rgba(74,90,42,0.6)_0%,rgba(74,90,42,0.2)_50%,transparent_100%)] [clip-path:polygon(0%_100%,0%_65%,20%_55%,40%_62%,55%_50%,70%_58%,85%_48%,100%_55%,100%_100%)] [animation:duneBreath_8s_ease-in-out_infinite_1s]" />
        <div className="hero-dunes hero-dunes-near absolute bottom-0 left-0 right-0 h-[35%] bg-[linear-gradient(to_top,var(--shadow)_0%,rgba(26,24,20,0.9)_40%,transparent_100%)] [clip-path:polygon(0%_100%,0%_75%,25%_65%,50%_72%,75%_60%,100%_68%,100%_100%)] [animation:duneBreath_12s_ease-in-out_infinite_2s]" />
        <div className="absolute bottom-0 right-[-5%] w-[45%] h-[55%] opacity-60 bg-[linear-gradient(180deg,transparent_0%,rgba(26,24,20,0.3)_30%,var(--shadow)_100%)] [clip-path:polygon(50%_0%,52%_15%,60%_12%,58%_18%,65%_8%,70%_14%,68%_20%,75%_5%,82%_12%,78%_22%,85%_10%,90%_18%,85%_28%,92%_15%,95%_25%,88%_35%,94%_28%,96%_38%,90%_45%,80%_42%,75%_48%,70%_45%,60%_50%,55%_55%,52%_100%,48%_100%,45%_55%,35%_50%,30%_45%,25%_48%,20%_42%,10%_45%,4%_38%,6%_28%,12%_35%,5%_25%,10%_15%,15%_28%,22%_18%,18%_12%,25%_22%,32%_14%,30%_8%,35%_20%,42%_18%,40%_12%,45%_15%,48%_0%)] max-md:w-[70%]" />
        <div className="absolute inset-0 z-[5] pointer-events-none bg-center bg-cover opacity-80 mix-blend-multiply [filter:contrast(1.1)_brightness(0.9)_saturate(0.75)]" style={{ backgroundImage: `url(${heroBg1})` }} />
        <div className="absolute bottom-0 left-0 right-0 h-[22%] z-[6] pointer-events-none overflow-hidden max-md:h-[18%] max-[480px]:h-[15%]">
          <div className="absolute bottom-0 left-[-10%] right-[-10%] w-[120%] h-[85%] bg-[linear-gradient(to_top,rgba(74,90,42,0.35)_0%,rgba(74,90,42,0.15)_50%,transparent_100%)] [clip-path:polygon(0%_100%,0%_70%,12%_62%,25%_68%,38%_58%,52%_65%,65%_55%,78%_62%,90%_52%,100%_60%,100%_100%)] animate-sandDrift1" />
          <div className="absolute bottom-0 left-[-10%] right-[-10%] w-[120%] h-[65%] bg-[linear-gradient(to_top,rgba(45,52,24,0.5)_0%,rgba(45,52,24,0.2)_45%,transparent_100%)] [clip-path:polygon(0%_100%,0%_55%,15%_48%,30%_55%,45%_42%,58%_50%,72%_38%,85%_48%,100%_40%,100%_100%)] animate-sandDrift2" />
          <div className="absolute bottom-0 left-[-10%] right-[-10%] w-[120%] h-[45%] bg-[linear-gradient(to_top,var(--shadow)_0%,rgba(26,24,20,0.7)_40%,transparent_100%)] [clip-path:polygon(0%_100%,0%_45%,18%_38%,35%_48%,50%_35%,65%_42%,80%_32%,92%_40%,100%_35%,100%_100%)] animate-sandDrift3" />
        </div>
      </div>

      {/* Animated vegetation that grows from ground */}
      <div ref={vegGroupRef} className="absolute bottom-0 left-0 right-0 z-[7] pointer-events-none h-[28vh] max-md:h-[20vh] max-[480px]:h-[16vh]" aria-hidden="true">
        <svg className="absolute bottom-0 left-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="vegGrad1" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#2d3418" />
              <stop offset="100%" stopColor="#4a5a2a" />
            </linearGradient>
            <linearGradient id="vegGrad2" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#1a1814" />
              <stop offset="100%" stopColor="#3a4520" />
            </linearGradient>
          </defs>
          {/* Left palm silhouette */}
          <g className="hero-veg-leaf" style={{ transformOrigin: '180px 320px' }}>
            <path d="M180,320 Q178,280 175,250 Q172,210 168,180 Q165,150 170,130" fill="none" stroke="url(#vegGrad2)" strokeWidth="6" strokeLinecap="round" />
            <path d="M170,130 Q145,110 115,95 Q95,85 75,92 Q105,100 135,115 Q160,125 172,135" fill="url(#vegGrad1)" opacity="0.85" />
            <path d="M170,130 Q195,105 225,88 Q245,78 265,85 Q235,95 205,112 Q180,125 172,135" fill="url(#vegGrad1)" opacity="0.8" />
            <path d="M170,130 Q155,95 140,60 Q130,38 115,45 Q135,60 152,92 Q165,118 170,130" fill="url(#vegGrad1)" opacity="0.75" />
            <path d="M170,130 Q185,95 200,60 Q210,38 225,45 Q205,60 188,92 Q175,118 170,130" fill="url(#vegGrad1)" opacity="0.75" />
            <path d="M170,130 Q140,140 105,145 Q82,148 68,155 Q100,152 132,148 Q158,142 170,138" fill="rgba(45,52,24,0.7)" />
            <path d="M170,130 Q200,140 235,145 Q258,148 272,155 Q240,152 208,148 Q182,142 170,138" fill="rgba(45,52,24,0.7)" />
          </g>
          {/* Right palm silhouette */}
          <g className="hero-veg-leaf" style={{ transformOrigin: '1260px 320px' }}>
            <path d="M1260,320 Q1262,280 1265,250 Q1268,210 1272,180 Q1275,150 1270,130" fill="none" stroke="url(#vegGrad2)" strokeWidth="6" strokeLinecap="round" />
            <path d="M1270,130 Q1245,110 1215,95 Q1195,85 1175,92 Q1205,100 1235,115 Q1260,125 1272,135" fill="url(#vegGrad1)" opacity="0.85" />
            <path d="M1270,130 Q1295,105 1325,88 Q1345,78 1365,85 Q1335,95 1305,112 Q1280,125 1272,135" fill="url(#vegGrad1)" opacity="0.8" />
            <path d="M1270,130 Q1255,95 1240,60 Q1230,38 1215,45 Q1235,60 1252,92 Q1265,118 1270,130" fill="url(#vegGrad1)" opacity="0.75" />
            <path d="M1270,130 Q1285,95 1300,60 Q1310,38 1325,45 Q1305,60 1288,92 Q1275,118 1270,130" fill="url(#vegGrad1)" opacity="0.75" />
            <path d="M1270,130 Q1240,140 1205,145 Q1182,148 1168,155 Q1200,152 1232,148 Q1258,142 1270,138" fill="rgba(45,52,24,0.7)" />
            <path d="M1270,130 Q1300,140 1335,145 Q1358,148 1372,155 Q1340,152 1308,148 Q1282,142 1270,138" fill="rgba(45,52,24,0.7)" />
          </g>
          {/* Grass tufts */}
          <g className="hero-veg-leaf" style={{ transformOrigin: '400px 320px' }}>
            <path d="M400,320 Q395,295 390,275 Q385,260 380,270 Q388,285 395,305 Q398,315 400,320" fill="rgba(74,90,42,0.6)" />
            <path d="M400,320 Q405,290 412,268 Q418,255 422,265 Q412,280 406,300 Q402,312 400,320" fill="rgba(74,90,42,0.5)" />
            <path d="M400,320 Q395,305 385,290 Q380,282 378,288 Q386,298 394,310 Q398,316 400,320" fill="rgba(60,75,30,0.55)" />
          </g>
          <g className="hero-veg-leaf" style={{ transformOrigin: '1000px 320px' }}>
            <path d="M1000,320 Q995,295 990,275 Q985,260 980,270 Q988,285 995,305 Q998,315 1000,320" fill="rgba(74,90,42,0.6)" />
            <path d="M1000,320 Q1005,290 1012,268 Q1018,255 1022,265 Q1012,280 1006,300 Q1002,312 1000,320" fill="rgba(74,90,42,0.5)" />
            <path d="M1000,320 Q995,305 985,290 Q980,282 978,288 Q986,298 994,310 Q998,316 1000,320" fill="rgba(60,75,30,0.55)" />
          </g>
          <g className="hero-veg-leaf" style={{ transformOrigin: '720px 320px' }}>
            <path d="M720,320 Q715,300 710,280 Q705,268 700,275 Q708,288 715,305 Q718,314 720,320" fill="rgba(74,90,42,0.5)" />
            <path d="M720,320 Q725,298 730,278 Q735,268 738,275 Q730,288 725,304 Q722,314 720,320" fill="rgba(60,75,30,0.45)" />
          </g>
        </svg>
      </div>

      {/* Dust particles burst */}
      <div ref={dustRef} className="absolute inset-0 z-[11] pointer-events-none overflow-hidden" aria-hidden="true">
        {[...Array(16)].map((_, i) => (
          <span
            key={i}
            className="absolute w-[3px] h-[3px] rounded-full bg-[rgba(164,184,107,0.35)]"
            style={{
              left: `${40 + Math.random() * 20}%`,
              top: `${35 + Math.random() * 15}%`,
            }}
          />
        ))}
      </div>

      <div className="hero-content relative z-[10] text-center px-8">
        <h1 className="hero-title mb-6 flex items-center justify-center gap-[clamp(0.5rem,2vw,1.2rem)]" data-parallax="0.5">
          <span
            ref={word1Ref}
            className="inline-block font-['Aref_Ruqaa','Tajawal',serif] text-[clamp(3.5rem,12vw,11rem)] font-bold leading-[1.15] text-transparent text-stroke-cream [text-shadow:0_0_20px_rgba(212,197,169,0.25),0_0_60px_rgba(212,197,169,0.12),0_4px_30px_rgba(0,0,0,0.6)] tracking-[0.04em]"
          >
            من
          </span>
          <span
            ref={word2Ref}
            className="inline-block font-['Aref_Ruqaa','Tajawal',serif] text-[clamp(3.5rem,12vw,11rem)] font-bold leading-[1.15] text-transparent text-stroke-cream [text-shadow:0_0_20px_rgba(212,197,169,0.25),0_0_60px_rgba(212,197,169,0.12),0_4px_30px_rgba(0,0,0,0.6)] tracking-[0.04em]"
          >
            قلب
          </span>
          <span
            ref={word3Ref}
            className="inline-block font-['Aref_Ruqaa','Tajawal',serif] text-[clamp(3.5rem,12vw,11rem)] font-bold leading-[1.15] text-transparent text-stroke-cream [text-shadow:0_0_20px_rgba(212,197,169,0.25),0_0_60px_rgba(212,197,169,0.12),0_4px_30px_rgba(0,0,0,0.6)] tracking-[0.04em]"
          >
            سيوة
          </span>
        </h1>
        <p
          ref={subRef}
          className="font-ar text-[clamp(1rem,2.5vw,1.4rem)] font-light text-sand leading-[1.8] mb-10"
          data-parallax="0.7"
        >
          حيث يلتقي التراث بالطبيعة
          <br />
          في قلب الصحراء الغربية
        </p>
        <div ref={btnRef} data-parallax="0.9">
          <a
            href="#journey"
            className="group inline-flex items-center gap-4 py-4 px-10 border border-[rgba(212,197,169,0.45)] rounded-[100px] no-underline font-ar text-[0.95rem] font-medium text-cream transition-all duration-500 [transition-timing-function:var(--ease-cinematic)] relative overflow-hidden bg-[rgba(26,24,20,0.45)] [backdrop-filter:blur(10px)] shadow-[0_0_20px_rgba(164,184,107,0.08),inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-[rgba(164,184,107,0.7)] hover:text-cream hover:-translate-y-[3px] hover:shadow-[0_0_40px_rgba(164,184,107,0.2),0_10px_40px_rgba(74,90,42,0.3)] before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(74,90,42,0.3),rgba(164,184,107,0.2))] before:opacity-40 before:transition-opacity before:duration-500 hover:before:opacity-100"
          >
            <span className="absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,rgba(164,184,107,0.25)_50%,transparent_60%)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
            <span className="absolute inset-0 rounded-[100px] opacity-60 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_center,rgba(164,184,107,0.15)_0%,transparent_70%)]" />
            <span className="relative z-[1]">استكشف الواحة</span>
            <span className="cta-arrow relative z-[1] w-[24px] h-px bg-cream transition-[width,background-color] duration-300 group-hover:w-[32px] group-hover:bg-olive-glow after:content-[''] after:absolute after:left-0 after:top-1/2 after:w-[6px] after:h-[6px] after:border-l after:border-b after:border-cream after:-translate-y-1/2 after:rotate-45 after:transition-[border-color] duration-300 group-hover:after:border-olive-glow" />
          </a>
        </div>
      </div>

      <div ref={scrollRef} className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <div className="w-px h-[50px] bg-[linear-gradient(to_bottom,var(--olive-glow),transparent)] animate-scrollPulse" />
        <span className="font-ar text-[0.65rem] font-light text-olive-glow tracking-[0.2em]">اسحب للأسفل</span>
      </div>
    </section>
  );
}
