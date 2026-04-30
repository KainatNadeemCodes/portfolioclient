import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import portrait from "@/assets/portrait.jpg";
import { CinematicSection, ParallaxLayer } from "./CinematicSection";

/**
 * Personal "Human" interlude — a short story moment between the technical sections.
 * Uses an RGB-split glitch effect over a portrait.
 */
export function Human() {
  const reduce = !!useReducedMotion();
  const [glitching, setGlitching] = useState(false);

  // Periodic involuntary glitch flicker (skipped under reduced motion)
  useEffect(() => {
    if (reduce) return;
    let t: ReturnType<typeof setTimeout>;
    const loop = () => {
      const wait = 2400 + Math.random() * 4800;
      t = setTimeout(() => {
        setGlitching(true);
        setTimeout(() => setGlitching(false), 180 + Math.random() * 220);
        loop();
      }, wait);
    };
    loop();
    return () => clearTimeout(t);
  }, [reduce]);

  return (
    <CinematicSection id="human" className="relative px-6 py-32">
      {({ progress }) => (
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 md:grid-cols-12">
            {/* Portrait with glitch layers */}
            <ParallaxLayer
              progress={progress}
              depth={-0.4}
              className="md:col-span-5"
            >
              <div
                className={`glitch-frame group relative mx-auto aspect-[3/4] w-full max-w-[380px] overflow-hidden rounded-2xl border border-cream/10 ${
                  glitching ? "is-glitching" : ""
                }`}
                onPointerEnter={() => !reduce && setGlitching(true)}
                onPointerLeave={() => setGlitching(false)}
                onPointerDown={() => {
                  if (reduce) return;
                  setGlitching(true);
                  setTimeout(() => setGlitching(false), 600);
                }}
              >
                <img
                  src={portrait}
                  alt="Portrait of Muhammad Abdullah"
                  loading="lazy"
                  width={896}
                  height={1152}
                  className="glitch-base h-full w-full object-cover grayscale"
                />
                <img
                  src={portrait}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="glitch-r pointer-events-none absolute inset-0 h-full w-full object-cover"
                />
                <img
                  src={portrait}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="glitch-b pointer-events-none absolute inset-0 h-full w-full object-cover"
                />
                <div className="glitch-scan pointer-events-none absolute inset-0" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 font-mono text-[9px] uppercase tracking-[0.35em] text-neon">
                  ◍ signal · stable
                </div>
              </div>
            </ParallaxLayer>

            {/* Story copy */}
            <ParallaxLayer
              progress={progress}
              depth={0.2}
              className="md:col-span-7"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.45em] text-neon">
                ✦ off-record — the human behind the system
              </div>
              <h2 className="text-display mt-4 text-4xl leading-[1.05] text-foreground sm:text-5xl">
                I build models <span className="neon-text">because people</span> trust them with real decisions.
              </h2>

              <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6 }}
                >
                  I grew up in <span className="text-cream">Sahiwal</span>, a small city
                  in Punjab where information moved slower than ambition. I learned
                  early that a good model isn't the cleverest one — it's the one
                  someone can defend in a room full of stakeholders.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6, delay: 0.12 }}
                >
                  My work sits at the seam between research and production:
                  <span className="text-cream"> cost-sensitive learning</span>,
                  multilingual <span className="text-cream">LLM systems</span>,
                  and forecasting that survives contact with reality.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6, delay: 0.24 }}
                >
                  Outside the terminal — long walks, longer reading lists, and the
                  quiet conviction that <span className="neon-text">systems should serve people</span>,
                  not the other way around.
                </motion.p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                <span><span className="text-neon">◌</span> based · sahiwal, pk</span>
                <span><span className="text-neon">◌</span> currently · open to roles</span>
                <span><span className="text-neon">◌</span> mode · deep work</span>
              </div>
            </ParallaxLayer>
          </div>
        </div>
      )}
    </CinematicSection>
  );
}
