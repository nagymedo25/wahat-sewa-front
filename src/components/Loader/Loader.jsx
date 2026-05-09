export default function Loader({ isHidden }) {
  return (
    <div
      id="loader"
      className={
        'fixed inset-0 bg-shadow z-[9999] flex items-center justify-center transition-[opacity,visibility] duration-[1200ms] [transition-timing-function:var(--ease-cinematic)] ' +
        (isHidden ? 'opacity-0 invisible pointer-events-none' : '')
      }
    >
      <div className="text-center">
        <div className="text-[3rem] text-olive-glow opacity-50 mb-6 animate-loaderPulse">☰</div>
        <div className="flex justify-center gap-[0.15em] font-ar text-[2.5rem] font-light text-sand mb-8">
          <span className="inline-block opacity-0 translate-y-[20px] animate-loaderChar [animation-delay:0.1s]">و</span>
          <span className="inline-block opacity-0 translate-y-[20px] animate-loaderChar [animation-delay:0.2s]">ا</span>
          <span className="inline-block opacity-0 translate-y-[20px] animate-loaderChar [animation-delay:0.3s]">ح</span>
          <span className="inline-block opacity-0 translate-y-[20px] animate-loaderChar [animation-delay:0.4s]">ة</span>
          <span className="w-[0.5em]" />
          <span className="inline-block opacity-0 translate-y-[20px] animate-loaderChar [animation-delay:0.6s]">س</span>
          <span className="inline-block opacity-0 translate-y-[20px] animate-loaderChar [animation-delay:0.7s]">ي</span>
          <span className="inline-block opacity-0 translate-y-[20px] animate-loaderChar [animation-delay:0.8s]">و</span>
          <span className="inline-block opacity-0 translate-y-[20px] animate-loaderChar [animation-delay:0.9s]">ة</span>
        </div>
        <div className="w-[80px] h-px bg-[linear-gradient(90deg,transparent,var(--olive-glow),transparent)] mx-auto animate-loaderLine" />
      </div>
    </div>
  );
}
