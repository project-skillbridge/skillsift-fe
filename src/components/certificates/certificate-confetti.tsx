"use client";

import { useEffect, useRef } from "react";

const COLORS = [
  "#009F6A",
  "#34D399",
  "#F5C451",
  "#FFFFFF",
  "#0F766E",
  "#FBBF24",
];

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vr: number;
  color: string;
  round: boolean;
};

/**
 * One-shot celebratory burst when a valid certificate is opened. Skipped for
 * users who prefer reduced motion. Pointer-events are off so it never blocks
 * the page, and the canvas unmounts itself when the animation ends.
 */
export function CertificateConfetti() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      canvas.remove();
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const pieces: Piece[] = [];
    const burst = (originX: number, dir: number) => {
      for (let i = 0; i < 90; i++) {
        const angle = dir * (0.15 + Math.random() * 0.75);
        const speed = 9 + Math.random() * 11;
        pieces.push({
          x: originX,
          y: h * 0.75,
          vx: Math.sin(angle) * speed,
          vy: -Math.cos(angle) * speed - 4,
          size: 6 + Math.random() * 6,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.4,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          round: Math.random() < 0.25,
        });
      }
    };
    burst(w * 0.1, 1);
    burst(w * 0.9, -1);

    let raf = 0;
    let frames = 0;
    const tick = () => {
      frames++;
      ctx.clearRect(0, 0, w, h);
      for (const p of pieces) {
        p.vy += 0.28;
        p.vx *= 0.985;
        p.vy *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        const fade = Math.max(0, Math.min(1, (h + 40 - p.y) / 200));
        ctx.save();
        ctx.globalAlpha = frames > 150 ? fade : 1;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.round) {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        }
        ctx.restore();
      }
      if (frames < 280 && pieces.some((p) => p.y < h + 40)) {
        raf = requestAnimationFrame(tick);
      } else {
        canvas.remove();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50 h-screen w-screen"
    />
  );
}
