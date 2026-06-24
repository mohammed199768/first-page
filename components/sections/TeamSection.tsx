"use client";

import { useKineticType } from "@/hooks/useKineticType";
import { team } from "@/data/staticData";
import { usePopup } from "@/hooks/usePopup";
import { buildPopupFromTeamMember } from "@/lib/popupMappers";

export default function TeamSection() {
    const containerRef = useKineticType();
    const { openPopup } = usePopup();

    return (
        <section 
            id="team" 
            ref={containerRef as any} 
            className="scroll-mt-24 min-h-[100svh] flex flex-col justify-center items-start pt-12 pb-8 w-full relative overflow-visible pointer-events-none"
            style={{ paddingLeft: 'var(--container-padding)', paddingRight: 'var(--container-padding)' }}
        >
            <div className="w-full max-w-7xl mx-auto pointer-events-auto mt-24">
                <div className="mask-container mb-12 md:mb-20">
                    <span className="clip-reveal inline-block text-white/50 text-xs sm:text-sm font-[family-name:var(--font-inter)] tracking-[0.4em] uppercase">
                        The Vanguard
                    </span>
                </div>
                
                <div className="flex flex-col w-full">
                    {team.map((member, idx) => (
                        <div
                            key={idx}
                            onClick={() => openPopup(buildPopupFromTeamMember(member))}
                            className="mask-container border-b border-white/10 pb-6 mb-6 group interactive magnetic cursor-pointer hover:bg-white/5 transition-colors duration-500 flex flex-col px-4"
                        >
                            <div className={`clip-reveal delay-${(idx + 1) * 100} flex flex-col md:flex-row md:items-baseline justify-between w-full`}>
                                <h3 className="text-[clamp(2rem,5vw,5rem)] leading-none font-[family-name:var(--font-podium)] text-white/80 mix-blend-difference uppercase group-hover:text-white group-hover:translate-x-4 transition-all duration-500">
                                    {member.name}
                                </h3>
                                <span className="text-white/40 font-[family-name:var(--font-inter)] text-xs md:text-sm tracking-[0.3em] uppercase group-hover:text-accentPurple transition-colors duration-500 mt-2 md:mt-0">
                                    {member.role}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
