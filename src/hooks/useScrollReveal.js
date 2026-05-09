import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';

export default function useScrollReveal(config = {}) {
  const ref = useRef(null);
  const hasPlayedRef = useRef(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      selector,
      stagger = 0.15,
      duration = 0.8,
      y = 40,
      ease = 'power2.out',
    } = config;

    const targets = selector ? Array.from(el.querySelectorAll(selector)) : [el];
    if (!targets.length) return;

    let tl;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasPlayedRef.current) {
            // Skip if element is already fully visible (avoids re-hide in StrictMode)
            const first = targets[0];
            if (window.getComputedStyle(first).opacity >= '0.95') {
              hasPlayedRef.current = true;
              return;
            }

            hasPlayedRef.current = true;
            tl = gsap.fromTo(
              targets,
              { opacity: 0, y },
              {
                opacity: 1,
                y: 0,
                duration,
                stagger,
                ease,
                onComplete: () => {
                  // Remove inline styles so they don't conflict on re-render
                  targets.forEach((t) => {
                    t.style.opacity = '';
                    t.style.transform = '';
                  });
                },
              }
            );
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (tl) tl.kill();
    };
  }, []);

  return ref;
}
