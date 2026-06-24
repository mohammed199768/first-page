'use client';

import { useCallback, useEffect, useState, type RefObject } from 'react';

/**
 * useFilmStrip
 * ────────────
 * Wires the native horizontal scroller:
 *  • mouse-wheel → advance one scene (vertical-intent wheels only; trackpad /
 *    touch horizontal gestures pass through to native momentum scrolling),
 *  • IntersectionObserver toggles `.is-in` so each scene's photo animates in,
 *  • one rAF-throttled scroll read drives the progress bar + chapter counter.
 *
 * No per-frame work beyond the throttled read; all motion is CSS transitions
 * on transform/opacity.
 */
export function useFilmStrip(
  trackRef: RefObject<HTMLDivElement | null>,
  progressRef: RefObject<HTMLDivElement | null>,
  count: number,
) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // reveal scenes as they slide into view
    const panels = Array.from(track.querySelectorAll<HTMLElement>('.ick-panel'));
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.classList.add('is-in');
        }
      },
      { root: track, threshold: 0.4 },
    );
    panels.forEach((panel) => io.observe(panel));

    // mouse-wheel → one scene per notch
    let snapping = false;
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return; // native horizontal
      event.preventDefault();
      if (snapping) return;
      const w = track.clientWidth || 1;
      const current = Math.round(track.scrollLeft / w);
      const next = Math.max(
        0,
        Math.min(count - 1, current + (event.deltaY > 0 ? 1 : -1)),
      );
      if (next === current) return;
      snapping = true;
      track.scrollTo({ left: next * w, behavior: reduce ? 'auto' : 'smooth' });
      window.setTimeout(() => {
        snapping = false;
      }, 650);
    };
    track.addEventListener('wheel', onWheel, { passive: false });

    // progress + active index
    let rafId = 0;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const w = track.clientWidth || 1;
        const max = track.scrollWidth - w || 1;
        const progress = Math.min(1, Math.max(0, track.scrollLeft / max));
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${progress})`;
        }
        const index = Math.min(count - 1, Math.max(0, Math.round(track.scrollLeft / w)));
        setActive((prev) => (prev === index ? prev : index));
      });
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      io.disconnect();
      track.removeEventListener('wheel', onWheel);
      track.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [trackRef, progressRef, count]);

  const goTo = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      track.scrollTo({
        left: index * track.clientWidth,
        behavior: reduce ? 'auto' : 'smooth',
      });
    },
    [trackRef],
  );

  return { active, goTo };
}
