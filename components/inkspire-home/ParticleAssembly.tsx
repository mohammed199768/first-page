'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

const PARTICLE_COUNT = 720;

type Particle = {
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
  curveX: number;
  curveY: number;
  size: number;
  alpha: number;
};

export interface ParticleAssemblyHandle {
  update: (active: boolean, progress: number) => void;
}

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);
}

export const ParticleAssembly = forwardRef<ParticleAssemblyHandle>(
  function ParticleAssembly(_, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });
    const lastRef = useRef({ active: false, progress: 0 });

    const rebuild = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      sizeRef.current = { width, height, dpr };

      const random = seededRandom(4219);
      const segments = [
        [0.14, 0.30, 0.87, 0.30],
        [0.18, 0.42, 0.78, 0.42],
        [0.12, 0.58, 0.90, 0.58],
        [0.23, 0.70, 0.75, 0.70],
        [0.22, 0.22, 0.22, 0.76],
        [0.42, 0.26, 0.42, 0.68],
        [0.62, 0.22, 0.62, 0.74],
        [0.79, 0.31, 0.79, 0.67],
        [0.18, 0.69, 0.47, 0.34],
        [0.48, 0.34, 0.82, 0.66],
        [0.30, 0.52, 0.67, 0.25],
        [0.53, 0.73, 0.86, 0.46],
      ];

      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, (_, index) => {
        const segment = segments[index % segments.length];
        const lineT = random();
        const jitter = (random() - 0.5) * 2.5;
        const x = (segment[0] + (segment[2] - segment[0]) * lineT) * width + jitter;
        const y = (segment[1] + (segment[3] - segment[1]) * lineT) * height + jitter;
        const maxOffset = width * 0.08;
        const angle = random() * Math.PI * 2;
        const distance = random() * maxOffset;

        return {
          x,
          y,
          offsetX: Math.cos(angle) * distance,
          offsetY: Math.sin(angle) * Math.min(distance, height * 0.08),
          curveX: (random() - 0.5) * maxOffset * 0.42,
          curveY: (random() - 0.5) * maxOffset * 0.42,
          size: 0.7 + random() * 1.5,
          alpha: 0.24 + random() * 0.58,
        };
      });
    };

    const draw = (active: boolean, progress: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext('2d');
      if (!context) return;

      const { width, height, dpr } = sizeRef.current;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      canvas.style.opacity = active ? '0.72' : '0';
      if (!active) return;

      const t = easeOutCubic(progress);
      const oneMinusT = 1 - t;
      context.globalCompositeOperation = 'lighter';

      for (const particle of particlesRef.current) {
        const startX = particle.x + particle.offsetX;
        const startY = particle.y + particle.offsetY;
        const controlX = particle.x + particle.curveX;
        const controlY = particle.y + particle.curveY;
        const x =
          oneMinusT * oneMinusT * startX +
          2 * oneMinusT * t * controlX +
          t * t * particle.x;
        const y =
          oneMinusT * oneMinusT * startY +
          2 * oneMinusT * t * controlY +
          t * t * particle.y;

        context.globalAlpha = particle.alpha * (0.28 + t * 0.72);
        context.fillStyle = 'rgba(255,255,255,0.92)';

        context.beginPath();
        context.shadowBlur = 38;
        context.shadowColor = 'rgba(107,64,146,0.25)';
        context.arc(x, y, particle.size, 0, Math.PI * 2);
        context.fill();

        context.beginPath();
        context.shadowBlur = 22;
        context.shadowColor = 'rgba(160,160,255,0.42)';
        context.arc(x, y, particle.size, 0, Math.PI * 2);
        context.fill();

        context.beginPath();
        context.shadowBlur = 0;
        context.arc(x, y, particle.size, 0, Math.PI * 2);
        context.fill();
      }

      context.globalAlpha = 1;
      context.shadowBlur = 0;
    };

    useImperativeHandle(ref, () => ({
      update(active, progress) {
        lastRef.current = { active, progress };
        draw(active, progress);
      },
    }));

    useEffect(() => {
      rebuild();
      draw(false, 0);
      const onResize = () => {
        rebuild();
        draw(lastRef.current.active, lastRef.current.progress);
      };
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }, []);

    return <canvas ref={canvasRef} className="ick-particle-layer" aria-hidden="true" />;
  },
);
