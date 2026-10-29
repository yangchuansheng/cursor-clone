import React from "react";
import { ChangelogSection } from "./ChangelogSection";
import { CursorFooter } from "./CursorFooter";
import { CursorHeader } from "./CursorHeader";
import { FeaturesSection } from "./FeaturesSection";
import { FinalCtaSection } from "./FinalCtaSection";
import { FrontierSection } from "./FrontierSection";
import { HeroSection } from "./HeroSection";
import { HighlightsSection } from "./HighlightsSection";
import { LogoGardenSection } from "./LogoGardenSection";
import { ResearchTeamSection } from "./ResearchTeamSection";
import { TestimonialsSection } from "./TestimonialsSection";

export function CursorHomePage() {
  return (
    <>
      <CursorHeader />
      <main id="main">
        <HeroSection />
        <LogoGardenSection />
        <FeaturesSection />
        <TestimonialsSection />
        <FrontierSection />
        <ChangelogSection />
        <ResearchTeamSection />
        <HighlightsSection />
        <FinalCtaSection />
      </main>
      <CursorFooter />
    </>
  );
}
