'use client';

import { useEffect, useRef } from 'react';

export type UseCursorRevealArgs = {
  frameRef: React.RefObject<HTMLElement | null>;
  overlayRef: React.RefObject<HTMLElement | null>;
  enabled: boolean;
  maxRadius: number;
};

const LERP_FACTOR = 0.18;

export function useCursorReveal({
  frameRef,
  overlayRef,
  enabled,
  maxRadius,
}: UseCursorRevealArgs) {
  const target = useRef({ x: 0, y: 0, radius: 0 });
  const current = useRef({ x: 0, y: 0, radius: 0 });

  useEffect(() => {
    const frame = frameRef.current;
    const overlay = overlayRef.current;
    if (!frame || !overlay || !enabled) return;

    let rafId = 0;
    let running = false;

    const paint = () => {
      current.current.x += (target.current.x - current.current.x) * LERP_FACTOR;
      current.current.y += (target.current.y - current.current.y) * LERP_FACTOR;
      current.current.radius +=
        (target.current.radius - current.current.radius) * LERP_FACTOR;

      frame.style.setProperty('--reveal-x', `${current.current.x.toFixed(2)}px`);
      frame.style.setProperty('--reveal-y', `${current.current.y.toFixed(2)}px`);
      frame.style.setProperty('--reveal-r', `${current.current.radius.toFixed(2)}px`);

      const stillMoving =
        Math.abs(target.current.x - current.current.x) > 0.1 ||
        Math.abs(target.current.y - current.current.y) > 0.1 ||
        Math.abs(target.current.radius - current.current.radius) > 0.1;

      if (stillMoving) {
        rafId = requestAnimationFrame(paint);
      } else {
        running = false;
      }
    };

    const requestPaint = () => {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(paint);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = frame.getBoundingClientRect();
      target.current.x = event.clientX - rect.left;
      target.current.y = event.clientY - rect.top;
      target.current.radius = maxRadius;
      requestPaint();
    };

    const collapse = () => {
      target.current.radius = 0;
      requestPaint();
    };

    const onRevealCollapse = () => collapse();

    frame.addEventListener('pointermove', onPointerMove);
    frame.addEventListener('pointerleave', collapse);
    frame.addEventListener('ick:collapse-reveal', onRevealCollapse);

    return () => {
      cancelAnimationFrame(rafId);
      frame.removeEventListener('pointermove', onPointerMove);
      frame.removeEventListener('pointerleave', collapse);
      frame.removeEventListener('ick:collapse-reveal', onRevealCollapse);
    };
  }, [enabled, frameRef, maxRadius, overlayRef]);
}
