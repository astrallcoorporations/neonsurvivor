'use client';

import { useEffect, useRef } from 'react';

/**
 * Cinematic synthwave background:
 *  - gradient sky (deep purple → magenta horizon)
 *  - setting sun (semicircle with horizontal scanline gaps)
 *  - distant mountain silhouette
 *  - starfield (upper half)
 *  - perspective grid floor with fog (lower half)
 *  - drifting embers
 * Pure canvas, GPU-cheap, pauses when tab hidden.
 */
export default function CyberBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext('2d')!;
    let raf = 0;
    let t = 0;
    let W = 0, H = 0, dpr = 1;
    let stars: { x: number; y: number; r: number; tw: number; ph: number }[] = [];
    let embers: { x: number; y: number; vx: number; vy: number; r: number; hue: number; life: number; max: number }[] = [];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = c.clientWidth; H = c.clientHeight;
      c.width = W * dpr; c.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // seed stars (only upper 55%)
      stars = [];
      const n = Math.floor((W * H) / 9000);
      for (let i = 0; i < n; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H * 0.52,
          r: Math.random() * 1.3 + 0.2,
          tw: Math.random() * 2 + 0.5,
          ph: Math.random() * Math.PI * 2,
        });
      }
      embers = [];
    }

    function spawnEmber() {
      if (embers.length > 50) return;
      embers.push({
        x: Math.random() * W,
        y: H * 0.55 + Math.random() * 20,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -Math.random() * 0.4 - 0.15,
        r: Math.random() * 1.4 + 0.3,
        hue: Math.random() < 0.5 ? 188 : (Math.random() < 0.5 ? 312 : 38),
        life: 0,
        max: Math.random() * 4 + 3,
      });
    }

    function draw() {
      t += 0.008;
      const horizon = H * 0.55;

      // ---- sky gradient ----
      const sky = ctx.createLinearGradient(0, 0, 0, horizon);
      sky.addColorStop(0, '#05030d');
      sky.addColorStop(0.5, '#0e0524');
      sky.addColorStop(0.85, '#3a0d4a');
      sky.addColorStop(1, '#7a1148');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, horizon);

      // ---- stars ----
      for (const s of stars) {
        const a = 0.4 + Math.sin(t * s.tw + s.ph) * 0.4;
        ctx.fillStyle = `rgba(220,235,255,${a})`;
        ctx.fillRect(s.x, s.y, s.r, s.r);
      }

      // ---- sun ----
      const sunR = Math.min(W, H) * 0.22;
      const sunX = W * 0.5;
      const sunY = horizon - sunR * 0.15;
      const sunG = ctx.createLinearGradient(0, sunY - sunR, 0, sunY + sunR);
      sunG.addColorStop(0, '#ffe24a');
      sunG.addColorStop(0.45, '#ff7a3c');
      sunG.addColorStop(1, '#ff2bd6');
      ctx.save();
      // clip to circle above horizon
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = sunG;
      ctx.fillRect(sunX - sunR, sunY - sunR, sunR * 2, sunR * 2);
      // horizontal scanline gaps (synthwave sun)
      ctx.fillStyle = '#0e0524';
      const bands = 7;
      for (let i = 0; i < bands; i++) {
        const by = sunY + sunR * 0.15 + (i / bands) * sunR * 0.85;
        const bh = 2 + i * 1.6;
        ctx.fillRect(sunX - sunR, by, sunR * 2, bh);
      }
      ctx.restore();
      // sun glow
      const glow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR * 2.2);
      glow.addColorStop(0, 'rgba(255,122,60,0.25)');
      glow.addColorStop(0.5, 'rgba(255,43,214,0.08)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, horizon);

      // ---- mountain silhouette ----
      ctx.fillStyle = '#0a0418';
      ctx.beginPath();
      ctx.moveTo(0, horizon);
      const peaks = 8;
      for (let i = 0; i <= peaks; i++) {
        const px = (i / peaks) * W;
        const py = horizon - (Math.sin(i * 1.7) * 0.5 + 0.5) * H * 0.08 - 6;
        ctx.lineTo(px, py);
      }
      ctx.lineTo(W, horizon);
      ctx.closePath();
      ctx.fill();
      // mountain rim glow
      ctx.strokeStyle = 'rgba(255,43,214,0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i <= peaks; i++) {
        const px = (i / peaks) * W;
        const py = horizon - (Math.sin(i * 1.7) * 0.5 + 0.5) * H * 0.08 - 6;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // ---- horizon glow line ----
      const hg = ctx.createLinearGradient(0, horizon - 2, 0, horizon + 2);
      hg.addColorStop(0, 'rgba(0,0,0,0)');
      hg.addColorStop(0.5, 'rgba(255,43,214,0.9)');
      hg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = hg;
      ctx.fillRect(0, horizon - 2, W, 4);

      // ---- ground ----
      const grd = ctx.createLinearGradient(0, horizon, 0, H);
      grd.addColorStop(0, '#1a0530');
      grd.addColorStop(1, '#05030d');
      ctx.fillStyle = grd;
      ctx.fillRect(0, horizon, W, H - horizon);

      // ---- perspective grid ----
      const vpx = W * 0.5;
      ctx.lineWidth = 1;
      // horizontal receding lines
      const hLines = 16;
      for (let i = 0; i < hLines; i++) {
        const p = ((i / hLines) + (t * 0.12) % (1 / hLines)) % 1;
        const y = horizon + Math.pow(p, 2.4) * (H - horizon);
        const a = 0.06 + p * 0.32;
        ctx.strokeStyle = `rgba(34,230,255,${a})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      // vertical converging lines
      const vCount = 22;
      for (let i = -vCount; i <= vCount; i++) {
        const x = vpx + i * (W / vCount);
        const a = 0.08 + Math.abs(i) / vCount * 0.05;
        ctx.strokeStyle = `rgba(255,43,214,${a})`;
        ctx.beginPath();
        ctx.moveTo(vpx, horizon);
        ctx.lineTo(x, H);
        ctx.stroke();
      }

      // ---- ground fog ----
      const fog = ctx.createLinearGradient(0, horizon, 0, horizon + (H - horizon) * 0.4);
      fog.addColorStop(0, 'rgba(122,17,72,0.5)');
      fog.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = fog;
      ctx.fillRect(0, horizon, W, (H - horizon) * 0.4);

      // ---- embers ----
      if (Math.random() < 0.4) spawnEmber();
      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i];
        e.life += 0.016;
        e.x += e.vx; e.y += e.vy;
        if (e.life >= e.max || e.y < 0) { embers.splice(i, 1); continue; }
        const a = (1 - e.life / e.max) * 0.8;
        ctx.fillStyle = `hsla(${e.hue},100%,70%,${a})`;
        ctx.shadowColor = `hsla(${e.hue},100%,70%,0.9)`;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
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
  }, []);

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden
    />
  );
}
