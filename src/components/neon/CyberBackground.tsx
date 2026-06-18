'use client';

import { useEffect, useRef } from 'react';

/**
 * Animated cyberpunk background:
 *  - perspective grid floor (synthwave)
 *  - drifting neon particles
 *  - pulsing radial glow
 * Pure canvas, GPU-cheap, pauses when tab hidden.
 */
export default function CyberBackground({ intensity = 1 }: { intensity?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext('2d')!;
    let raf = 0;
    let t = 0;
    let W = 0, H = 0, dpr = 1;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; hue: number }[] = [];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = c.clientWidth; H = c.clientHeight;
      c.width = W * dpr; c.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // seed particles
      particles.length = 0;
      const n = Math.floor(60 * intensity);
      for (let i = 0; i < n; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -Math.random() * 0.5 - 0.1,
          r: Math.random() * 1.6 + 0.4,
          hue: Math.random() < 0.5 ? 188 : (Math.random() < 0.5 ? 312 : 268),
        });
      }
    }

    function draw() {
      t += 0.008;
      // bg gradient
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#05030d');
      g.addColorStop(0.55, '#0a0420');
      g.addColorStop(1, '#02010a');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      // pulsing radial glow (cyan/magenta)
      const cx = W * 0.5, cy = H * 0.42;
      const pulse = 0.5 + Math.sin(t * 1.5) * 0.5;
      const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.7);
      rg.addColorStop(0, `rgba(155,92,255,${0.10 + pulse * 0.05})`);
      rg.addColorStop(0.4, `rgba(34,230,255,${0.04 + pulse * 0.03})`);
      rg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, W, H);

      // synthwave perspective grid (lower half)
      const horizon = H * 0.55;
      ctx.strokeStyle = 'rgba(34,230,255,0.18)';
      ctx.lineWidth = 1;
      // horizontal lines (receding)
      const lines = 14;
      for (let i = 0; i < lines; i++) {
        const p = (i / lines + (t * 0.15) % (1 / lines)) % 1;
        const y = horizon + Math.pow(p, 2.2) * (H - horizon);
        const alpha = 0.05 + p * 0.25;
        ctx.strokeStyle = `rgba(34,230,255,${alpha})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      // vertical lines (converging to vanishing point)
      const vpx = W * 0.5;
      const vCount = 24;
      for (let i = -vCount; i <= vCount; i++) {
        const x = vpx + i * (W / vCount);
        ctx.strokeStyle = `rgba(255,43,214,${0.08 + Math.abs(i) / vCount * 0.04})`;
        ctx.beginPath();
        ctx.moveTo(vpx, horizon);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      // horizon glow
      const hg = ctx.createLinearGradient(0, horizon - 30, 0, horizon + 30);
      hg.addColorStop(0, 'rgba(0,0,0,0)');
      hg.addColorStop(0.5, 'rgba(255,43,214,0.5)');
      hg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = hg;
      ctx.fillRect(0, horizon - 30, W, 60);

      // particles
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        ctx.fillStyle = `hsla(${p.hue},100%,70%,0.7)`;
        ctx.shadowColor = `hsla(${p.hue},100%,70%,0.9)`;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    draw();
    const onVis = () => { if (document.hidden) cancelAnimationFrame(raf); else raf = requestAnimationFrame(draw); };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [intensity]);

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden
    />
  );
}
