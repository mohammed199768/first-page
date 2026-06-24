/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./InkOriginCinematic.module.css";
import { InkDrop } from "./InkDrop";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SHOW_FRAME_LABELS = false;

export const InkOriginCinematic = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dropWrapRef = useRef<HTMLDivElement>(null);
  const dropInnerRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const isReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      /* ─── SVG ink drop — fade in after origin strip ends ─── */
      const originStrip = document.querySelector(".origin-strip");
      if (originStrip && dropWrapRef.current) {
        gsap.set(dropWrapRef.current, { opacity: 0 });
        ScrollTrigger.create({
          trigger: originStrip,
          start: "bottom 60%",
          onEnter: () =>
            gsap.to(dropWrapRef.current, { opacity: 1, duration: 1 }),
          onLeaveBack: () =>
            gsap.to(dropWrapRef.current, { opacity: 0, duration: 0.6 }),
        });
      }

      /* ─── Ink drop subtle 3D wobble ─── */
      if (!isReducedMotion && dropInnerRef.current) {
        gsap.fromTo(
          dropInnerRef.current,
          { rotationY: -12, scaleX: 0.96 },
          {
            rotationY: 12,
            scaleX: 1.03,
            duration: 5,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          }
        );
      }

      /* ─── Parallax ─── */
      if (!isReducedMotion) {
        gsap.utils.toArray<HTMLElement>("[data-par]").forEach((el) => {
          const amt = parseFloat(el.dataset.par || "0");
          gsap.fromTo(
            el,
            { y: -amt },
            {
              y: amt,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        });
      }

      /* ─── Reveal (fade in once) ─── */
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        const targetOp = parseFloat(el.dataset.op || "1");
        gsap.to(el, {
          opacity: targetOp,
          duration: el.dataset.dur ? parseFloat(el.dataset.dur) : 1.4,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });

      /* ─── Landing — drop descent, ripple, brand ─── */
      const landing = document.querySelector(".landing-section");
      if (
        landing &&
        dropWrapRef.current &&
        rippleRef.current &&
        brandRef.current
      ) {
        ScrollTrigger.create({
          trigger: landing,
          start: "top 80%",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            const lp = self.progress;
            gsap.set(dropWrapRef.current, { top: `${50 + lp * 22}vh` });
            gsap.set(rippleRef.current, {
              opacity: gsap.utils.clamp(0, 1, (lp - 0.6) / 0.2),
            });
            if (lp > 0.82) {
              gsap.set(dropWrapRef.current, {
                opacity: gsap.utils.clamp(0, 1, 1 - (lp - 0.82) / 0.18),
              });
            }
            gsap.set(brandRef.current, {
              opacity: gsap.utils.clamp(0, 1, (lp - 0.8) / 0.2),
            });
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={`${styles.ickRoot} ick-root`}>
      {/* ── Fixed cosmic backdrop ── */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(130% 90% at 50% -12%, #1b1438 0%, #0c1028 34%, #080a1a 62%, #05060B 100%)",
        }}
      />

      {/* ── Fixed SVG ink drop guide ── */}
      <div
        ref={dropWrapRef}
        className="fixed left-1/2 top-[50vh] -translate-x-1/2 z-40 opacity-0 pointer-events-none will-change-[opacity,top,transform]"
        style={{
          perspective: "800px",
          filter:
            "drop-shadow(0 0 10px rgba(100,130,255,0.12)) drop-shadow(0 0 30px rgba(110,70,190,0.06))",
        }}
      >
        <div
          ref={dropInnerRef}
          style={{
            transformOrigin: "center center",
            transformStyle: "preserve-3d",
          }}
        >
          <InkDrop />
        </div>
      </div>

      {/* ── Fixed landing ripple ── */}
      <div
        ref={rippleRef}
        className="fixed left-1/2 top-[72vh] z-[39] opacity-0 pointer-events-none"
      >
        <div className={styles.rippleRing1} />
        <div className={styles.rippleRing2} />
        <div
          className="absolute left-1/2 top-1/2 w-[160px] h-[34px] -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "radial-gradient(closest-side, rgba(95,227,255,.3), transparent 75%)",
          }}
        />
      </div>

      {/* ── Fixed brand-reveal placeholder ── */}
      <div
        ref={brandRef}
        className="fixed left-1/2 top-[46vh] -translate-x-1/2 z-[41] opacity-0 pointer-events-none text-center"
      >
        <div className="w-[128px] h-[128px] mx-auto border border-[rgba(180,200,235,.35)] rounded-full flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[rgba(95,227,255,.8)] shadow-[0_0_18px_rgba(95,227,255,.8)]" />
        </div>
        <div className="mt-[22px] font-mono text-[11px] tracking-[0.42em] text-[rgba(150,178,220,.6)] uppercase">
          [ brand mark ]
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          ORIGIN STRIP — simple vertical image stack
          No sticky, no GSAP, no crop. Just scroll.
          ══════════════════════════════════════════════ */}
      <section className={`${styles.originStrip} origin-strip relative z-10`}>
        <img
          src="/ink-origin/tree-upper.png"
          alt="Origin Tree"
          className={styles.originImage}
        />
        <img
          src="/ink-origin/roots-lower.png"
          alt="Root descent and original ink drop"
          className={styles.originImage}
        />
      </section>

      {/* ══════════════════════════════════════════════
          CIVILIZATION (Frames 05–10)
          ══════════════════════════════════════════════ */}
      <div className="civilization-section relative z-10">
        {/* Frame 05 — First Marks of Thought */}
        <section className="relative min-h-[120vh] flex items-center justify-center overflow-hidden">
          <div
            className="absolute left-1/2 top-0 w-[1px] h-[46vh] -translate-x-1/2 opacity-60"
            style={{
              background:
                "linear-gradient(180deg, rgba(120,170,235,0), rgba(120,170,235,.5) 60%, rgba(120,170,235,0))",
            }}
          />
          <div
            className="absolute left-1/2 top-[58%] -translate-x-1/2 w-[clamp(280px,30vw,460px)] max-sm:w-[clamp(200px,25vw,360px)]"
            data-par="26"
          >
            <img
              src="/ink-origin/formulas.png"
              alt=""
              className="w-full block opacity-0"
              data-reveal
              data-op="0.10"
              style={{
                filter:
                  "invert(1) sepia(.4) hue-rotate(168deg) saturate(1.3) brightness(1.05)",
              }}
            />
          </div>
          <div
            className="absolute left-[7vw] bottom-[12vh] z-30 flex flex-col gap-[11px] opacity-0"
            data-reveal
            data-op="1"
            data-dur="1"
          >
            {SHOW_FRAME_LABELS && (
              <span className="font-mono text-[12px] tracking-[0.42em] text-[rgba(150,178,220,.72)]">
                FRAME 05
              </span>
            )}
            <div className="w-[42px] h-[1px] bg-gradient-to-r from-[rgba(150,178,220,.6)] to-transparent" />
            <div className="italic font-medium text-[clamp(28px,3.8vw,48px)] leading-[1.02] text-[rgba(236,233,224,.94)]">
              First Marks of Thought
            </div>
          </div>
        </section>

        {/* Frame 06 — Mathematics Awakens */}
        <section className="relative min-h-[125vh] flex items-center justify-center overflow-hidden">
          <div
            className="absolute left-[-4vw] top-1/2 -translate-y-1/2 w-[clamp(380px,44vw,760px)] max-sm:w-[clamp(280px,35vw,460px)] max-sm:opacity-50"
            data-par="40"
          >
            <img
              src="/ink-origin/formulas.png"
              alt=""
              className={`w-full block opacity-0 ${styles.mathMaskLeft}`}
              data-reveal
              data-op="0.17"
              style={{
                filter:
                  "invert(1) sepia(.4) hue-rotate(168deg) saturate(1.4) brightness(1.08)",
              }}
            />
          </div>
          <div
            className="absolute right-[-6vw] top-[46%] -translate-y-1/2 w-[clamp(300px,36vw,620px)] max-sm:w-[clamp(220px,28vw,380px)] max-sm:opacity-50"
            data-par="-34"
          >
            <img
              src="/ink-origin/formulas.png"
              alt=""
              className={`w-full block opacity-0 scale-x-[-1] ${styles.mathMaskRight}`}
              data-reveal
              data-op="0.11"
              style={{
                filter:
                  "invert(1) sepia(.5) hue-rotate(220deg) saturate(1.2) brightness(1.0)",
              }}
            />
          </div>
          <div
            className="absolute left-[7vw] bottom-[12vh] z-30 flex flex-col gap-[11px] opacity-0"
            data-reveal
            data-op="1"
            data-dur="1"
          >
            {SHOW_FRAME_LABELS && (
              <span className="font-mono text-[12px] tracking-[0.42em] text-[rgba(150,178,220,.72)]">
                FRAME 06
              </span>
            )}
            <div className="w-[42px] h-[1px] bg-gradient-to-r from-[rgba(150,178,220,.6)] to-transparent" />
            <div className="italic font-medium text-[clamp(28px,3.8vw,48px)] leading-[1.02] text-[rgba(236,233,224,.94)]">
              Mathematics Awakens
            </div>
          </div>
        </section>

        {/* Frame 07 — Flight Is Imagined */}
        <section className="relative min-h-[130vh] flex items-center justify-center overflow-hidden">
          <div
            className="absolute left-[6vw] top-1/2 -translate-y-1/2 w-[clamp(360px,40vw,640px)] h-[clamp(360px,40vw,640px)] max-sm:w-[280px] max-sm:h-[280px]"
            style={{
              background:
                "radial-gradient(closest-side, rgba(201,150,46,.16), transparent 70%)",
            }}
          />
          <div
            className="absolute left-[3vw] top-1/2 -translate-y-1/2 w-[clamp(420px,48vw,860px)] max-sm:w-[clamp(320px,40vw,480px)]"
            data-par="30"
          >
            <img
              src="/ink-origin/hand-sketch.png"
              alt=""
              className={`w-full block opacity-0 ${styles.sketchMask}`}
              data-reveal
              data-op="0.92"
              data-dur="1.8"
              style={{ filter: "brightness(1.04) contrast(1.05)" }}
            />
          </div>
          <div
            className="absolute right-[7vw] bottom-[14vh] z-30 flex flex-col gap-[11px] items-end text-right opacity-0"
            data-reveal
            data-op="1"
            data-dur="1"
          >
            {SHOW_FRAME_LABELS && (
              <span className="font-mono text-[12px] tracking-[0.42em] text-[rgba(214,180,110,.8)]">
                FRAME 07
              </span>
            )}
            <div className="w-[42px] h-[1px] bg-gradient-to-l from-[rgba(214,180,110,.7)] to-transparent" />
            <div className="italic font-medium text-[clamp(28px,3.8vw,48px)] leading-[1.02] text-[rgba(238,226,200,.95)]">
              Flight Is Imagined
            </div>
          </div>
        </section>

        {/* Frame 08 — Engineering Becomes Form */}
        <section className="relative min-h-[130vh] flex items-center justify-center overflow-hidden">
          <div
            className={`absolute inset-0 opacity-0 ${styles.gridMask}`}
            data-reveal
            data-op="0.5"
            style={{
              backgroundImage:
                "linear-gradient(rgba(120,170,235,.05) 1px, transparent 1px),linear-gradient(90deg, rgba(120,170,235,.05) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
          <div
            className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 w-[clamp(560px,72vw,1240px)] max-sm:w-[clamp(340px,90vw,560px)] drop-shadow-[0_0_26px_rgba(201,150,46,.28)]"
            data-par="-26"
          >
            <img
              src="/ink-origin/ornithopter.png"
              alt=""
              className="w-full block opacity-0"
              data-reveal
              data-op="0.95"
              data-dur="1.8"
            />
          </div>
          <div
            className="absolute left-[7vw] bottom-[13vh] z-30 flex flex-col gap-[11px] opacity-0"
            data-reveal
            data-op="1"
            data-dur="1"
          >
            {SHOW_FRAME_LABELS && (
              <span className="font-mono text-[12px] tracking-[0.42em] text-[rgba(214,180,110,.8)]">
                FRAME 08
              </span>
            )}
            <div className="w-[42px] h-[1px] bg-gradient-to-r from-[rgba(214,180,110,.7)] to-transparent" />
            <div className="italic font-medium text-[clamp(28px,3.8vw,48px)] leading-[1.02] text-[rgba(238,226,200,.95)]">
              Engineering Becomes Form
            </div>
          </div>
        </section>

        {/* Frame 09 — Civilization Written in Ink */}
        <section className="relative min-h-[130vh] flex items-center justify-center overflow-hidden">
          <div
            className="absolute left-[5vw] top-[16vh] w-[clamp(220px,24vw,420px)] max-sm:w-[clamp(160px,20vw,240px)] max-sm:opacity-40"
            data-par="22"
          >
            <img
              src="/ink-origin/formulas.png"
              alt=""
              className="w-full block opacity-0"
              data-reveal
              data-op="0.10"
              style={{
                filter:
                  "invert(1) sepia(.4) hue-rotate(168deg) saturate(1.3) brightness(1.05)",
              }}
            />
          </div>
          <div
            className="absolute right-[6vw] bottom-[18vh] w-[clamp(300px,32vw,560px)] max-sm:w-[clamp(200px,28vw,340px)] drop-shadow-[0_0_16px_rgba(201,150,46,.22)]"
            data-par="-30"
          >
            <img
              src="/ink-origin/ornithopter.png"
              alt=""
              className="w-full block opacity-0"
              data-reveal
              data-op="0.4"
              data-dur="1.8"
            />
          </div>
          <div
            className="absolute left-[14vw] bottom-[14vh] w-[clamp(180px,18vw,300px)] max-sm:hidden"
            data-par="18"
          >
            <img
              src="/ink-origin/formulas.png"
              alt=""
              className="w-full block opacity-0 scale-x-[-1]"
              data-reveal
              data-op="0.12"
              style={{
                filter:
                  "invert(1) sepia(.5) hue-rotate(215deg) saturate(1.2) brightness(1.0)",
              }}
            />
          </div>
          <div
            className="absolute left-1/2 bottom-[12vh] -translate-x-1/2 z-30 flex flex-col gap-[11px] items-center text-center opacity-0 w-full px-4"
            data-reveal
            data-op="1"
            data-dur="1"
          >
            {SHOW_FRAME_LABELS && (
              <span className="font-mono text-[12px] tracking-[0.42em] text-[rgba(150,178,220,.72)]">
                FRAME 09
              </span>
            )}
            <div className="w-[42px] h-[1px] bg-gradient-to-r from-transparent via-[rgba(150,178,220,.6)] to-transparent" />
            <div className="italic font-medium text-[clamp(28px,3.8vw,48px)] leading-[1.02] text-[rgba(236,233,224,.94)]">
              Civilization Written in Ink
            </div>
          </div>
        </section>

        {/* Frame 10 — Final Ink Landing / Brand Reveal */}
        <section className="landing-section relative min-h-[150vh] flex items-end justify-center overflow-hidden">
          <div
            className="absolute left-0 right-0 bottom-0 h-[42vh] opacity-0"
            data-reveal
            data-op="1"
            style={{
              background:
                "radial-gradient(80% 120% at 50% 120%, rgba(95,140,255,.16), transparent 70%)," +
                "radial-gradient(50% 90% at 50% 118%, rgba(155,92,255,.14), transparent 72%)",
            }}
          />
          <div
            className="absolute left-1/2 bottom-[24vh] -translate-x-1/2 w-[46vw] h-[1px] opacity-0"
            data-reveal
            data-op="0.6"
            style={{
              background:
                "linear-gradient(90deg,transparent,rgba(150,178,220,.5),transparent)",
            }}
          />
          <div
            className="absolute left-1/2 bottom-[9vh] -translate-x-1/2 z-30 flex flex-col gap-[11px] items-center text-center w-full px-4 opacity-0"
            data-reveal
            data-op="1"
            data-dur="1"
          >
            {SHOW_FRAME_LABELS && (
              <span className="font-mono text-[12px] tracking-[0.42em] text-[rgba(150,178,220,.72)]">
                FRAME 10
              </span>
            )}
            <div className="w-[42px] h-[1px] bg-gradient-to-r from-transparent via-[rgba(150,178,220,.6)] to-transparent" />
            <div className="italic font-medium text-[clamp(28px,3.8vw,48px)] leading-[1.02] text-[rgba(236,233,224,.94)]">
              The Ink Lands
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
