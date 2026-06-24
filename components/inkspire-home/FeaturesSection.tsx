import React from 'react';

export function FeaturesSection() {
  return (
    <section className="ink-features">
      <div className="ink-features__header">
        <h2 className="ink-features__title">The craft behind the frame.</h2>
        <p className="ink-features__subtitle">
          Explore the meticulous design details and engineering that bring the cinematic experience to life.
        </p>
      </div>

      <div className="ink-features__grid">
        <div className="ink-card ink-card--large">
          <div className="ink-card__image-wrapper">
            <img src="/assets/magnific-frames/frame_020.webp" alt="Engineering" className="ink-card__image" />
          </div>
          <div className="ink-card__content">
            <h3 className="ink-card__title">Fluid Architecture</h3>
            <p className="ink-card__desc">
              Every curve and line is mathematically rendered to ensure perfect fluid dynamics across the screen.
            </p>
          </div>
        </div>

        <div className="ink-card">
          <div className="ink-card__image-wrapper">
            <img src="/assets/magnific-frames/frame_040.webp" alt="Design" className="ink-card__image" />
          </div>
          <div className="ink-card__content">
            <h3 className="ink-card__title">Precision Lighting</h3>
            <p className="ink-card__desc">
              Dynamic shadows and volumetric lighting add depth to flat planes.
            </p>
          </div>
        </div>

        <div className="ink-card">
          <div className="ink-card__image-wrapper">
            <img src="/assets/magnific-frames/frame_065.webp" alt="Motion" className="ink-card__image" />
          </div>
          <div className="ink-card__content">
            <h3 className="ink-card__title">Synchronized Motion</h3>
            <p className="ink-card__desc">
              Scroll-driven interpolation matches human input to visual output perfectly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
