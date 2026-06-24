"use client";

import { useKineticType } from "@/hooks/useKineticType";

export default function HeroScene() {
    const containerRef = useKineticType();

    return (
        <section 
            ref={containerRef as any}
            id="home"
            className="relative min-h-[100svh] flex flex-col justify-center items-start overflow-hidden scroll-mt-24 pointer-events-none"
            style={{ paddingLeft: 'var(--container-padding)', paddingRight: 'var(--container-padding)' }}
        >
            <div className="relative z-30 flex flex-col items-start text-left max-w-7xl mx-auto w-full mt-20 sm:mt-0 pointer-events-auto">
                
                {/* Minimal Tagline */}
                <div className="mask-container mb-6 lg:mb-8">
                    <span className="clip-reveal inline-block text-white/50 text-xs sm:text-sm font-[family-name:var(--font-inter)] tracking-[0.4em] uppercase">
                        World-Class Digital Collective
                    </span>
                </div>

                {/* Massive Kinetic Heading */}
                <div className="flex flex-col font-[family-name:var(--font-podium)] text-white uppercase leading-[0.85] tracking-tighter">
                    <div className="mask-container">
                        <span className="clip-reveal delay-100 text-[clamp(2.5rem,7vw,7rem)] mix-blend-difference">From ink</span>
                    </div>
                    <div className="mask-container">
                        <span className="clip-reveal delay-200 text-[clamp(2.5rem,7vw,7rem)] mix-blend-difference">we started,</span>
                    </div>
                    <div className="mask-container">
                        <span className="clip-reveal delay-300 text-[clamp(2.5rem,7vw,7rem)] mix-blend-difference">to make people</span>
                    </div>
                    <div className="mask-container">
                        <span className="clip-reveal delay-400 text-[clamp(2.5rem,7vw,7rem)] mix-blend-difference text-transparent bg-clip-text bg-gradient-to-b from-white to-white/30">Inkspired.</span>
                    </div>
                </div>

                {/* Minimal CTA Line */}
                <div className="mt-12 lg:mt-16 mask-container">
                    <a
                        href="#work"
                        className="clip-reveal delay-500 group interactive magnetic flex items-center gap-4 text-white hover:text-white/70 transition-colors w-max"
                    >
                        <span className="text-xs sm:text-sm font-[family-name:var(--font-inter)] tracking-[0.3em] uppercase">Enter the Void</span>
                        <div className="w-12 h-[1px] bg-white group-hover:w-20 transition-all duration-500" />
                    </a>
                </div>

            </div>
        </section>
    );
}
