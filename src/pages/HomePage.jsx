import { useEffect, useState, useRef } from 'react';
import AnnouncementBar from '@/components/Nav/AnnouncementBar.jsx';
import MainNav from '@/components/Nav/MainNav.jsx';
import HeroSection from '@/sections/HeroSection.jsx';
import CategoryDiscovery from '@/sections/CategoryDiscovery.jsx';
import FeaturedProducts from '@/sections/FeaturedProducts.jsx';
import BestDeals from '@/sections/BestDeals.jsx';
import PromoBanner from '@/components/Products/PromoBanner.jsx';
import BrandStorySection from '@/sections/BrandStorySection.jsx';
import DiscountDrawer from '@/components/Products/DiscountDrawer.jsx';
import SiteFooter from '@/components/Footer/SiteFooter.jsx';
import { loadCatalog } from '@/services/catalog.js';
import { publicApi } from '@/services/api.js';

export default function HomePage() {
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavScrolled, setIsNavScrolled] = useState(false);
  const [isNavHidden, setIsNavHidden] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const lastScrollY = useRef(0);

  // Load catalog and banners data
  useEffect(() => {
    async function fetchHomeData() {
      try {
        const [catalogData, bannersRes] = await Promise.allSettled([
          loadCatalog(),
          publicApi.get('/banners'),
        ]);

        if (catalogData.status === 'fulfilled' && catalogData.value) {
          setProducts(catalogData.value.products || []);
          setCategories(catalogData.value.categories || []);
        }

        if (bannersRes.status === 'fulfilled' && Array.isArray(bannersRes.value?.data?.banners)) {
          setBanners(bannersRes.value.data.banners);
        }
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      }
    }

    fetchHomeData();
    setIsNavVisible(true);
  }, []);

  // Handle navbar sticky & hide-on-scroll logic smoothly
  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setIsNavScrolled(currentY > 60);

      if (currentY > lastScrollY.current && currentY > 200) {
        setIsNavHidden(true);
      } else if (currentY < lastScrollY.current) {
        setIsNavHidden(false);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll Reveal Observer: Fades in/out each section smoothly as it enters and leaves viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          } else {
            entry.target.classList.remove('is-visible');
          }
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: '-20px 0px -20px 0px',
      }
    );

    const revealElements = document.querySelectorAll('.reveal-section');
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [products, categories, banners]);

  const midBanner = banners.find((b) => b.position === 'mid') || null;
  const bottomBanner = banners.find((b) => b.position === 'bottom') || null;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-400 selection:bg-[var(--palm-shade)]/20 selection:text-[var(--text-primary)]">
      {/* ── Top Permanent Announcement Ticker ── */}
      <AnnouncementBar />

      {/* ── Floating Capsule Navbar ── */}
      <MainNav
        isVisible={isNavVisible}
        isScrolled={isNavScrolled}
        isNavHidden={isNavHidden}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen((v) => !v)}
      />

      {/* ── Main Shopping Journey Flow with Scroll Reveal Animations ── */}
      <main className="flex-1 relative">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Category Discovery */}
        <div className="reveal-section">
          <CategoryDiscovery categories={categories} />
        </div>

        {/* 3. Featured Products */}
        <div className="reveal-section">
          <FeaturedProducts products={products} />
        </div>

        {/* 4. Strategic Promo Banner (Mid) */}
        <div className="reveal-section">
          <PromoBanner banner={midBanner} position="mid" />
        </div>

        {/* 5. Best Deals Section */}
        <div className="reveal-section">
          <BestDeals products={products} />
        </div>

        {/* 6. Strategic Promo Banner (Bottom) */}
        <div className="reveal-section">
          <PromoBanner banner={bottomBanner} position="bottom" />
        </div>

        {/* 7. Brand Story & Heritage */}
        <div className="reveal-section">
          <BrandStorySection />
        </div>
      </main>

      {/* ── Side Discount Discovery Drawer ── */}
      <DiscountDrawer />

      {/* ── Footer ── */}
      <SiteFooter />
    </div>
  );
}
