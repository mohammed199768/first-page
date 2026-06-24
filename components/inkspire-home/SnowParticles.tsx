'use client';

import { forwardRef, useMemo, useImperativeHandle, useRef } from 'react';

const SNOW_COUNT = 72;

export interface SnowParticlesHandle {
  update: (active: boolean, progress: number, exitProgress: number) => void;
}

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

export const SnowParticles = forwardRef<SnowParticlesHandle>(
  function SnowParticles(_, ref) {
    const layerRef = useRef<HTMLDivElement>(null);
    const flecks = useMemo(() => {
      const random = seededRandom(7703);
      return Array.from({ length: SNOW_COUNT }, (_, index) => {
        const depth = index % 3;
        const speed = 8 + random() * 10;
        return {
          left: random() * 100,
          size: 1 + random() * 2,
          duration: 100 / speed,
          delay: -random() * 12,
          opacity: 0.22 + depth * 0.13 + random() * 0.12,
          drift: (random() * 24 - 12).toFixed(2),
          blur: depth === 0 ? 0.6 : depth === 1 ? 0.3 : 0,
        };
      });
    }, []);

    useImperativeHandle(ref, () => ({
      update(active, progress, exitProgress) {
        const layer = layerRef.current;
        if (!layer) return;
        const exit = Math.max(0, Math.min(1, exitProgress));
        layer.style.opacity = active ? String(1 - exit) : '0';
        layer.style.setProperty('--snow-speed', String(1 - exit * 0.4));
        layer.dataset.active = String(active);
        layer.dataset.progress = progress.toFixed(3);
      },
    }));

    return (
      <div ref={layerRef} className="ick-snow-layer" data-active="false" aria-hidden="true">
        {flecks.map((fleck, index) => (
          <i
            className="ick-snow-dot"
            key={index}
            style={{
              left: `${fleck.left}%`,
              width: `${fleck.size}px`,
              height: `${fleck.size}px`,
              opacity: fleck.opacity,
              filter: `blur(${fleck.blur}px)`,
              animationDelay: `${fleck.delay}s`,
              '--snow-duration': `${fleck.duration}s`,
              '--snow-drift': `${fleck.drift}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    );
  },
);
