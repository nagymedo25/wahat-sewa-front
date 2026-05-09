import useScrollReveal from '../hooks/useScrollReveal';

export default function ContactSection() {
  const sectionRef = useScrollReveal({ selector: '.contact-brand, .contact-links, .contact-social, .contact-credit', stagger: 0.2, y: 40 });

  return (
    <section ref={sectionRef} className="section contact relative min-h-[80vh] flex items-center overflow-hidden" id="contact">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--shadow)_0%,rgba(74,90,42,0.15)_40%,var(--shadow)_100%)]" />
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(232,168,124,0.06)_0%,transparent_70%)]" />
      </div>

      <div className="section-inner w-full max-w-[1400px] mx-auto px-12 relative z-[5] max-md:px-6">
        <div className="contact-content max-w-[700px] mx-auto text-center py-32">
          <div className="contact-brand mb-16 relative">
            <div className="inline-flex items-center justify-center w-[72px] h-[72px] rounded-full border border-[rgba(164,184,107,0.15)] bg-[rgba(26,24,20,0.5)] backdrop-blur-sm mb-6 relative mx-auto">
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(164,184,107,0.12)_0%,transparent_70%)]" />
              <span className="text-[2rem] text-olive-glow relative z-[1]">☰</span>
            </div>
            <h2 className="font-ar text-[clamp(2.2rem,5vw,4.2rem)] font-extralight text-cream leading-[1.15] mb-4">واحة سيوة</h2>
            <p className="font-ar text-[1rem] font-light text-sand opacity-90">من قلب الصحراء إلى قلبك</p>
          </div>

          <div className="contact-links flex flex-col gap-4 items-center mb-16">
            <a href="#" className="group relative w-[260px] max-w-full inline-flex items-center gap-4 px-6 py-4 rounded-2xl border border-[rgba(212,197,169,0.1)] bg-[rgba(26,24,20,0.4)] backdrop-blur-md text-sand-light font-ar text-[0.95rem] font-medium transition-all duration-500 hover:border-[rgba(164,184,107,0.5)] hover:bg-[rgba(164,184,107,0.08)] hover:text-cream hover:-translate-y-[3px] hover:shadow-[0_12px_40px_rgba(164,184,107,0.2),0_0_0_1px_rgba(164,184,107,0.1)] overflow-hidden max-[480px]:w-full max-[480px]:justify-center">
              <span className="absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,rgba(164,184,107,0.15)_50%,transparent_60%)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
              <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_center,rgba(164,184,107,0.1)_0%,transparent_70%)]" />
              <span className="relative z-[1] text-olive-glow transition-colors duration-300 group-hover:text-cream">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </span>
              <span className="relative z-[1]">طلبات الجملة</span>
            </a>
            <a href="#" className="group relative w-[260px] max-w-full inline-flex items-center gap-4 px-6 py-4 rounded-2xl border border-[rgba(212,197,169,0.1)] bg-[rgba(26,24,20,0.4)] backdrop-blur-md text-sand-light font-ar text-[0.95rem] font-medium transition-all duration-500 hover:border-[rgba(164,184,107,0.5)] hover:bg-[rgba(164,184,107,0.08)] hover:text-cream hover:-translate-y-[3px] hover:shadow-[0_12px_40px_rgba(164,184,107,0.2),0_0_0_1px_rgba(164,184,107,0.1)] overflow-hidden max-[480px]:w-full max-[480px]:justify-center">
              <span className="absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,rgba(164,184,107,0.15)_50%,transparent_60%)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
              <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_center,rgba(164,184,107,0.1)_0%,transparent_70%)]" />
              <span className="relative z-[1] text-olive-glow transition-colors duration-300 group-hover:text-cream">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </span>
              <span className="relative z-[1]">الشحن والتوصيل</span>
            </a>
            <a href="#" className="group relative w-[260px] max-w-full inline-flex items-center gap-4 px-6 py-4 rounded-2xl border border-[rgba(212,197,169,0.1)] bg-[rgba(26,24,20,0.4)] backdrop-blur-md text-sand-light font-ar text-[0.95rem] font-medium transition-all duration-500 hover:border-[rgba(164,184,107,0.5)] hover:bg-[rgba(164,184,107,0.08)] hover:text-cream hover:-translate-y-[3px] hover:shadow-[0_12px_40px_rgba(164,184,107,0.2),0_0_0_1px_rgba(164,184,107,0.1)] overflow-hidden max-[480px]:w-full max-[480px]:justify-center">
              <span className="absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,rgba(164,184,107,0.15)_50%,transparent_60%)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
              <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_center,rgba(164,184,107,0.1)_0%,transparent_70%)]" />
              <span className="relative z-[1] text-olive-glow transition-colors duration-300 group-hover:text-cream">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </span>
              <span className="relative z-[1]">قصتنا</span>
            </a>
          </div>

          <div className="contact-social flex items-center justify-center gap-4 mb-10">
            <a
              href="#"
              className="group relative w-11 h-11 rounded-full flex items-center justify-center border border-[rgba(212,197,169,0.12)] bg-[rgba(26,24,20,0.3)] backdrop-blur-sm text-sand-light transition-all duration-500 hover:text-cream hover:border-[rgba(164,184,107,0.6)] hover:shadow-[0_0_24px_rgba(164,184,107,0.25),inset_0_0_12px_rgba(164,184,107,0.1)] hover:scale-110 hover:-translate-y-1 overflow-hidden"
              aria-label="Instagram"
            >
              <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(164,184,107,0.25)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 relative z-[1]">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href="#"
              className="group relative w-11 h-11 rounded-full flex items-center justify-center border border-[rgba(212,197,169,0.12)] bg-[rgba(26,24,20,0.3)] backdrop-blur-sm text-sand-light transition-all duration-500 hover:text-cream hover:border-[rgba(164,184,107,0.6)] hover:shadow-[0_0_24px_rgba(164,184,107,0.25),inset_0_0_12px_rgba(164,184,107,0.1)] hover:scale-110 hover:-translate-y-1 overflow-hidden"
              aria-label="Facebook"
            >
              <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(164,184,107,0.25)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 relative z-[1]">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="#"
              className="group relative w-11 h-11 rounded-full flex items-center justify-center border border-[rgba(212,197,169,0.12)] bg-[rgba(26,24,20,0.3)] backdrop-blur-sm text-sand-light transition-all duration-500 hover:text-cream hover:border-[rgba(164,184,107,0.6)] hover:shadow-[0_0_24px_rgba(164,184,107,0.25),inset_0_0_12px_rgba(164,184,107,0.1)] hover:scale-110 hover:-translate-y-1 overflow-hidden"
              aria-label="WhatsApp"
            >
              <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(164,184,107,0.25)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 relative z-[1]">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>

          <p className="contact-credit font-ar text-[0.8rem] font-light text-sand opacity-60">واحة سيوة © 2025</p>
        </div>
      </div>
    </section>
  );
}
