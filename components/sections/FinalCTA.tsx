"use client";

import { siteContent } from "@/data/siteContent";
import { useKineticType } from "@/hooks/useKineticType";

export default function FinalCTA() {
    const containerRef = useKineticType();

    return (
        <section ref={containerRef as any} id="contact" className="scroll-mt-24 w-full min-h-[100svh] relative z-10 flex flex-col items-center justify-center text-center pt-12 sm:pt-14 md:pt-16 pb-8 lg:pb-0 overflow-visible pointer-events-none">
            {/* Background - Fully integrated with tunnel darkness */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none overflow-hidden" />

            {/* Main Content - Centered but feels boundless */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 pointer-events-auto">
                <div className="mask-container mb-10">
                    <h2 className="clip-reveal delay-100 font-[family-name:var(--font-podium)] text-6xl sm:text-7xl md:text-9xl text-white leading-none tracking-tighter uppercase mix-blend-difference">
                        {siteContent.finalCta.title}
                    </h2>
                </div>
                
                <div className="mask-container mb-16 max-w-2xl mx-auto">
                    <p className="clip-reveal delay-200 text-xl md:text-2xl text-white/50 font-light font-[family-name:var(--font-inter)]">
                        {siteContent.finalCta.description}
                    </p>
                </div>

                <div className="mask-container">
                    <a
                        href={siteContent.finalCta.buttonHref}
                        className="clip-reveal delay-300 magnetic interactive inline-flex items-center justify-center px-12 py-6 bg-white text-black rounded-full text-sm font-bold tracking-[0.2em] uppercase hover:bg-neutral-200 transition-colors duration-300 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                    >
                        {siteContent.finalCta.buttonLabel}
                    </a>
                </div>
            </div>

            <footer className="absolute bottom-6 w-full text-center text-white/30 text-xs font-[family-name:var(--font-inter)] tracking-widest uppercase">
                {siteContent.global.footerText}
            </footer>
        </section>
    );
}
