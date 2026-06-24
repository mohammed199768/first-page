import "@/styles/inkspire-cinematic-home.css";
import { InkspireCinematicHome } from "@/components/inkspire-home/InkspireCinematicHome";

// Imported legacy sections
import StatsSection from "@/components/sections/StatsSection";
import HeroScene from "@/components/sections/HeroScene";
import AboutSection from "@/components/sections/AboutSection";
import ServicesSection from "@/components/sections/ServicesSection";
import SelectedWorkSection from "@/components/sections/SelectedWorkSection";
import TeamSection from "@/components/sections/TeamSection";
import ClientsMarquee from "@/components/sections/ClientsMarquee";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import FinalCTA from "@/components/sections/FinalCTA";
import { PopupProvider } from "@/hooks/usePopup";

export default function Home() {
  return (
    <main className="w-full relative bg-[#09060f] text-white">
      {/* The Cinematic Scroll operates as a fixed background behind the legacy sections */}
      <InkspireCinematicHome>
        <PopupProvider>
          <div className="relative z-10 flex flex-col w-full overflow-hidden bg-transparent pb-32 space-y-[40vh] lg:space-y-[60vh]">
            {/* Scene 1: Frames 1-20 */}
            <div id="scene-1" className="flex flex-col space-y-[40vh] lg:space-y-[60vh] w-full">
              <HeroScene />
              <StatsSection />
            </div>

            {/* Intermission 1: Pause on Frame 20 */}
            <div id="intermission-1" className="flex flex-col space-y-[40vh] lg:space-y-[60vh] w-full">
              <AboutSection />
            </div>

            {/* Scene 2: Frames 21-40 */}
            <div id="scene-2" className="flex flex-col space-y-[40vh] lg:space-y-[60vh] w-full">
              <ServicesSection />
              <SelectedWorkSection />
            </div>

            {/* Intermission 2: Pause on Frame 40 */}
            <div id="intermission-2" className="flex flex-col space-y-[40vh] lg:space-y-[60vh] w-full">
              <TeamSection />
              <ClientsMarquee />
            </div>

            {/* Scene 3: Frames 41-68 */}
            <div id="scene-3" className="flex flex-col space-y-[40vh] lg:space-y-[60vh] w-full">
              <TestimonialsSection />
              <FinalCTA />
            </div>
          </div>
        </PopupProvider>
      </InkspireCinematicHome>
    </main>
  );
}
