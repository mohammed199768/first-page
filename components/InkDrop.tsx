import React from "react";
import styles from "./InkOriginCinematic.module.css";

export const InkDrop = () => {
  return (
    <div className={styles.inkDropContainer}>
      <div className={styles.inkDropSvgWrap}>
        <svg
          width="48"
          height="64"
          viewBox="-30 -42 60 84"
          style={{ display: "block", overflow: "visible" }}
        >
          <defs>
            <radialGradient id="inkBody" cx="42%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#1e2030" />
              <stop offset="20%" stopColor="#0e1018" />
              <stop offset="60%" stopColor="#04050a" />
              <stop offset="100%" stopColor="#010103" />
            </radialGradient>
            {/* Subtle violet rim light */}
            <radialGradient id="rimGlow" cx="50%" cy="80%" r="60%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="70%" stopColor="transparent" />
              <stop offset="100%" stopColor="rgba(120,100,200,0.08)" />
            </radialGradient>
          </defs>
          {/* Drop body */}
          <path
            d="M0,-34 C12,-12 24,4 24,18 A24,24 0 1 1 -24,18 C-24,4 -12,-12 0,-34 Z"
            fill="url(#inkBody)"
          />
          {/* Very subtle rim stroke */}
          <path
            d="M0,-34 C12,-12 24,4 24,18 A24,24 0 1 1 -24,18 C-24,4 -12,-12 0,-34 Z"
            fill="none"
            stroke="rgba(130,150,220,0.12)"
            strokeWidth="0.6"
          />
          {/* Rim glow overlay */}
          <path
            d="M0,-34 C12,-12 24,4 24,18 A24,24 0 1 1 -24,18 C-24,4 -12,-12 0,-34 Z"
            fill="url(#rimGlow)"
          />
          {/* White highlight — subtle, small */}
          <ellipse
            cx="-8"
            cy="2"
            rx="3.5"
            ry="9"
            fill="rgba(255,255,255,0.18)"
            transform="rotate(-22 -8 2)"
          />
          {/* Tiny specular dot */}
          <circle cx="7" cy="-6" r="0.8" fill="rgba(255,255,255,0.35)" />
        </svg>
      </div>
    </div>
  );
};
