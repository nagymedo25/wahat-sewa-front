import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SidePalmTrees({ isLoaded }) {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    if (!isLoaded) return;
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const container = containerRef.current;
    if (!container) return;

    const palms = container.querySelectorAll('.palm-grow');
    const allLeaves = container.querySelectorAll('.palm-leaf');

    const ctx = gsap.context(() => {
      // Initial state: palms hidden (growing from ground)
      gsap.set(palms, { scaleY: 0, transformOrigin: 'bottom center' });
      gsap.set(allLeaves, { scale: 0, rotate: -15, transformOrigin: '50% 100%' });

      // Find the hero section as the trigger (palms are fixed, so we need a real section element)
      const heroEl = document.querySelector('.hero');
      if (!heroEl) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroEl,
          start: 'top 80%',
          end: 'bottom top',
          toggleActions: 'play none none reverse',
          invalidateOnRefresh: true,
        },
      });

      // Initial delay after hero enters view
      tl.fromTo({}, {}, { duration: 1.5 });

      palms.forEach((palm, i) => {
        tl.to(palm, {
          scaleY: 1,
          duration: 1.8,
          ease: 'power2.out',
        }, 1.5 + i * 0.25);
      });

      if (allLeaves.length) {
        tl.to(allLeaves, {
          scale: 1,
          rotate: 0,
          duration: 0.6,
          stagger: 0.06,
          ease: 'back.out(2)',
        }, 3.5);
      }
    }, container);

    return () => ctx.revert();
  }, [isLoaded]);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[20] overflow-visible block">
      <div className="palm-grow absolute bottom-0 right-[-5%] origin-bottom w-[clamp(200px,22vw,400px)] h-[85vh] flex items-end justify-center max-md:w-[35vw] max-md:h-[50vh] max-md:right-[-5vw] max-[480px]:w-[28vw] max-[480px]:h-[42vh] max-[480px]:right-[-4vw]">
        <div className="palm-tree origin-bottom animate-palmSwayRight w-full h-full flex items-end justify-center">
          <svg viewBox="0 0 300 680" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg" className="w-full h-full block overflow-visible">
          <defs>
            <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#2d3418', stopOpacity: 1 }} />
              <stop offset="40%" style={{ stopColor: '#4a5a2a', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#1a1814', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="leafGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#4a5a2a', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#2d3418', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="leafGradLight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#6b7a3a', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#3a4520', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path d="M148,680 Q155,640 150,595 Q143,550 152,510 Q160,470 151,430 Q145,390 154,350 Q162,310 153,270 Q147,230 153,190 Q157,150 150,125" fill="none" stroke="url(#trunkGrad)" strokeWidth="20" strokeLinecap="round" />
          <path d="M148,680 Q155,640 150,595 Q143,550 152,510 Q160,470 151,430 Q145,390 154,350 Q162,310 153,270 Q147,230 153,190 Q157,150 150,125" fill="none" stroke="rgba(45,52,24,0.4)" strokeWidth="24" strokeLinecap="round" transform="translate(3,0)" />
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway">
            <path d="M150,130 Q115,95 75,75 Q55,65 35,72 Q65,80 90,100 Q120,120 145,145" fill="url(#leafGrad)" />
            <path d="M150,130 Q105,85 55,65 Q35,55 15,65 Q50,75 80,100 Q112,115 145,140" fill="url(#leafGrad)" />
            <path d="M150,130 Q95,75 40,58 Q18,48 0,58 Q38,68 72,95 Q105,112 145,135" fill="url(#leafGradLight)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.4s' }}>
            <path d="M150,130 Q185,95 225,75 Q245,65 265,72 Q235,80 210,100 Q180,120 155,145" fill="url(#leafGrad)" />
            <path d="M150,130 Q195,85 245,65 Q265,55 285,65 Q250,75 220,100 Q188,115 155,140" fill="url(#leafGrad)" />
            <path d="M150,130 Q205,75 260,58 Q282,48 300,58 Q262,68 228,95 Q195,112 155,135" fill="url(#leafGradLight)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.8s' }}>
            <path d="M150,130 Q125,60 105,15 Q95,-5 80,0 Q100,15 115,50 Q135,95 148,140" fill="url(#leafGrad)" />
            <path d="M150,130 Q110,50 85,0 Q75,-20 60,-15 Q80,5 100,45 Q120,90 145,130" fill="url(#leafGrad)" />
            <path d="M150,130 Q95,35 65,-15 Q52,-35 38,-28 Q60,-8 88,38 Q115,80 145,125" fill="url(#leafGradLight)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '1.2s' }}>
            <path d="M150,130 Q175,60 195,15 Q205,-5 220,0 Q200,15 185,50 Q165,95 152,140" fill="url(#leafGrad)" />
            <path d="M150,130 Q190,50 215,0 Q225,-20 240,-15 Q220,5 200,45 Q180,90 155,130" fill="url(#leafGrad)" />
            <path d="M150,130 Q205,35 235,-15 Q248,-35 262,-28 Q240,-8 212,38 Q185,80 155,125" fill="url(#leafGradLight)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.6s' }}>
            <path d="M150,130 Q130,45 115,5 Q110,-15 95,-10 Q110,5 120,40 Q138,90 148,135" fill="url(#leafGrad)" />
            <path d="M150,130 Q120,35 100,-15 Q92,-35 78,-28 Q95,-10 112,38 Q132,80 148,125" fill="url(#leafGradLight)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '1.0s' }}>
            <path d="M150,130 Q170,45 185,5 Q190,-15 205,-10 Q190,5 180,40 Q162,90 152,135" fill="url(#leafGrad)" />
            <path d="M150,130 Q180,35 200,-15 Q208,-35 222,-28 Q205,-10 188,38 Q168,80 152,125" fill="url(#leafGradLight)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.3s' }}>
            <path d="M150,130 Q90,110 45,108 Q22,106 5,115 Q38,118 75,125 Q110,132 148,138" fill="rgba(45,52,24,0.7)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.7s' }}>
            <path d="M150,130 Q210,110 255,108 Q278,106 295,115 Q262,118 225,125 Q190,132 152,138" fill="rgba(45,52,24,0.7)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '1.4s' }}>
            <path d="M150,130 Q115,125 65,130 Q40,133 25,145 Q58,138 95,135 Q130,132 148,136" fill="rgba(45,52,24,0.5)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '1.1s' }}>
            <path d="M150,130 Q185,125 235,130 Q260,133 275,145 Q242,138 205,135 Q170,132 152,136" fill="rgba(45,52,24,0.5)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.2s' }}>
            <path d="M150,130 Q80,70 25,48 Q5,38 -10,48 Q25,58 62,85 Q105,108 145,132" fill="rgba(74,90,42,0.5)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.9s' }}>
            <path d="M150,130 Q220,70 275,48 Q295,38 310,48 Q275,58 238,85 Q195,108 155,132" fill="rgba(74,90,42,0.5)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '1.6s' }}>
            <path d="M150,130 Q110,20 80,-20 Q68,-38 52,-32 Q75,-15 102,28 Q128,75 148,128" fill="rgba(60,75,30,0.45)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '1.3s' }}>
            <path d="M150,130 Q190,20 220,-20 Q232,-38 248,-32 Q225,-15 198,28 Q172,75 152,128" fill="rgba(60,75,30,0.45)" />
          </g>
          </svg>
        </div>
      </div>

      <div className="palm-grow absolute bottom-[-2vh] right-[10%] origin-bottom opacity-90 w-[clamp(120px,14vw,240px)] h-[60vh] flex items-end justify-center z-[1] max-md:hidden">
        <div className="palm-tree origin-bottom [animation:palmSwayRight_6s_ease-in-out_infinite_0.5s] w-full h-full flex items-end justify-center">
          <svg viewBox="0 0 300 500" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg" className="w-full h-full block overflow-visible">
          <path d="M152,500 Q158,470 150,440 Q145,410 155,380 Q162,350 152,320 Q147,290 154,270" fill="none" stroke="url(#trunkGrad)" strokeWidth="14" strokeLinecap="round" />
          <path d="M152,500 Q158,470 150,440 Q145,410 155,380 Q162,350 152,320 Q147,290 154,270" fill="none" stroke="rgba(45,52,24,0.35)" strokeWidth="17" strokeLinecap="round" transform="translate(2,0)" />
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.1s' }}>
            <path d="M154,270 Q120,245 80,235 Q60,230 42,238 Q72,242 105,255 Q135,262 150,278" fill="url(#leafGrad)" />
            <path d="M154,270 Q110,250 60,242 Q38,238 20,248 Q55,250 92,265 Q125,272 150,282" fill="url(#leafGradLight)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.3s' }}>
            <path d="M154,270 Q188,245 228,235 Q248,230 266,238 Q236,242 203,255 Q173,262 158,278" fill="url(#leafGrad)" />
            <path d="M154,270 Q198,250 248,242 Q270,238 288,248 Q253,250 216,265 Q183,272 158,282" fill="url(#leafGradLight)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.5s' }}>
            <path d="M154,270 Q135,225 118,195 Q110,178 98,182 Q115,195 130,220 Q145,248 152,272" fill="url(#leafGrad)" />
            <path d="M154,270 Q128,215 105,178 Q95,158 82,162 Q102,178 120,212 Q138,242 150,270" fill="url(#leafGradLight)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.7s' }}>
            <path d="M154,270 Q173,225 190,195 Q198,178 210,182 Q193,195 178,220 Q163,248 156,272" fill="url(#leafGrad)" />
            <path d="M154,270 Q180,215 203,178 Q213,158 226,162 Q206,178 188,212 Q170,242 158,270" fill="url(#leafGradLight)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.2s' }}>
            <path d="M154,270 Q110,255 65,252 Q42,250 28,260 Q62,262 100,270 Q132,275 152,280" fill="rgba(45,52,24,0.6)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.4s' }}>
            <path d="M154,270 Q198,255 243,252 Q266,250 280,260 Q246,262 208,270 Q176,275 156,280" fill="rgba(45,52,24,0.6)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.6s' }}>
            <path d="M154,270 Q130,255 95,260 Q75,265 62,275 Q92,270 120,268 Q142,266 152,268" fill="rgba(55,68,30,0.5)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.8s' }}>
            <path d="M154,270 Q178,255 213,260 Q233,265 246,275 Q216,270 188,268 Q166,266 156,268" fill="rgba(55,68,30,0.5)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.15s' }}>
            <path d="M154,270 Q110,230 50,210 Q30,200 18,210 Q45,220 85,240 Q120,258 150,272" fill="rgba(74,90,42,0.4)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.35s' }}>
            <path d="M154,270 Q213,230 258,210 Q278,200 290,210 Q263,220 223,240 Q188,258 158,272" fill="rgba(74,90,42,0.4)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.55s' }}>
            <path d="M154,270 Q115,210 82,182 Q68,165 55,170 Q78,185 105,212 Q130,240 150,268" fill="rgba(65,80,35,0.35)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.75s' }}>
            <path d="M154,270 Q193,210 226,182 Q240,165 253,170 Q230,185 203,212 Q178,240 158,268" fill="rgba(65,80,35,0.35)" />
          </g>
          </svg>
        </div>
      </div>

      <div className="palm-grow absolute bottom-0 left-[-5%] origin-bottom w-[clamp(200px,22vw,400px)] h-[85vh] flex items-end justify-center max-md:w-[35vw] max-md:h-[50vh] max-md:left-[-5vw] max-[480px]:w-[28vw] max-[480px]:h-[42vh] max-[480px]:left-[-4vw]">
        <div className="palm-tree origin-bottom animate-palmSwayLeft w-full h-full flex items-end justify-center">
          <svg viewBox="0 0 300 680" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg" className="w-full h-full block overflow-visible">
          <path d="M152,680 Q145,640 150,595 Q157,550 148,510 Q140,470 149,430 Q155,390 146,350 Q138,310 147,270 Q153,230 147,190 Q143,150 150,125" fill="none" stroke="url(#trunkGrad)" strokeWidth="20" strokeLinecap="round" />
          <path d="M152,680 Q145,640 150,595 Q157,550 148,510 Q140,470 149,430 Q155,390 146,350 Q138,310 147,270 Q153,230 147,190 Q143,150 150,125" fill="none" stroke="rgba(45,52,24,0.4)" strokeWidth="24" strokeLinecap="round" transform="translate(-3,0)" />
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway">
            <path d="M150,130 Q185,95 225,75 Q245,65 265,72 Q235,80 210,100 Q180,120 155,145" fill="url(#leafGrad)" />
            <path d="M150,130 Q195,85 245,65 Q265,55 285,65 Q250,75 220,100 Q188,115 155,140" fill="url(#leafGrad)" />
            <path d="M150,130 Q205,75 260,58 Q282,48 300,58 Q262,68 228,95 Q195,112 155,135" fill="url(#leafGradLight)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.4s' }}>
            <path d="M150,130 Q115,95 75,75 Q55,65 35,72 Q65,80 90,100 Q120,120 145,145" fill="url(#leafGrad)" />
            <path d="M150,130 Q105,85 55,65 Q35,55 15,65 Q50,75 80,100 Q112,115 145,140" fill="url(#leafGrad)" />
            <path d="M150,130 Q95,75 40,58 Q18,48 0,58 Q38,68 72,95 Q105,112 145,135" fill="url(#leafGradLight)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.8s' }}>
            <path d="M150,130 Q175,60 195,15 Q205,-5 220,0 Q200,15 185,50 Q165,95 152,140" fill="url(#leafGrad)" />
            <path d="M150,130 Q190,50 215,0 Q225,-20 240,-15 Q220,5 200,45 Q180,90 155,130" fill="url(#leafGrad)" />
            <path d="M150,130 Q205,35 235,-15 Q248,-35 262,-28 Q240,-8 212,38 Q185,80 155,125" fill="url(#leafGradLight)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '1.2s' }}>
            <path d="M150,130 Q125,60 105,15 Q95,-5 80,0 Q100,15 115,50 Q135,95 148,140" fill="url(#leafGrad)" />
            <path d="M150,130 Q110,50 85,0 Q75,-20 60,-15 Q80,5 100,45 Q120,90 145,130" fill="url(#leafGrad)" />
            <path d="M150,130 Q95,35 65,-15 Q52,-35 38,-28 Q60,-8 88,38 Q115,80 145,125" fill="url(#leafGradLight)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.6s' }}>
            <path d="M150,130 Q170,45 185,5 Q190,-15 205,-10 Q190,5 180,40 Q162,90 152,135" fill="url(#leafGrad)" />
            <path d="M150,130 Q180,35 200,-15 Q208,-35 222,-28 Q205,-10 188,38 Q168,80 152,125" fill="url(#leafGradLight)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '1.0s' }}>
            <path d="M150,130 Q130,45 115,5 Q110,-15 95,-10 Q110,5 120,40 Q138,90 148,135" fill="url(#leafGrad)" />
            <path d="M150,130 Q120,35 100,-15 Q92,-35 78,-28 Q95,-10 112,38 Q132,80 148,125" fill="url(#leafGradLight)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.3s' }}>
            <path d="M150,130 Q210,110 255,108 Q278,106 295,115 Q262,118 225,125 Q190,132 152,138" fill="rgba(45,52,24,0.7)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.7s' }}>
            <path d="M150,130 Q90,110 45,108 Q22,106 5,115 Q38,118 75,125 Q110,132 148,138" fill="rgba(45,52,24,0.7)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '1.4s' }}>
            <path d="M150,130 Q185,125 235,130 Q260,133 275,145 Q242,138 205,135 Q170,132 152,136" fill="rgba(45,52,24,0.5)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '1.1s' }}>
            <path d="M150,130 Q115,125 65,130 Q40,133 25,145 Q58,138 95,135 Q130,132 148,136" fill="rgba(45,52,24,0.5)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.2s' }}>
            <path d="M150,130 Q220,70 275,48 Q295,38 310,48 Q275,58 238,85 Q195,108 155,132" fill="rgba(74,90,42,0.5)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.9s' }}>
            <path d="M150,130 Q80,70 25,48 Q5,38 -10,48 Q25,58 62,85 Q105,108 145,132" fill="rgba(74,90,42,0.5)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '1.6s' }}>
            <path d="M150,130 Q190,20 220,-20 Q232,-38 248,-32 Q225,-15 198,28 Q172,75 152,128" fill="rgba(60,75,30,0.45)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '1.3s' }}>
            <path d="M150,130 Q110,20 80,-20 Q68,-38 52,-32 Q75,-15 102,28 Q128,75 148,128" fill="rgba(60,75,30,0.45)" />
          </g>
          </svg>
        </div>
      </div>

      <div className="palm-grow absolute bottom-[-2vh] left-[10%] origin-bottom opacity-90 w-[clamp(120px,14vw,240px)] h-[60vh] flex items-end justify-center z-[1] max-md:hidden">
        <div className="palm-tree origin-bottom [animation:palmSwayLeft_6.5s_ease-in-out_infinite_0.3s] w-full h-full flex items-end justify-center">
          <svg viewBox="0 0 300 500" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg" className="w-full h-full block overflow-visible">
          <path d="M148,500 Q142,470 150,440 Q155,410 145,380 Q138,350 148,320 Q153,290 146,270" fill="none" stroke="url(#trunkGrad)" strokeWidth="14" strokeLinecap="round" />
          <path d="M148,500 Q142,470 150,440 Q155,410 145,380 Q138,350 148,320 Q153,290 146,270" fill="none" stroke="rgba(45,52,24,0.35)" strokeWidth="17" strokeLinecap="round" transform="translate(-2,0)" />
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.1s' }}>
            <path d="M146,270 Q180,245 220,235 Q240,230 258,238 Q228,242 195,255 Q165,262 150,278" fill="url(#leafGrad)" />
            <path d="M146,270 Q190,250 240,242 Q262,238 280,248 Q245,250 208,265 Q175,272 150,282" fill="url(#leafGradLight)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.3s' }}>
            <path d="M146,270 Q112,245 72,235 Q52,230 34,238 Q64,242 97,255 Q127,262 142,278" fill="url(#leafGrad)" />
            <path d="M146,270 Q102,250 52,242 Q30,238 12,248 Q47,250 84,265 Q117,272 142,282" fill="url(#leafGradLight)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.5s' }}>
            <path d="M146,270 Q165,225 182,195 Q190,178 202,182 Q185,195 170,220 Q155,248 148,272" fill="url(#leafGrad)" />
            <path d="M146,270 Q172,215 195,178 Q205,158 218,162 Q198,178 180,212 Q162,242 150,270" fill="url(#leafGradLight)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.7s' }}>
            <path d="M146,270 Q127,225 110,195 Q102,178 90,182 Q107,195 122,220 Q137,248 144,272" fill="url(#leafGrad)" />
            <path d="M146,270 Q120,215 97,178 Q87,158 74,162 Q94,178 112,212 Q130,242 142,270" fill="url(#leafGradLight)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.2s' }}>
            <path d="M146,270 Q190,255 235,252 Q258,250 272,260 Q238,262 200,270 Q168,275 148,280" fill="rgba(45,52,24,0.6)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.4s' }}>
            <path d="M146,270 Q102,255 57,252 Q34,250 20,260 Q54,262 92,270 Q124,275 144,280" fill="rgba(45,52,24,0.6)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.6s' }}>
            <path d="M146,270 Q170,255 205,260 Q225,265 238,275 Q208,270 180,268 Q158,266 148,268" fill="rgba(55,68,30,0.5)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.8s' }}>
            <path d="M146,270 Q122,255 87,260 Q67,265 54,275 Q84,270 112,268 Q134,266 144,268" fill="rgba(55,68,30,0.5)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.15s' }}>
            <path d="M146,270 Q205,230 250,210 Q270,200 282,210 Q255,220 215,240 Q180,258 150,272" fill="rgba(74,90,42,0.4)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.35s' }}>
            <path d="M146,270 Q87,230 42,210 Q22,200 10,210 Q37,220 77,240 Q112,258 142,272" fill="rgba(74,90,42,0.4)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.55s' }}>
            <path d="M146,270 Q185,210 218,182 Q232,165 245,170 Q222,185 195,212 Q170,240 150,268" fill="rgba(65,80,35,0.35)" />
          </g>
          <g className="palm-leaf [transform-origin:150px_130px] animate-leafSway" style={{ animationDelay: '0.75s' }}>
            <path d="M146,270 Q107,210 74,182 Q60,165 47,170 Q70,185 97,212 Q122,240 142,268" fill="rgba(65,80,35,0.35)" />
          </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
