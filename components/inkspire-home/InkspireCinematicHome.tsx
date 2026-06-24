'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const FRAME_DIRECTORY = '/assets/magnific-frames';
const TOTAL_FRAMES = 68;

function clamp(value: number, minimum = 0, maximum = 1) {
  return Math.min(Math.max(value, minimum), maximum);
}

interface CinematicSequenceProps {
  startFrame: number;
  endFrame: number;
  children: ReactNode | ((progress: number) => ReactNode);
  id: string;
}

function CinematicSequence({ startFrame, endFrame, children, id }: CinematicSequenceProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  const [loadedCount, setLoadedCount] = useState(0);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const [inView, setInView] = useState(false);
  const [progressState, setProgressState] = useState(0);

  const frameNumbers = Array.from({ length: endFrame - startFrame + 1 }, (_, i) => startFrame + i);
  // Memoize frameSources so it doesn't trigger effect loop
  const frameSources = useRef(
    frameNumbers.map((frame) => `${FRAME_DIRECTORY}/frame_${String(frame).padStart(3, '0')}.webp`)
  ).current;
  const timelineLength = frameNumbers.length - 1;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
        }
      },
      { rootMargin: '100% 0px 100% 0px' } // Load significantly before it comes into view
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return; // Lazy load!

    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return;

    const images: Array<HTMLImageElement | undefined> = new Array(frameSources.length);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    let currentFramePosition = 0;
    let disposed = false;

    const isReady = (image: HTMLImageElement | undefined): image is HTMLImageElement =>
      Boolean(image?.complete && image.naturalWidth);

    const findNearestReadyImage = (requestedFrame: number) => {
      if (isReady(images[requestedFrame])) return images[requestedFrame];
      for (let offset = 1; offset < images.length; offset += 1) {
        const previous = images[Math.max(0, requestedFrame - offset)];
        const next = images[Math.min(images.length - 1, requestedFrame + offset)];
        if (isReady(previous)) return previous;
        if (isReady(next)) return next;
      }
      return undefined;
    };

    // Cache canvas dimensions to prevent layout thrashing (getBoundingClientRect) during render loop
    let canvasDims = { width: 0, height: 0 };

    const drawImageCover = (image: HTMLImageElement, opacity = 1) => {
      const { width, height } = canvasDims;
      if (width === 0 || height === 0) return;

      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const drawWidth = Math.round(image.naturalWidth * scale);
      const drawHeight = Math.round(image.naturalHeight * scale);
      
      // Calculate integer coordinates to prevent sub-pixel antialiasing rendering penalty
      const x = Math.round((width - drawWidth) / 2);
      const y = Math.round((height - drawHeight) / 2);

      context.globalAlpha = opacity;
      context.drawImage(image, x, y, drawWidth, drawHeight);
    };

    const drawFrame = (requestedFrame: number) => {
      const lowerFrame = Math.floor(requestedFrame);
      const upperFrame = Math.min(Math.ceil(requestedFrame), images.length - 1);
      const blend = requestedFrame - lowerFrame;
      const lowerImage = findNearestReadyImage(lowerFrame);
      const upperImage = isReady(images[upperFrame]) ? images[upperFrame] : undefined;
      
      if (!lowerImage) return;

      const { width, height } = canvasDims;
      context.globalAlpha = 1;
      context.fillStyle = '#050514';
      context.fillRect(0, 0, width, height);
      
      drawImageCover(lowerImage);

      if (upperImage && upperImage !== lowerImage && blend > 0) {
        drawImageCover(upperImage, blend);
      }
      context.globalAlpha = 1;
    };

    const renderProgress = (progress: number) => {
      currentFramePosition = progress * timelineLength;
      
      // We don't need requestAnimationFrame here because GSAP ScrollTrigger's scrub already 
      // runs inside a rAF loop. We just need to make sure we don't cause layout thrashing.
      drawFrame(currentFramePosition);
      
      if (canvas) canvas.style.transform = `scale(${1 + progress * 0.15}) translateZ(0)`;
      progressRef.current?.style.setProperty('transform', `scaleX(${progress})`);
      
      setProgressState(progress);
    };

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvasDims = { width: rect.width, height: rect.height };
      
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * pixelRatio);
      canvas.height = Math.round(rect.height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      drawFrame(currentFramePosition);
    };

    // --- GSAP TIMELINE 3-SCENE MAPPING ---
    const frameState = { progress: 0 };
    
    const ctx = gsap.context(() => {
      if (prefersReducedMotion.matches) return; // Disable scroll animation if reduced motion

      const scene1 = document.getElementById('scene-1');
      const intermission1 = document.getElementById('intermission-1');
      const scene2 = document.getElementById('scene-2');
      const intermission2 = document.getElementById('intermission-2');
      const scene3 = document.getElementById('scene-3');

      // Use a single timeline bound to the entire section, mapped precisely to pixel distances
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1, // Smooth scrub
          onUpdate: () => renderProgress(frameState.progress)
        }
      });

      if (scene1 && intermission1 && scene2 && intermission2 && scene3) {
        // Calculate exact pixel distances between sections to account for margins/gaps
        const t1 = scene1.offsetTop;
        const tI1 = intermission1.offsetTop;
        const t2 = scene2.offsetTop;
        const tI2 = intermission2.offsetTop;
        const t3 = scene3.offsetTop;
        const tEnd = section.offsetHeight;

        const d1 = tI1 - t1;
        const dI1 = t2 - tI1;
        const d2 = tI2 - t2;
        const dI2 = t3 - tI2;
        const d3 = tEnd - t3;

        // Map timeline progress exactly to these physical pixel ratios
        tl.to(frameState, { progress: 19 / timelineLength, duration: d1, ease: 'none' })
          .to(frameState, { progress: 19 / timelineLength, duration: dI1, ease: 'none' })
          .to(frameState, { progress: 39 / timelineLength, duration: d2, ease: 'none' })
          .to(frameState, { progress: 39 / timelineLength, duration: dI2, ease: 'none' })
          .to(frameState, { progress: 1, duration: d3, ease: 'none' });
      } else {
        // Fallback
        tl.to(frameState, { progress: 19 / timelineLength, duration: 19, ease: 'none' })
          .to(frameState, { progress: 19 / timelineLength, duration: 8, ease: 'none' })
          .to(frameState, { progress: 39 / timelineLength, duration: 20, ease: 'none' })
          .to(frameState, { progress: 39 / timelineLength, duration: 8, ease: 'none' })
          .to(frameState, { progress: 1, duration: 28, ease: 'none' });
      }
    }, sectionRef);

    const requestRender = () => {
      renderProgress(frameState.progress);
    };

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
      requestRender();
    });
    
    resizeObserver.observe(canvas);
    window.addEventListener('resize', requestRender, { passive: true });

    frameSources.forEach((source, index) => {
      const image = new Image();
      image.decoding = 'async';
      image.src = source;
      images[index] = image;

      image.onload = () => {
        if (disposed) return;
        setLoadedCount((count) => count + 1);
        if (index === 0) {
          setFirstFrameReady(true);
          resizeCanvas();
        }
        if (
          index === Math.floor(currentFramePosition) ||
          index === Math.ceil(currentFramePosition)
        ) {
          requestRender();
        }
      };
    });

    resizeCanvas();
    requestRender();

    return () => {
      disposed = true;
      ctx.revert(); // Cleanup GSAP ScrollTrigger
      resizeObserver.disconnect();
      window.removeEventListener('resize', requestRender);
      images.forEach((image) => {
        if (image) image.onload = null;
      });
    };
  }, [inView, frameSources, timelineLength]);

  // Adjust section height based on number of frames. 
  const sectionHeight = Math.max(200, ((endFrame - startFrame + 1) / TOTAL_FRAMES) * 650) + 'vh';

  return (
    <section
      className="ink-film__sequence"
      id={id}
      ref={sectionRef}
    >
      <div className="ink-film__progress" ref={progressRef} aria-hidden="true" />
      <div className="ink-film__stage">
        <canvas
          className={`ink-film__canvas${firstFrameReady ? ' is-ready' : ''}`}
          ref={canvasRef}
        />
        <div className="ink-film__shade" aria-hidden="true" />
        <div className="ink-film__grain" aria-hidden="true" />

        {typeof children === 'function' ? children(progressState) : null}

        <p className="ink-film__frame" aria-hidden="true">
          <span>{String(Math.round(progressState * timelineLength) + startFrame).padStart(2, '0')}</span> / {TOTAL_FRAMES}
        </p>

        {!firstFrameReady && inView && (
          <div className="ink-film__loader" role="status">
            <span />
            Loading Sequence
          </div>
        )}
      </div>

      {typeof children !== 'function' ? (
        <div className="relative z-10 w-full" style={{ marginTop: '-100vh' }}>
          {children}
        </div>
      ) : null}
    </section>
  );
}

export function InkspireCinematicHome({ children }: { children?: ReactNode }) {
  return (
    <main className="ink-film">
      <header className="ink-film__nav">
        <a className="ink-film__brand" href="#film-start" aria-label="Inkspire, back to start">
          Inkspire<span>.</span>
        </a>
      </header>

      <CinematicSequence startFrame={1} endFrame={68} id="film-main">
        {children}
      </CinematicSequence>
    </main>
  );
}
