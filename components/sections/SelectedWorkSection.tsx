"use client";

import { useKineticType } from "@/hooks/useKineticType";
import { projects } from "@/data/projects";

export default function SelectedWorkSection() {
    const containerRef = useKineticType();

    // Use a subset of projects
    const selectedWorks = projects.slice(0, 4);

    return (
        <section 
            id="work"
            ref={containerRef as any}
            className="scroll-mt-20 min-h-[100dvh] w-full flex flex-col justify-center items-start relative isolate overflow-hidden bg-transparent pointer-events-none"
            style={{ paddingLeft: 'var(--container-padding)', paddingRight: 'var(--container-padding)' }}
        >
            <div className="w-full max-w-7xl mx-auto pointer-events-auto mt-24">
                <div className="mask-container mb-12 md:mb-20">
                    <span className="clip-reveal inline-block text-white/50 text-xs sm:text-sm font-[family-name:var(--font-inter)] tracking-[0.4em] uppercase">
                        Selected Work
                    </span>
                </div>
                
                <div className="flex flex-col w-full group/list">
                    {selectedWorks.map((work, idx) => (
                        <a href={`#project-${idx}`} key={idx} className="mask-container border-t border-white/10 last:border-b py-6 md:py-10 group interactive magnetic cursor-pointer hover:bg-white/5 transition-colors duration-500 flex flex-col">
                            <div className={`clip-reveal delay-${(idx + 1) * 100} flex items-baseline justify-between w-full px-4 md:px-8`}>
                                <h2 className="text-[clamp(2.5rem,6vw,7rem)] leading-none font-[family-name:var(--font-podium)] text-white/80 mix-blend-difference uppercase group-hover:text-white group-hover:translate-x-4 md:group-hover:translate-x-8 transition-all duration-500">
                                    {work.title}
                                </h2>
                                <span className="text-white/30 font-[family-name:var(--font-inter)] text-xs md:text-sm tracking-[0.3em] group-hover:text-white transition-colors duration-500 hidden sm:block">
                                    Digital
                                </span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
