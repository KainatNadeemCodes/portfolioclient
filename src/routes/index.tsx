import { createFileRoute } from "@tanstack/react-router";
import { ShaderBackground } from "@/components/portfolio/ShaderBackground";
import { Nav } from "@/components/portfolio/Nav";
import { Hero } from "@/components/portfolio/Hero";
import { Summary } from "@/components/portfolio/Summary";
import { TechStack } from "@/components/portfolio/TechStack";
import { ProjectVault } from "@/components/portfolio/ProjectVault";
import { Certifications } from "@/components/portfolio/Certifications";
import { Timeline } from "@/components/portfolio/Timeline";
import { ContactTerminal } from "@/components/portfolio/ContactTerminal";
import { CustomCursor } from "@/components/portfolio/CustomCursor";
import { SectionSeam } from "@/components/portfolio/CinematicSection";
import { BootSequence } from "@/components/portfolio/BootSequence";
import { OnboardingTour } from "@/components/portfolio/OnboardingTour";
import { Human } from "@/components/portfolio/Human";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Muhammad Abdullah — Data Scientist & Applied AI Engineer" },
      {
        name: "description",
        content:
          "Portfolio of Muhammad Abdullah — Data Scientist & Applied AI Engineer shipping LLM, NLP, deep learning and financial risk systems. Published research on cost-sensitive ML.",
      },
      { property: "og:title", content: "Muhammad Abdullah — Data Scientist & Applied AI Engineer" },
      {
        property: "og:description",
        content:
          "Multilingual LLM assistants, credit risk, time-series forecasting and medical CNNs — production-grade applied AI with published research.",
      },
    ],
  }),
});

function Index() {
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <BootSequence />
      <OnboardingTour />
      <CustomCursor />
      <ShaderBackground />
      <div className="relative z-10">
        <Nav />
        <Hero />
        <SectionSeam />
        <Summary />
        <SectionSeam />
        <TechStack />
        <SectionSeam />
        <ProjectVault />
        <SectionSeam />
        <Human />
        <SectionSeam />
        <Certifications />
        <SectionSeam />
        <Timeline />
        <SectionSeam />
        <ContactTerminal />
      </div>
    </main>
  );
}
