export default function LightRays() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden max-md:hidden">
      <div className="absolute top-[-20%] w-[80px] h-[140%] [background:linear-gradient(180deg,rgba(232,168,124,0.08)_0%,rgba(212,197,169,0.03)_50%,transparent_100%)] origin-top [animation-delay:calc(var(--i)*-1.5s)] [filter:blur(8px)] max-md:[filter:none] animate-lightRaySway left-[15%] rotate-[12deg]" style={{ '--i': 1 }} />
      <div className="absolute top-[-20%] w-[80px] h-[140%] [background:linear-gradient(180deg,rgba(232,168,124,0.08)_0%,rgba(212,197,169,0.03)_50%,transparent_100%)] origin-top opacity-60 [animation-delay:calc(var(--i)*-1.5s)] [filter:blur(8px)] max-md:[filter:none] animate-lightRaySway left-[35%] rotate-[5deg]" style={{ '--i': 2 }} />
      <div className="absolute top-[-20%] w-[80px] h-[140%] [background:linear-gradient(180deg,rgba(232,168,124,0.08)_0%,rgba(212,197,169,0.03)_50%,transparent_100%)] origin-top opacity-80 [animation-delay:calc(var(--i)*-1.5s)] [filter:blur(8px)] max-md:[filter:none] animate-lightRaySway left-[55%] rotate-[-3deg]" style={{ '--i': 3 }} />
      <div className="absolute top-[-20%] w-[80px] h-[140%] [background:linear-gradient(180deg,rgba(232,168,124,0.08)_0%,rgba(212,197,169,0.03)_50%,transparent_100%)] origin-top opacity-50 [animation-delay:calc(var(--i)*-1.5s)] [filter:blur(8px)] max-md:[filter:none] animate-lightRaySway left-[75%] rotate-[-10deg]" style={{ '--i': 4 }} />
      <div className="absolute top-[-20%] w-[80px] h-[140%] [background:linear-gradient(180deg,rgba(232,168,124,0.08)_0%,rgba(212,197,169,0.03)_50%,transparent_100%)] origin-top opacity-40 [animation-delay:calc(var(--i)*-1.5s)] [filter:blur(8px)] max-md:[filter:none] animate-lightRaySway left-[90%] rotate-[-18deg]" style={{ '--i': 5 }} />
    </div>
  );
}
