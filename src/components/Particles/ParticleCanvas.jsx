import { useEffect, useRef } from 'react';

export default function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;
    let raf = 0;
    let lastTs = 0;
    let isRunning = true;
    const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = width < 768 ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(randomY = false) {
        this.x = Math.random() * width;
        this.y = randomY ? Math.random() * height : -10;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = Math.random() * 0.5 + 0.2;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.02 + 0.01;
        this.color = this.getColor();
        this.glow = Math.random() > 0.8;
      }

      getColor() {
        const colors = [
          [212, 197, 169],
          [232, 168, 124],
          [164, 184, 107],
          [201, 184, 150],
        ];
        const c = colors[Math.floor(Math.random() * colors.length)];
        return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${this.opacity})`;
      }

      update() {
        this.wobble += this.wobbleSpeed;

        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const interactionRadius = 150;

        if (!isTouch && dist < interactionRadius) {
          const force = (interactionRadius - dist) / interactionRadius;
          const angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * force * 0.5;
          this.y += Math.sin(angle) * force * 0.5;
        }

        this.x += this.speedX + Math.sin(this.wobble) * 0.3;
        this.y += this.speedY;

        if (this.y > height + 10 || this.x < -10 || this.x > width + 10) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        if (this.glow && this.size > 1.5) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
          gradient.addColorStop(0, this.color.replace(/([\d.]+)\)$/, '0.1)'));
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      }
    }

    function initParticles() {
      particles = [];
      const count = width < 768 ? 10 : 140;
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    function animateParticles(ts) {
      if (!isRunning) return;
      if (!lastTs) lastTs = ts;

      const dt = ts - lastTs;
      if (dt < (width < 768 ? 50 : 16)) {
        raf = window.requestAnimationFrame(animateParticles);
        return;
      }
      lastTs = ts;

      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.update();
        p.draw();
      }
      raf = window.requestAnimationFrame(animateParticles);
    }

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onResize = () => {
      resizeCanvas();
      initParticles();
    };

    resizeCanvas();
    initParticles();
    raf = window.requestAnimationFrame(animateParticles);

    if (!isTouch) {
      document.addEventListener('mousemove', onMouseMove, { passive: true });
    }
    window.addEventListener('resize', onResize);

    const onVis = () => {
      const hidden = document.visibilityState === 'hidden';
      isRunning = !hidden;
      if (hidden) {
        if (raf) window.cancelAnimationFrame(raf);
        raf = 0;
        lastTs = 0;
      } else if (!raf) {
        raf = window.requestAnimationFrame(animateParticles);
      }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      if (!isTouch) {
        document.removeEventListener('mousemove', onMouseMove);
      }
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas id="particleCanvas" ref={canvasRef} className="fixed inset-0 pointer-events-none z-[2]" />;
}
