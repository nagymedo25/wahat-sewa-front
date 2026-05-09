export default function WaveTransition() {
  return (
    <div className="relative h-[160px] overflow-hidden -mt-1 max-[480px]:h-[120px]" aria-hidden="true">
      <div className="absolute inset-0">
        <div className="absolute inset-0">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
            <path
              fill="#1a1814"
              fillOpacity="0.6"
              d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>
        <div className="absolute inset-0">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
            <path
              fill="#151310"
              fillOpacity="0.8"
              d="M0,256L48,245.3C96,235,192,213,288,192C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>
        <div className="absolute inset-0">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
            <path
              fill="#151310"
              fillOpacity="1"
              d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,234.7C672,256,768,288,864,277.3C960,267,1056,213,1152,197.3C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
