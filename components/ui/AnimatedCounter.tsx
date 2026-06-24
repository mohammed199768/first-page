"use client";

import { useRef } from "react";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";

interface AnimatedCounterProps {
    value: string;
    label: string;
}

export default function AnimatedCounter({ value, label }: AnimatedCounterProps) {
    const countRef = useRef<HTMLHeadingElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const { suffix } = useAnimatedCounter(containerRef, countRef, value);

    return (
        <div ref={containerRef} className="counter-item group relative flex flex-col justify-center items-center h-full interactive magnetic">
            <h3 ref={countRef} className="text-[clamp(4rem,8vw,8rem)] leading-none font-[family-name:var(--font-podium)] text-white mix-blend-difference mb-2 relative z-10 transition-colors">
                0{suffix}
            </h3>
            <p className="text-white/50 uppercase tracking-[0.4em] text-xs sm:text-sm font-[family-name:var(--font-inter)] relative z-10 group-hover:text-white transition-colors">{label}</p>
        </div>
    );
}
