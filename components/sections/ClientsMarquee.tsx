// ============================================================================
// ARCHITECTURAL INTENT: Clients Section with Dual Rendering
// ============================================================================
// Displays client logos with either 3D orbital scene (desktop) or grid (touch).
//
// DUAL RENDERING PATTERN:
// - Desktop cinematic + render3D: OrbitalClientsScene (3D)
// - Touch/native scroll: Static grid layout
//
// DATA FLOW:
// - INPUT: clients (static data), useResponsiveMode (device detection)
// - OUTPUT: Grid or 3D scene based on device capabilities
// - INTERACTION: Click opens associated project popup
//
// PERFORMANCE STRATEGY:
// - Dynamic import: OrbitalClientsScene loaded only when show3D === true
// - SSR disabled for 3D scene (ssr: false)
// - Loading placeholder during code-split loading
//
// SAFARI OPTIMIZATION:
// - Detects Safari for filter adjustments
// - Safari: opacity-based instead of grayscale (performance)
//
// CRITICAL DECISIONS:
// - Dual layout not conditional rendering within single component
// - 3D scene pointer-events-auto (clickable)
// - Grid uses popup system (not routing)
//
// EVIDENCE: Part of 9D sections, popup integration pattern
// ============================================================================

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { clients } from "@/data/clients";
import { usePopup } from "@/hooks/usePopup";
import { buildPopupFromProject } from "@/lib/popupMappers";
import { projects } from "@/data/projects";
import { useResponsiveMode } from "@/hooks/useResponsiveMode";

// ARCHITECTURAL DECISION: Dynamic import for code-splitting
// 3D scene only loaded when show3D === true (desktop cinematic mode)
const OrbitalClientsScene = dynamic(() => import("./clients/OrbitalClientsScene"), {
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center text-white/20">Loading Orbital System...</div>
});

export default function ClientsSection() {
    const router = useRouter();
    const { openPopup } = usePopup();
    const { hasTouch, render3D, scrollMode } = useResponsiveMode();

    // Safari detection for performance and rendering optimization
    const isSafari = typeof navigator !== 'undefined' && 
                     /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    // Show 3D only on desktop cinematic mode with render3D enabled
    const show3D = render3D && scrollMode === "cinematic";
    // Show grid on touch devices, native scroll mode, or if 3D is disabled
    const showGrid = hasTouch || scrollMode === "native" || !show3D;

    return (
        <section className="min-h-[100dvh] w-full flex items-start relative overflow-visible pt-0">

            {/* 1. 3D BACKGROUND LAYER (Active on Desktop cinematic mode) */}
            {show3D && (
                <div className="absolute inset-0 z-0 overflow-visible pointer-events-auto">
                     <OrbitalClientsScene />
                </div>
            )}

            {/* 2. CONTENT LAYER (z-10) */}
            <div className="w-full h-full flex flex-col lg:flex-row relative z-10 pointer-events-none overflow-visible">

                {/* Left Column: Title */}
                <div className="w-full lg:w-1/3 p-6 md:p-12 flex flex-col justify-start pt-16 md:pt-20 pb-8 relative z-20 bg-transparent pointer-events-auto mt-24">
                    <div className="relative">
                        <h6 className="text-sm font-[family-name:var(--font-inter)] text-white/50 uppercase tracking-[0.4em] mb-4">
                            Partners
                        </h6>
                        <h3 className="text-[clamp(3rem,6vw,6rem)] font-[family-name:var(--font-podium)] leading-[0.85] uppercase text-white mix-blend-difference">
                            Our <br /> Clients
                        </h3>
                    </div>
                </div>

                {/* Right Column: Interaction Area */}
                <div className="w-full lg:w-2/3 relative min-h-[500px] lg:min-h-screen">
                    
                    {/* Grid for touch/native scroll mode */}
                    {showGrid && (
                        <div className="w-full h-full pointer-events-auto mt-24 lg:mt-0">
                            <div className="grid grid-cols-2 md:grid-cols-4 h-full">
                                {clients.slice(0, 16).map((client) => (
                                    <div
                                        key={client.id}
                                        onClick={() => {
                                            if (client.projectSlug) {
                                                const project = projects.find(p => p.slug === client.projectSlug);
                                                if (project) {
                                                    openPopup(buildPopupFromProject(project));
                                                    return;
                                                }
                                            }
                                            const randomProject = projects[Math.floor(Math.random() * projects.length)];
                                            if (randomProject) {
                                                openPopup(buildPopupFromProject(randomProject));
                                            }
                                        }}
                                        className={`group relative min-h-[160px] lg:min-h-[25vh] flex items-center justify-center p-8 transition-all duration-500 overflow-visible cursor-pointer interactive magnetic hover:z-30`}
                                    >
                                        <div className={`relative z-10 w-full h-full flex items-center justify-center transition-all duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-2
                                            ${isSafari ? 'opacity-40 group-hover:opacity-100' : ''}
                                            ${!isSafari ? 'grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100' : ''}`}>
                                            <Image
                                                src={client.logo}
                                                alt={client.name || "Client Logo"}
                                                fill
                                                className={`object-contain transition-all duration-500 ${
                                                    isSafari ? 'safari-logo-fix' : 'brightness-0 invert'
                                                }`}
                                                sizes="(max-width: 768px) 50vw, 25vw"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
