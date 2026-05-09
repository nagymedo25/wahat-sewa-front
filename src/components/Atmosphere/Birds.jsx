export default function Birds() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[3] overflow-hidden max-md:hidden">
      <div className="absolute opacity-40 top-[20%] w-[40px] animate-birdFly1">
        <svg viewBox="0 0 100 50" className="fill-sand-warm [filter:blur(0.3px)]">
          <path d="M0,25 Q25,0 50,25 Q75,0 100,25 Q75,15 50,25 Q25,15 0,25 Z" />
        </svg>
      </div>
      <div className="absolute opacity-25 top-[15%] w-[25px] animate-birdFly2">
        <svg viewBox="0 0 100 50" className="fill-sand-warm [filter:blur(0.3px)]">
          <path d="M0,25 Q25,0 50,25 Q75,0 100,25 Q75,15 50,25 Q25,15 0,25 Z" />
        </svg>
      </div>
      <div className="absolute opacity-30 top-[25%] w-[32px] animate-birdFly3">
        <svg viewBox="0 0 100 50" className="fill-sand-warm [filter:blur(0.3px)]">
          <path d="M0,25 Q25,0 50,25 Q75,0 100,25 Q75,15 50,25 Q25,15 0,25 Z" />
        </svg>
      </div>
    </div>
  );
}
