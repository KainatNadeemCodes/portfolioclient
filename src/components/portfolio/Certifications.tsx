import { Award } from "lucide-react";
import { SectionLabel } from "./Summary";
import { CinematicSection, ParallaxLayer } from "./CinematicSection";

const certs = [
  { title: "AWS Certified Machine Learning — Specialty", issuer: "Amazon Web Services", year: "2025" },
  { title: "Anthropic AI Agents", issuer: "Anthropic Academy", year: "2025" },
  { title: "CS205 · Building with Artificial Intelligence", issuer: "Saylor Academy", year: "2025" },
  { title: "IBM Data Science Fundamentals", issuer: "IBM", year: "2025" },
  { title: "Google Data Analytics Professional", issuer: "Google", year: "2025" },
];

export function Certifications() {
  // duplicate the list for seamless marquee
  const loop = [...certs, ...certs];

  return (
    <CinematicSection id="certs" className="relative py-32">
      {({ progress }) => (
        <>
          <ParallaxLayer progress={progress} depth={-0.4}>
            <div className="mx-auto max-w-6xl px-6">
              <SectionLabel index="04" label="Credentials" />
              <h2 className="text-display mt-6 text-4xl sm:text-5xl md:text-6xl">
                Verified · <span className="neon-text">2025</span>
              </h2>
            </div>
          </ParallaxLayer>

          <ParallaxLayer progress={progress} depth={0.3} drift={40}>
            <div className="relative mt-14 overflow-hidden">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-background to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-background to-transparent" />

              <div className="marquee flex w-max gap-4">
                {loop.map((c, i) => (
                  <div
                    key={i}
                    className="glass glow-hover group flex w-72 shrink-0 flex-col rounded-2xl p-5"
                  >
                    <div className="flex items-center justify-between">
                      <Award className="h-5 w-5 text-neon transition-transform group-hover:rotate-6 group-hover:scale-110" />
                      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        {c.year}
                      </span>
                    </div>
                    <div className="mt-8">
                      <div className="font-mono text-[10px] uppercase tracking-widest text-neon">
                        {c.issuer}
                      </div>
                      <div className="mt-1 text-lg font-semibold text-foreground">{c.title}</div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="h-1 w-1 rounded-full bg-neon-alt shadow-[0_0_8px_var(--neon-alt)]" />
                      Verified credential
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ParallaxLayer>
        </>
      )}
    </CinematicSection>
  );
}
