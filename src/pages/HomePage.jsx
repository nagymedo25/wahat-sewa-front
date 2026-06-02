import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MainNav from '@/components/Nav/MainNav.jsx';
import SidePalmTrees from '@/components/Atmosphere/SidePalmTrees.jsx';
import HeroSection from '@/sections/HeroSection.jsx';
import JourneySection from '@/sections/JourneySection.jsx';
import ProductsSection from '@/sections/ProductsSection.jsx';
import PhilosophySection from '@/sections/PhilosophySection.jsx';
import ContactSection from '@/sections/ContactSection.jsx';
import SiteFooter from '@/components/Footer/SiteFooter.jsx';
import { loadCatalog } from '@/services/catalog.js';

export default function HomePage() {
  const rootRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavScrolled, setIsNavScrolled] = useState(false);
  const [isNavHidden, setIsNavHidden] = useState(false);
  const [isLiteMode, setIsLiteMode] = useState(false);
  const [dynamicProducts, setDynamicProducts] = useState([]);
  const lastScrollY = useRef(0);

  const fallbackProducts = useMemo(
    () => [
      {
        id: 'c49bac0c-764f-4d2d-b716-bf025922c2de',
        category: 'التمور السيوية',
        name: 'تمور لّاب (كيلو)',
        desc: 'تمور لّاب مختارة بعناية وزن 1 كيلو، حلاوة طبيعية وفوائد غذائية عالية.',
        weight: '1 كجم',
        price: 'ج.م 245',
        image: 'https://res.cloudinary.com/ddapmhhic/image/upload/v1778438227/4_mgejnp.png',
        Icon: DatesIcon,
      },
      {
        id: 'a7dc95fd-7c63-4989-abb4-caa8bf59af7c',
        category: 'التمور السيوية',
        name: 'علبة تمور لوز / كاجو',
        desc: 'تمور فاخرة محشوة باللوز والكاجو الطازج.',
        weight: 'علبة فاخرة',
        price: 'ج.م 150',
        image: 'https://res.cloudinary.com/ddapmhhic/image/upload/v1778438321/20_tfoow0.png',
        Icon: DatesIcon,
      },
      {
        id: 'b9829fc5-45f8-4f89-9a15-fcb47e3e463a',
        category: 'التمور السيوية',
        name: 'معمول سيوة',
        desc: 'معمول سيوة اللذيذ المصنوع بالتمر السيوى الطبيعى.',
        weight: 'علبة معمول',
        price: 'ج.م 115',
        image: 'https://res.cloudinary.com/ddapmhhic/image/upload/v1778438238/6_if2nu0.png',
        Icon: DatesIcon,
      },
      {
        id: '0ee70894-8c58-4c26-83ce-6e6d063ddc45',
        category: 'الزيوت السيوية',
        name: 'زجاجة زيت زيتون (لتر)',
        desc: 'زيت زيتون سيوي أصلي سعة 1 لتر، للحفاظ على الصحة والمناعة.',
        weight: '1 لتر',
        price: 'ج.م 520',
        image: 'https://res.cloudinary.com/ddapmhhic/image/upload/v1778438257/12_kulhxk.png',
        Icon: OliveIcon,
      },
      {
        id: 'ec15e720-d283-4947-a6cc-4f3b17dad70d',
        category: 'العناية والتجميل',
        name: 'زيتون تفاحي (برطمان)',
        desc: 'زيتون تفاحي سيوى مخلل بطرق تقليدية طبيعية.',
        weight: 'برطمان مخلل',
        price: 'ج.م 120',
        image: 'https://res.cloudinary.com/ddapmhhic/image/upload/v1778438253/10_xdjdqg.png',
        Icon: OliveIcon,
      },
      {
        id: '942d5111-279c-4b2c-9968-6ff20d92480d',
        category: 'الزيوت السيوية',
        name: 'زجاجة زيت زيتون (1/2 لتر)',
        desc: 'زجاجة نصف لتر زيت زيتون سيوي عصرة أولى.',
        weight: '500 مل',
        price: 'ج.م 290',
        image: 'https://res.cloudinary.com/ddapmhhic/image/upload/v1778438257/12_kulhxk.png',
        Icon: OliveIcon,
      },
    ],
    []
  );

  useEffect(() => {
    async function fetchProducts() {
      const catalog = await loadCatalog();
      if (catalog.products && catalog.products.length > 0) {
        // Filter only products marked as 'most_requested'
        const featured = catalog.products.filter(p => p.rawBadge === 'most_requested');
        setDynamicProducts(featured);
      }
    }
    fetchProducts();
  }, []);

  const products = dynamicProducts.length > 0 ? dynamicProducts : fallbackProducts;



  useEffect(() => {
    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      const saveData = typeof navigator !== 'undefined' && navigator.connection ? navigator.connection.saveData : false;
      const isDesktop = typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : false;
      setIsLiteMode(Boolean(!isDesktop && (mqReduced.matches || saveData)));
    };
    update();
    mqReduced.addEventListener?.('change', update);
    return () => {
      mqReduced.removeEventListener?.('change', update);
    };
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    setIsNavVisible(true);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setIsNavScrolled(currentY > 100);

      if (currentY > lastScrollY.current && currentY > 150) {
        setIsNavHidden(true);
      } else if (currentY < lastScrollY.current) {
        setIsNavHidden(false);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let rafId = 0;

    if (isLiteMode) return;

    const updateParallax = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const centerX = width / 2;
      const centerY = height / 2;
      const moveX = (mouseX - centerX) / centerX;
      const moveY = (mouseY - centerY) / centerY;

      const parallaxElements = document.querySelectorAll('[data-parallax]');
      parallaxElements.forEach((el) => {
        const factor = parseFloat(el.dataset.parallax) || 0.5;
        const translateX = moveX * factor * -20;
        const translateY = moveY * factor * -15;
        el.style.transform = `translate(${translateX}px, ${translateY}px)`;
      });

      rafId = 0;
    };

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!rafId) {
        rafId = window.requestAnimationFrame(updateParallax);
      }
    };

    document.addEventListener('mousemove', onMouseMove, { passive: true });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [isLiteMode]);

  useEffect(() => {
    if (isLiteMode) return;
    const intervalId = window.setInterval(() => {
      const orbs = document.querySelectorAll('.product-orb');
      const randomOrb = orbs[Math.floor(Math.random() * orbs.length)];
      if (randomOrb) {
        randomOrb.style.animationDuration = `${3 + Math.random() * 2}s`;
      }
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [isLiteMode]);

  useEffect(() => {
    const onAnchorClick = (e) => {
      const target = e.target instanceof Element ? e.target.closest('a[href^="#"]') : null;
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      const section = document.querySelector(href);
      if (!section) return;

      e.preventDefault();

      const offset = section.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });

      setIsMobileMenuOpen(false);
    };

    document.addEventListener('click', onAnchorClick);
    return () => document.removeEventListener('click', onAnchorClick);
  }, []);

  useLayoutEffect(() => {
    if (isLiteMode) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const heroBg = document.querySelector('.hero-bg');
      const heroContent = document.querySelector('.hero-content');

      if (heroBg) {
        gsap.to(heroBg, {
          yPercent: 30,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      if (heroContent) {
        gsap.to(heroContent, {
          yPercent: -20,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: '50% top',
            scrub: true,
          },
        });
      }

      const journeyHeader = document.querySelector('.journey-header');
      if (journeyHeader) {
        gsap.from(journeyHeader, {
          y: 60,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: journeyHeader,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      const timelineItems = document.querySelectorAll('.timeline-item');
      timelineItems.forEach((item, i) => {
        const direction = i % 2 === 0 ? 50 : -50;
        gsap.from(item, {
          x: direction,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      });

      const timelineLine = document.querySelector('.timeline-line');
      if (timelineLine) {
        gsap.from(timelineLine, {
          scaleY: 0,
          transformOrigin: 'top center',
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.journey-timeline',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      const productsHeader = document.querySelector('.products-header');
      if (productsHeader) {
        gsap.from(productsHeader, {
          y: 60,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: productsHeader,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      const productCards = document.querySelectorAll('.product-card');
      gsap.from(productCards, {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.products-gallery',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      const philosophyContent = document.querySelector('.philosophy-content');
      if (philosophyContent) {
        gsap.from(philosophyContent.children, {
          y: 50,
          opacity: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.philosophy',
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      const philosophyVisual = document.querySelector('.philosophy-visual');
      if (philosophyVisual) {
        gsap.from(philosophyVisual, {
          scale: 0.8,
          opacity: 0,
          rotation: -10,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.philosophy',
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      const contactContent = document.querySelector('.contact-content');
      if (contactContent) {
        gsap.from(contactContent.children, {
          y: 40,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.contact',
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      const dunesFar = document.querySelector('.hero-dunes-far');
      const dunesMid = document.querySelector('.hero-dunes-mid');
      const dunesNear = document.querySelector('.hero-dunes-near');

      if (dunesFar) {
        gsap.to(dunesFar, {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      if (dunesMid) {
        gsap.to(dunesMid, {
          yPercent: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      if (dunesNear) {
        gsap.to(dunesNear, {
          yPercent: -30,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, [isLiteMode]);

  return (
    <div ref={rootRef}>
      <MainNav
        isVisible={isNavVisible}
        isScrolled={isNavScrolled}
        isNavHidden={isNavHidden}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen((v) => !v)}
      />

      <SidePalmTrees isLoaded={isLoaded} />

      <main className="relative">
        <HeroSection isLoaded={isLoaded} isLiteMode={isLiteMode} />
        <div className="relative h-[60px] mt-[-60px] bg-[linear-gradient(to_bottom,transparent_0%,var(--shadow)_60%,var(--shadow)_100%)] z-[4] pointer-events-none max-md:h-[40px] max-md:mt-[-40px] max-[480px]:h-[30px] max-[480px]:mt-[-30px]" />
        <JourneySection />
        <ProductsSection products={products} />
        <PhilosophySection />
        <ContactSection />
      </main>


      <SiteFooter />
    </div>
  );
}

function OliveIcon() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="55" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <path d="M60 20 C60 20 85 45 85 70 C85 90 70 100 60 100 C50 100 35 90 35 70 C35 45 60 20 60 20Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M60 35 L60 85" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      <path d="M45 50 Q60 45 75 50" stroke="currentColor" strokeWidth="0.5" opacity="0.4" fill="none" />
      <path d="M42 65 Q60 60 78 65" stroke="currentColor" strokeWidth="0.5" opacity="0.4" fill="none" />
      <path d="M45 80 Q60 75 75 80" stroke="currentColor" strokeWidth="0.5" opacity="0.4" fill="none" />
    </svg>
  );
}

function DatesIcon() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="55" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <path d="M60 25 Q65 25 68 30 L72 50 Q75 65 70 80 Q65 95 60 95 Q55 95 50 80 Q45 65 48 50 L52 30 Q55 25 60 25Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M60 25 L60 15" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <ellipse cx="60" cy="55" rx="8" ry="12" stroke="currentColor" strokeWidth="0.5" opacity="0.3" fill="none" />
    </svg>
  );
}

function HerbsIcon() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="55" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <path d="M60 100 L60 60" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      <path d="M60 60 Q45 40 30 35" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M60 60 Q75 40 90 35" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M60 55 Q50 30 55 15" stroke="currentColor" strokeWidth="1" fill="none" />
      <ellipse cx="30" cy="35" rx="6" ry="10" stroke="currentColor" strokeWidth="0.5" fill="none" transform="rotate(-30 30 35)" />
      <ellipse cx="90" cy="35" rx="6" ry="10" stroke="currentColor" strokeWidth="0.5" fill="none" transform="rotate(30 90 35)" />
      <ellipse cx="55" cy="15" rx="5" ry="8" stroke="currentColor" strokeWidth="0.5" fill="none" transform="rotate(-10 55 15)" />
    </svg>
  );
}

function SoapIcon() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="55" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <rect x="35" y="40" width="50" height="40" rx="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M35 52 H85" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <circle cx="50" cy="60" r="5" stroke="currentColor" strokeWidth="0.5" fill="none" />
      <circle cx="70" cy="60" r="5" stroke="currentColor" strokeWidth="0.5" fill="none" />
      <path d="M55 65 Q60 72 65 65" stroke="currentColor" strokeWidth="0.5" fill="none" />
      <path d="M40 80 Q45 75 50 80 Q55 75 60 80 Q65 75 70 80 Q75 75 80 80" stroke="currentColor" strokeWidth="0.5" fill="none" />
    </svg>
  );
}

function OrganicIcon() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="55" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <path d="M60 25 C40 25 25 40 25 60 C25 80 40 95 60 95 C80 95 95 80 95 60 C95 40 80 25 60 25Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M60 40 L60 70" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path d="M50 50 L60 40 L70 50" stroke="currentColor" strokeWidth="0.5" fill="none" />
      <path d="M50 70 L60 80 L70 70" stroke="currentColor" strokeWidth="0.5" fill="none" />
      <path d="M40 60 Q60 55 80 60" stroke="currentColor" strokeWidth="0.3" opacity="0.4" fill="none" />
    </svg>
  );
}
