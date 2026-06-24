'use client';

import type { RefObject } from 'react';

/**
 * CinematicStoryStage
 * ───────────────────
 * The horizontal filmstrip: a title panel, five photo chapters, and an outro,
 * laid out side-by-side inside the native horizontal scroller `.ick-track`.
 * Each scene's photo / numeral / caption animate in via the `.is-in` class
 * that useFilmStrip toggles as the scene scrolls into view.
 */

type StageProps = {
  trackRef: RefObject<HTMLDivElement | null>;
  onNavigate?: (index: number) => void;
};

export function CinematicStoryStage({ trackRef, onNavigate }: StageProps) {
  return (
    <div className="ick-track" ref={trackRef}>
      {/* ── 00 · Opening title (revealed immediately) ─────────────────── */}
      <section
        id="ick-top"
        className="ick-panel ick-panel--hero is-in"
        aria-label="Inkspire — opening title"
      >
        <div className="ick-hero-inner">
          <p className="ick-hero-kicker">Inkspire — A film about ideas</p>
          <h1 className="ick-wordmark">
            Inkspire<span className="ick-dot">.</span>
          </h1>
          <p className="ick-hero-tagline">
            From ink and invention — to the patience that makes people inspire.
          </p>
        </div>
        <div className="ick-scroll-cue" aria-hidden="true">
          <span />
          Scroll
        </div>
      </section>

      {/* ── I · Origin (da Vinci) ───────────────────────────────────────── */}
      <section
        id="sc-origin"
        className="ick-panel"
        aria-labelledby="sc-origin-title"
      >
        <div className="ick-panel-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="ick-panel-img ick-pos-davinci ick-frame-davinci"
            src="/assets/home-story/davinci.png"
            alt="Leonardo da Vinci writing with a quill — the origin of ink and invention"
            fetchPriority="high"
            decoding="async"
            draggable={false}
          />
        </div>
        <div className="ick-grade ick-grade--gold" aria-hidden="true" />
        <span className="ick-panel-num" aria-hidden="true">
          01
        </span>
        <div className="ick-panel-content">
          <p className="ick-kicker">Chapter I · Origin</p>
          <h2 id="sc-origin-title" className="ick-title">
            Every invention begins as <em>ink</em>.
          </h2>
          <p className="ick-caption">
            Five centuries ago a restless hand turned curiosity into lines on a
            page. Before the machine, the idea was the technology.
          </p>
        </div>
      </section>

      {/* ── II · The Sketch (ornithopter) ──────────────────────────────── */}
      <section
        id="sc-sketch"
        className="ick-panel"
        aria-labelledby="sc-sketch-title"
      >
        <div className="ick-panel-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="ick-panel-img ick-frame-sketch"
            src="/assets/home-story/old-plan.png"
            alt="Da Vinci's ornithopter — an early sketch of a flying machine"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>
        <div className="ick-grade ick-grade--gold" aria-hidden="true" />
        <span className="ick-panel-num" aria-hidden="true">
          02
        </span>
        <div className="ick-panel-content">
          <p className="ick-kicker">Chapter II · The Sketch</p>
          <h2 id="sc-sketch-title" className="ick-title">
            A wing, imagined <em>centuries</em> early.
          </h2>
          <p className="ick-caption">
            Long before the engine there was the drawing — a flying machine held
            together by belief and geometry.
          </p>
        </div>
      </section>

      {/* ── III · The Hand (golden draw) ───────────────────────────────── */}
      <section
        id="sc-hand"
        className="ick-panel"
        aria-labelledby="sc-hand-title"
      >
        <div className="ick-panel-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="ick-panel-img ick-pos-hand"
            src="/assets/home-story/hand-draw.png"
            alt="An aged hand drawing glowing golden lines in the dark"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>
        <div className="ick-grade ick-grade--gold" aria-hidden="true" />
        <span className="ick-panel-num" aria-hidden="true">
          03
        </span>
        <div className="ick-panel-content">
          <p className="ick-kicker">Chapter III · The Hand</p>
          <h2 id="sc-hand-title" className="ick-title">
            Creation is a <em>human</em> act.
          </h2>
          <p className="ick-caption">
            Every system, every interface, every breakthrough still starts the
            same way: one hand, drawing in the dark.
          </p>
        </div>
      </section>

      {/* ── IV · The Science (blueprint) ───────────────────────────────── */}
      <section
        id="sc-science"
        className="ick-panel"
        aria-labelledby="sc-science-title"
      >
        <div className="ick-panel-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="ick-panel-img ick-img-blueprint"
            src="/assets/home-story/math.png"
            alt="Handwritten physics and mathematics, rendered as a blueprint"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>
        <div className="ick-grade ick-grade--blue" aria-hidden="true" />
        <span className="ick-panel-num" aria-hidden="true">
          04
        </span>
        <div className="ick-panel-content">
          <p className="ick-kicker">Chapter IV · The Science</p>
          <h2 id="sc-science-title" className="ick-title">
            Behind every dream, a <em>discipline</em>.
          </h2>
          <p className="ick-caption">
            Wonder becomes real when it meets mathematics — the quiet grammar
            beneath everything we build.
          </p>
        </div>
      </section>

      {/* ── V · The Realization (glider) ───────────────────────────────── */}
      <section
        id="sc-realization"
        className="ick-panel"
        aria-labelledby="sc-realization-title"
      >
        <div className="ick-panel-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="ick-panel-img ick-frame-glider"
            src="/assets/home-story/new-plan.png"
            alt="A finished wooden flying machine — the sketch made real"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>
        <div className="ick-grade ick-grade--gold" aria-hidden="true" />
        <span className="ick-panel-num" aria-hidden="true">
          05
        </span>
        <div className="ick-panel-content">
          <p className="ick-kicker">Chapter V · The Realization</p>
          <h2 id="sc-realization-title" className="ick-title">
            From ink, a machine takes <em>flight</em>.
          </h2>
          <p className="ick-caption">
            The sketch becomes structure. The thought becomes a thing. This is
            where inspiration finally lands.
          </p>
        </div>
      </section>

      {/* ── Outro · CTA ─────────────────────────────────────────────────── */}
      <section
        id="sc-outro"
        className="ick-panel ick-panel--outro"
        aria-labelledby="sc-outro-title"
      >
        <div className="ick-outro-inner">
          <p className="ick-kicker" style={{ justifyContent: 'center' }}>
            Inkspire
          </p>
          <h2 id="sc-outro-title" className="ick-outro-title">
            From Inkspire, we make people <em>inspire</em>.
          </h2>
          <div className="ick-cta-row">
            <button
              type="button"
              className="ick-btn ick-btn--primary"
              onClick={() => onNavigate?.(1)}
            >
              Start your story
            </button>
            <button
              type="button"
              className="ick-btn ick-btn--ghost"
              onClick={() => onNavigate?.(0)}
            >
              Replay the film
            </button>
          </div>
          <p className="ick-outro-note">
            Crafted to run cold — native scroll, no heavy runtime
          </p>
        </div>
      </section>
    </div>
  );
}
