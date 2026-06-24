"use client";

import { services } from "@/data/staticData";
import { useKineticType } from "@/hooks/useKineticType";
import { usePopup } from "@/hooks/usePopup";
import { buildPopupFromService } from "@/lib/popupMappers";

export default function ServicesSection() {
    const containerRef = useKineticType();
    const { openPopup } = usePopup();

    return (
        <div id="services" ref={containerRef as any} className="scroll-mt-24 min-h-[100svh] flex flex-col justify-center pt-24 pb-24 px-6 md:px-12 lg:px-24 relative isolate pointer-events-none">
            <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col pointer-events-auto">
                
                {/* Minimal Section Header */}
                <div className="mask-container mb-12 md:mb-20">
                    <span className="clip-reveal inline-block text-white/50 text-xs tracking-[0.4em] uppercase font-[family-name:var(--font-inter)]">
                        Intelligent Services
                    </span>
                </div>
                
                {/* Minimalist Awwwards List */}
                <div className="flex flex-col border-t border-white/20">
                    {services.map((service, i) => {
                        const delayClass = `delay-${((i % 5) + 1) * 100}`;
                        return (
                            <div
                                key={i}
                                onClick={() => openPopup(buildPopupFromService(service))}
                                className={`group cursor-pointer relative py-6 md:py-8 lg:py-10 border-b border-white/20 hover:border-white transition-colors duration-500 overflow-hidden interactive`}
                            >
                                {/* Hover background reveal */}
                                <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none" />
                                
                                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8 mask-container">
                                    <h3 
                                        className={`clip-reveal ${delayClass} text-2xl md:text-4xl lg:text-5xl font-[family-name:var(--font-podium)] text-white uppercase tracking-tighter mix-blend-difference group-hover:translate-x-4 transition-transform duration-500`}
                                    >
                                        {service.title}
                                    </h3>
                                    
                                    <p 
                                        className={`clip-reveal ${delayClass} text-white/50 text-sm md:text-base font-[family-name:var(--font-inter)] md:max-w-xs lg:max-w-sm font-light leading-relaxed group-hover:text-white/80 transition-colors duration-500`}
                                    >
                                        {service.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
