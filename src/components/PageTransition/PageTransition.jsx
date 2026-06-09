import { useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const COLUMN_COUNT = 12;

// Stagger wave: center-out for cover, edge-in for reveal
const getCoverDelay  = (i) => Math.abs(i - (COLUMN_COUNT - 1) / 2) * 30;
const getRevealDelay = (i) => (COLUMN_COUNT / 2 - 1 - Math.abs(i - (COLUMN_COUNT - 1) / 2)) * 30;

// Alternating origin: even cols from TOP, odd cols from BOTTOM — MUST use translateY()
const colOrigin = (i) => (i % 2 === 0 ? 'translateY(-100%)' : 'translateY(100%)');

export default function PageTransition() {
  const location = useLocation();
  const navigate  = useNavigate();
  const containerRef   = useRef(null);
  const isAnimating    = useRef(false);
  const pendingResolve = useRef(null);

  const cols = () => Array.from(
    containerRef.current?.querySelectorAll('.pt-col') ?? []
  );

  /* ── COVER: columns slam in from alternating top/bottom ── */
  const coverScreen = useCallback(() => new Promise((resolve) => {
    const columns = cols();
    const maxDelay = getCoverDelay(0); // outermost column has the biggest delay

    columns.forEach((col, i) => {
      col.style.transition = 'none';
      col.style.transform  = colOrigin(i);          // reset to off-screen
      col.getBoundingClientRect();                   // force reflow
      col.style.transition = `transform 0.44s cubic-bezier(0.55, 0, 0.1, 1) ${getCoverDelay(i)}ms`;
      col.style.transform  = 'translateY(0%)';      // slam into view
    });

    setTimeout(resolve, 440 + maxDelay + 40);
  }), []);

  /* ── REVEAL: columns retract back to their origin ── */
  const revealScreen = useCallback(() => new Promise((resolve) => {
    const columns = cols();
    const maxDelay = getRevealDelay(0); // edge columns have biggest reveal delay

    columns.forEach((col, i) => {
      col.style.transition = `transform 0.38s cubic-bezier(0.9, 0, 0.55, 1) ${getRevealDelay(i)}ms`;
      col.style.transform  = colOrigin(i);          // retract back
    });

    setTimeout(resolve, 380 + maxDelay + 40);
  }), []);

  /* ── INTERCEPT all internal <a> clicks in capture phase ── */
  useEffect(() => {
    const handleClick = async (e) => {
      const anchor = e.target.closest('a[href]');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      // Skip external, hash, mailto, tel links
      if (
        !href ||
        href.startsWith('http') ||
        href.startsWith('//') ||
        href.startsWith('mailto') ||
        href.startsWith('tel') ||
        href.startsWith('#')
      ) return;

      const targetPath = (href.split('?')[0]).replace(/\/$/, '') || '/';
      const currentPath = window.location.pathname.replace(/\/$/, '') || '/';

      // Same page — don't transition
      if (targetPath === currentPath) return;

      // Block during ongoing animation
      if (isAnimating.current) { e.preventDefault(); e.stopPropagation(); return; }

      e.preventDefault();
      e.stopPropagation();
      isAnimating.current = true;

      // Enable pointer-events so columns are visible
      if (containerRef.current) containerRef.current.style.pointerEvents = 'all';

      // Play cover → then navigate
      await coverScreen();
      navigate(href);
    };

    const handleCustomEvent = async (e) => {
      const { action } = e.detail || {};
      if (isAnimating.current) return;

      isAnimating.current = true;
      if (containerRef.current) containerRef.current.style.pointerEvents = 'all';

      await coverScreen();
      
      if (action) {
        await action();
        // Give React a frame to re-render
        await new Promise(r => requestAnimationFrame(r));
      }

      await revealScreen();
      
      if (containerRef.current) containerRef.current.style.pointerEvents = 'none';
      isAnimating.current = false;
    };

    document.addEventListener('click', handleClick, true); // capture phase
    document.addEventListener('trigger-page-transition', handleCustomEvent);
    
    return () => {
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('trigger-page-transition', handleCustomEvent);
    };
  }, [navigate, coverScreen, revealScreen]);

  /* ── After route change → play REVEAL ── */
  useEffect(() => {
    // Don't play on initial mount
    if (!isAnimating.current) return;

    revealScreen().then(() => {
      if (containerRef.current) containerRef.current.style.pointerEvents = 'none';
      isAnimating.current = false;
    });
  }, [location.pathname, revealScreen]);

  /* ── Column colors: slight tonal variation per column ── */
  const bgColors = [
    '#0d0c09','#0f0e0b','#11100c','#100f0c',
    '#0e0d0a','#0f0e0b','#11100c','#0d0c09',
    '#100f0c','#0e0d0a','#0f0e0b','#0d0c09',
  ];
  const glowColors = [
    'rgba(74,90,42,0.22)','rgba(90,110,48,0.14)','rgba(74,90,42,0.18)',
    'rgba(60,75,35,0.20)','rgba(100,120,55,0.12)','rgba(74,90,42,0.24)',
    'rgba(74,90,42,0.24)','rgba(100,120,55,0.12)','rgba(60,75,35,0.20)',
    'rgba(74,90,42,0.18)','rgba(90,110,48,0.14)','rgba(74,90,42,0.22)',
  ];

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
      }}
    >
      {Array.from({ length: COLUMN_COUNT }).map((_, i) => {
        const fromBottom = i % 2 !== 0;
        return (
          <div
            key={i}
            className="pt-col"
            style={{
              flex: 1,
              height: '100%',
              transform: colOrigin(i),  // starts off-screen
              willChange: 'transform',
              position: 'relative',
              overflow: 'hidden',
              background: bgColors[i],
              borderLeft: i > 0
                ? '1px solid rgba(164,184,107,0.05)'
                : 'none',
            }}
          >
            {/* Top/bottom olive gradient based on origin */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: fromBottom
                ? `linear-gradient(0deg, ${glowColors[i]} 0%, transparent 55%)`
                : `linear-gradient(180deg, ${glowColors[i]} 0%, transparent 55%)`,
            }} />

            {/* Edge light — simulates a broken glass ridge */}
            {fromBottom ? (
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                background: 'linear-gradient(90deg, transparent, rgba(164,184,107,0.55), rgba(212,197,169,0.35), transparent)',
                boxShadow: '0 0 14px rgba(164,184,107,0.28)',
              }} />
            ) : (
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
                background: 'linear-gradient(90deg, transparent, rgba(164,184,107,0.55), rgba(212,197,169,0.35), transparent)',
                boxShadow: '0 0 14px rgba(164,184,107,0.28)',
              }} />
            )}
          </div>
        );
      })}

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .pt-col { transition: none !important; transform: none !important; }
        }
      `}</style>
    </div>
  );
}
