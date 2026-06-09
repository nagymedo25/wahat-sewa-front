import logoImg from '@/images/Logo1.png';
import { useTranslation } from 'react-i18next';

export default function SiteFooter() {
  const { t } = useTranslation();
  return (
    <footer className="relative bg-[#151310]" id="footer">
      <div className="absolute top-0 left-0 right-0 h-[120px] overflow-hidden" aria-hidden="true">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z" fill="#151310" />
        </svg>
      </div>

      <div className="footer-inner relative max-w-[1400px] mx-auto px-12 pt-32 pb-16 max-md:px-6 max-[480px]:px-6 max-[480px]:pt-24 max-[480px]:pb-10">
        <div className="footer-top relative grid grid-cols-[260px_1fr] gap-20 items-start max-md:grid-cols-1 max-md:gap-12 max-md:text-center max-[480px]:grid-cols-1 max-[480px]:gap-8 max-[480px]:text-center">
          <div className="footer-brand relative">
            <div className="relative inline-flex flex-col items-center gap-4 p-6 rounded-3xl border border-[rgba(164,184,107,0.1)] bg-[rgba(26,24,20,0.5)] backdrop-blur-sm [box-shadow:0_8px_32px_rgba(0,0,0,0.3),0_0_0_1px_rgba(164,184,107,0.05),inset_0_1px_0_rgba(255,255,255,0.03)] max-md:mx-auto">
              <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_at_50%_0%,rgba(164,184,107,0.08)_0%,transparent_60%)] pointer-events-none" />
              <img
                src={logoImg}
                alt="واحة سيوة"
                className="relative z-[1] h-[110px] w-auto object-contain [filter:brightness(1.15)_drop-shadow(0_4px_20px_rgba(0,0,0,0.4))] max-md:h-[90px]"
              />
              <p className="relative z-[1] font-ar text-[0.9rem] font-light text-sand opacity-80 leading-relaxed">{t('footer.slogan', 'من قلب الصحراء... إلى قلبك')}</p>
            </div>
          </div>

          <div className="hidden md:block absolute top-8 bottom-8 left-[300px] w-px bg-[linear-gradient(to_bottom,transparent_0%,rgba(164,184,107,0.25)_30%,rgba(164,184,107,0.4)_50%,rgba(164,184,107,0.25)_70%,transparent_100%)] [filter:drop-shadow(0_0_6px_rgba(164,184,107,0.3))]" />

          <div className="footer-links flex gap-20 justify-end max-md:justify-center max-[480px]:flex-col max-[480px]:gap-6 max-[480px]:justify-center">
            <div className="footer-col flex flex-col gap-3 max-[480px]:items-center max-[480px]:gap-2">
              <h4 className="font-ar text-[0.95rem] font-semibold text-cream mb-2">{t('footer.explore', 'استكشف')}</h4>
              <a href="#journey" className="footer-link no-underline font-ar text-[0.85rem] font-light text-sand-light opacity-80 transition-all duration-300 hover:text-cream hover:opacity-100">
                {t('footer.journey', 'رحلة التراث')}
              </a>
              <a href="#products" className="footer-link no-underline font-ar text-[0.85rem] font-light text-sand-light opacity-80 transition-all duration-300 hover:text-cream hover:opacity-100">
                {t('footer.products', 'منتجاتنا')}
              </a>
              <a href="#philosophy" className="footer-link no-underline font-ar text-[0.85rem] font-light text-sand-light opacity-80 transition-all duration-300 hover:text-cream hover:opacity-100">
                {t('footer.philosophy', 'فلسفتنا')}
              </a>
            </div>

            <div className="footer-col flex flex-col gap-3 max-[480px]:items-center max-[480px]:gap-2">
              <h4 className="font-ar text-[0.95rem] font-semibold text-cream mb-2">{t('footer.contact', 'تواصل')}</h4>
              <a href="#" className="footer-link no-underline font-ar text-[0.85rem] font-light text-sand-light opacity-80 transition-all duration-300 hover:text-cream hover:opacity-100">
                {t('footer.wholesale', 'طلبات الجملة')}
              </a>
              <a href="#" className="footer-link no-underline font-ar text-[0.85rem] font-light text-sand-light opacity-80 transition-all duration-300 hover:text-cream hover:opacity-100">
                {t('footer.shipping', 'الشحن والتوصيل')}
              </a>
              <a href="#" className="footer-link no-underline font-ar text-[0.85rem] font-light text-sand-light opacity-80 transition-all duration-300 hover:text-cream hover:opacity-100">
                {t('footer.story', 'قصتنا')}
              </a>
            </div>

            <div className="footer-col flex flex-col gap-3 max-[480px]:items-center max-[480px]:gap-2">
              <h4 className="font-ar text-[0.95rem] font-semibold text-cream mb-2">{t('footer.follow', 'تابعنا')}</h4>
              <div className="footer-social flex items-center gap-3 max-[480px]:justify-center">
                <a
                  href="#"
                  className="footer-social-link w-9 h-9 rounded-full flex items-center justify-center border border-[rgba(212,197,169,0.12)] bg-[rgba(26,24,20,0.3)] text-sand-light transition-all duration-500 hover:text-cream hover:border-[rgba(164,184,107,0.5)] hover:shadow-[0_0_16px_rgba(164,184,107,0.2)] hover:-translate-y-[2px]"
                  aria-label="Instagram"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="footer-social-link w-9 h-9 rounded-full flex items-center justify-center border border-[rgba(212,197,169,0.12)] bg-[rgba(26,24,20,0.3)] text-sand-light transition-all duration-500 hover:text-cream hover:border-[rgba(164,184,107,0.5)] hover:shadow-[0_0_16px_rgba(164,184,107,0.2)] hover:-translate-y-[2px]"
                  aria-label="Facebook"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="footer-social-link w-9 h-9 rounded-full flex items-center justify-center border border-[rgba(212,197,169,0.12)] bg-[rgba(26,24,20,0.3)] text-sand-light transition-all duration-500 hover:text-cream hover:border-[rgba(164,184,107,0.5)] hover:shadow-[0_0_16px_rgba(164,184,107,0.2)] hover:-translate-y-[2px]"
                  aria-label="WhatsApp"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom mt-16 pt-10 border-t border-[rgba(212,197,169,0.06)]">
          <p className="footer-quote text-center font-['Aref_Ruqaa',var(--font-ar),serif] text-[1.1rem] font-normal text-sand opacity-70 mb-10 max-[480px]:text-[0.95rem] max-[480px]:mb-7 leading-[1.8]">
            {t('footer.quote', '"كل شيء ينمو من الأرض، يحمل روحها في طياته"')}
          </p>
          <div className="footer-bar flex items-center justify-between text-[0.8rem] font-light text-sand opacity-60 max-[480px]:flex-col max-[480px]:gap-2 max-[480px]:text-center">
            <span className="footer-copy">{t('footer.copyright', 'واحة سيوة © 2025')}</span>
            <span className="footer-craft">{t('footer.made_by', 'صُنع بأيدٍ سيوية')}</span>
          </div>
        </div>
      </div>

      {/* Desert Dunes Landscape */}
      <div className="absolute bottom-0 left-0 right-0 h-[200px] overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Stars */}
        <div className="absolute top-4 left-[10%] w-[2px] h-[2px] rounded-full bg-cream opacity-60 animate-pulse" />
        <div className="absolute top-8 left-[25%] w-[1.5px] h-[1.5px] rounded-full bg-cream opacity-40 animate-pulse [animation-delay:0.5s]" />
        <div className="absolute top-3 left-[45%] w-[2px] h-[2px] rounded-full bg-cream opacity-50 animate-pulse [animation-delay:1.2s]" />
        <div className="absolute top-10 left-[60%] w-[1px] h-[1px] rounded-full bg-cream opacity-70 animate-pulse [animation-delay:0.8s]" />
        <div className="absolute top-5 left-[75%] w-[2px] h-[2px] rounded-full bg-cream opacity-40 animate-pulse [animation-delay:1.5s]" />
        <div className="absolute top-12 left-[88%] w-[1.5px] h-[1.5px] rounded-full bg-cream opacity-50 animate-pulse [animation-delay:0.3s]" />
        <div className="absolute top-6 left-[15%] w-[1px] h-[1px] rounded-full bg-cream opacity-60 animate-pulse [animation-delay:2s]" />
        <div className="absolute top-2 left-[35%] w-[1.5px] h-[1.5px] rounded-full bg-cream opacity-30 animate-pulse [animation-delay:1.8s]" />
        <div className="absolute top-9 left-[52%] w-[1px] h-[1px] rounded-full bg-cream opacity-50 animate-pulse [animation-delay:0.6s]" />
        <div className="absolute top-4 left-[70%] w-[2px] h-[2px] rounded-full bg-cream opacity-40 animate-pulse [animation-delay:2.2s]" />

        {/* Crescent Moon */}
        <div className="absolute top-6 right-[15%] opacity-30 max-md:top-4 max-md:right-[10%]">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M28,4 C20,4 14,11.5 14,20 C14,28.5 20,36 28,36 C24,33 22,27 22,20 C22,13 24,7 28,4Z" fill="rgba(232,216,180,0.6)" filter="drop-shadow(0 0 8px rgba(232,216,180,0.4))" />
          </svg>
        </div>

        {/* Flying birds */}
        <div className="absolute top-10 left-[20%] opacity-25 max-md:opacity-15">
          <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
            <path d="M0,6 Q6,0 12,6 Q18,0 24,6 Q18,3 12,6 Q6,3 0,6Z" fill="rgba(26,24,20,0.6)" />
          </svg>
        </div>
        <div className="absolute top-6 left-[28%] opacity-20 max-md:opacity-10">
          <svg width="18" height="9" viewBox="0 0 24 12" fill="none">
            <path d="M0,6 Q6,0 12,6 Q18,0 24,6 Q18,3 12,6 Q6,3 0,6Z" fill="rgba(26,24,20,0.5)" />
          </svg>
        </div>
        <div className="absolute top-14 left-[65%] opacity-15 max-md:opacity-10">
          <svg width="16" height="8" viewBox="0 0 24 12" fill="none">
            <path d="M0,6 Q6,0 12,6 Q18,0 24,6 Q18,3 12,6 Q6,3 0,6Z" fill="rgba(26,24,20,0.5)" />
          </svg>
        </div>

        {/* Dune layers */}
        <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
          {/* Far dune - darkest */}
          <path
            d="M0,120 C120,100 240,140 360,110 C480,80 600,130 720,100 C840,70 960,120 1080,90 C1200,60 1320,110 1440,80 L1440,200 L0,200 Z"
            fill="rgba(26,24,20,0.95)"
          />
          {/* Mid dune */}
          <path
            d="M0,140 C160,110 320,160 480,125 C640,90 800,145 960,115 C1120,85 1280,135 1440,105 L1440,200 L0,200 Z"
            fill="rgba(45,52,24,0.85)"
          />
          {/* Near dune - with gradient */}
          <path
            d="M0,160 C200,130 400,170 600,140 C800,110 1000,160 1200,130 C1320,115 1380,145 1440,135 L1440,200 L0,200 Z"
            fill="rgba(74,90,42,0.7)"
          />
          {/* Front dune - lightest */}
          <path
            d="M0,175 C180,155 360,185 540,165 C720,145 900,180 1080,160 C1260,140 1350,170 1440,165 L1440,200 L0,200 Z"
            fill="rgba(90,80,42,0.5)"
          />
        </svg>

        {/* Small palm silhouette on right */}
        <div className="absolute bottom-[20px] right-[8%] opacity-20 max-md:right-[4%] max-md:opacity-15">
          <svg width="60" height="100" viewBox="0 0 60 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30,100 Q32,85 30,70 Q28,55 31,40 Q33,25 30,10" stroke="rgba(26,24,20,0.8)" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M30,35 Q20,25 10,20 Q5,18 2,22 Q10,24 18,30 Q25,34 28,38" fill="rgba(26,24,20,0.7)" />
            <path d="M30,35 Q40,25 50,20 Q55,18 58,22 Q50,24 42,30 Q35,34 32,38" fill="rgba(26,24,20,0.7)" />
            <path d="M30,30 Q22,18 16,8 Q14,4 12,6 Q16,10 22,20 Q26,26 29,32" fill="rgba(26,24,20,0.6)" />
            <path d="M30,30 Q38,18 44,8 Q46,4 48,6 Q44,10 38,20 Q34,26 31,32" fill="rgba(26,24,20,0.6)" />
            <path d="M30,25 Q25,12 22,2 Q21,0 20,1 Q22,6 26,16 Q28,22 29,26" fill="rgba(26,24,20,0.5)" />
            <path d="M30,25 Q35,12 38,2 Q39,0 40,1 Q38,6 34,16 Q32,22 31,26" fill="rgba(26,24,20,0.5)" />
          </svg>
        </div>

        {/* Small palm silhouette on left */}
        <div className="absolute bottom-[15px] left-[5%] opacity-15 max-md:left-[2%] max-md:opacity-10">
          <svg width="45" height="75" viewBox="0 0 60 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30,100 Q32,85 30,70 Q28,55 31,40 Q33,25 30,10" stroke="rgba(26,24,20,0.8)" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M30,35 Q20,25 10,20 Q5,18 2,22 Q10,24 18,30 Q25,34 28,38" fill="rgba(26,24,20,0.7)" />
            <path d="M30,35 Q40,25 50,20 Q55,18 58,22 Q50,24 42,30 Q35,34 32,38" fill="rgba(26,24,20,0.7)" />
            <path d="M30,30 Q22,18 16,8 Q14,4 12,6 Q16,10 22,20 Q26,26 29,32" fill="rgba(26,24,20,0.6)" />
            <path d="M30,30 Q38,18 44,8 Q46,4 48,6 Q44,10 38,20 Q34,26 31,32" fill="rgba(26,24,20,0.6)" />
            <path d="M30,25 Q25,12 22,2 Q21,0 20,1 Q22,6 26,16 Q28,22 29,26" fill="rgba(26,24,20,0.5)" />
            <path d="M30,25 Q35,12 38,2 Q39,0 40,1 Q38,6 34,16 Q32,22 31,26" fill="rgba(26,24,20,0.5)" />
          </svg>
        </div>
      </div>
    </footer>
  );
}
