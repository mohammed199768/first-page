"use client";

import { useKineticType } from "@/hooks/useKineticType";

export default function AboutSection() {
    const containerRef = useKineticType();

    return (
        <section 
            ref={containerRef as any} 
            className="scroll-mt-24 w-full min-h-[100svh] flex flex-col justify-center pt-24 pb-24 px-6 md:px-12 lg:px-24 relative isolate z-10 pointer-events-none"
        >
            <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 pointer-events-auto">
                
                {/* Massive Kinetic Typography Block */}
                <div className="flex flex-col gap-8 md:w-3/5 text-left">
                    <div className="mask-container mb-4">
                        <span className="clip-reveal inline-block text-white/50 text-xs tracking-[0.4em] uppercase font-[family-name:var(--font-inter)]">About Inkspire</span>
                    </div>

                    <h2 className="font-[family-name:var(--font-podium)] text-[clamp(2.5rem,6vw,6rem)] leading-[0.9] text-white uppercase mix-blend-difference">
                        <div className="mask-container">
                            <span className="clip-reveal delay-100">Inspired by</span>
                        </div>
                        <div className="mask-container text-white/30">
                            <span className="clip-reveal delay-200">Raw Ink.</span>
                        </div>
                    </h2>

                    <div className="font-[family-name:var(--font-inter)] text-white/70 text-lg sm:text-xl md:text-2xl font-light leading-relaxed max-w-xl">
                        <div className="mask-container">
                            <span className="clip-reveal delay-300">We craft brands with intention.</span>
                        </div>
                        <div className="mask-container mt-2">
                            <span className="clip-reveal delay-400">Every line, every word,</span>
                        </div>
                        <div className="mask-container">
                            <span className="clip-reveal delay-500">every visual.</span>
                        </div>
                    </div>
                </div>

                {/* Brutalist Video/Image Block */}
                <div className="w-full md:w-2/5 aspect-[3/4] relative overflow-hidden group mask-container">
                    <div className="clip-reveal delay-500 w-full h-full relative">
                        <video
                            className="w-full h-full object-cover grayscale opacity-60 mix-blend-screen transition-all duration-1000 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                            src="/1_2.webm"
                            autoPlay
                            muted
                            loop
                            playsInline
                        />
                        <div className="absolute inset-0 border border-white/20 pointer-events-none" />
                    </div>
                </div>

            </div>
        </section>
    );
}
