'use client';

import { useRef } from 'react';
import { useCursorReveal } from './useCursorReveal';

interface RevealImageLayerProps {
  baseSrc: string;
  overlaySrc?: string;
  alt: string;
  enableReveal?: boolean;
  maxRadius: number;
  className?: string;
}

export function RevealImageLayer({
  baseSrc,
  overlaySrc,
  alt,
  enableReveal = true,
  maxRadius,
  className = '',
}: RevealImageLayerProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLImageElement>(null);

  useCursorReveal({
    frameRef,
    overlayRef,
    enabled: Boolean(enableReveal && overlaySrc),
    maxRadius,
  });

  return (
    <div ref={frameRef} className={`ick-reveal-full ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="ick-reveal-base" src={baseSrc} alt={alt} draggable={false} />
      <div className="ick-dark-overlay" aria-hidden="true" />
      {overlaySrc && enableReveal ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={overlayRef}
          className="ick-reveal-overlay"
          src={overlaySrc}
          alt=""
          aria-hidden="true"
          draggable={false}
        />
      ) : null}
    </div>
  );
}
