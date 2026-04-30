import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { CinematicSection, ParallaxLayer } from "./CinematicSection";

export function Summary() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  // Headline letters for staggered reveal
  const headline = "I build AI systems that don't just predict — they influence decisions.";
  const tokens = headline.split(/(\s+)/); // keep spaces
  // Words that get the gold accent (match exactly, ignoring trailing punctuation)
  const accentSet = new Set(["AI", "systems", "decisions"]);

  return (
    <CinematicSection id="summary" className="relative px-6 py-32">
      {({ progress }) => (
        <div className="mx-auto max-w-5xl">
          {/* [01] index — fades in */}
          <ParallaxLayer progress={progress} depth={-0.4}>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              <SectionLabel index="01" label="Engineering Intelligence" />
            </motion.div>
          </ParallaxLayer>

          {/* Headline — staggered reveal with gold accents */}
          <ParallaxLayer progress={progress} depth={0.18}>
            <div ref={ref} className="mt-10">
              <h2 className="text-display text-3xl leading-[1.1] text-foreground sm:text-5xl md:text-[3.25rem]">
                {tokens.map((tok, i) => {
                  if (/^\s+$/.test(tok)) return <span key={i}>{tok}</span>;
                  const bare = tok.replace(/[^A-Za-z]/g, "");
                  const isAccent = accentSet.has(bare);
                  return (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
                      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                      transition={{
                        duration: 0.7,
                        delay: 0.4 + i * 0.035,
                        ease: [0.2, 0.8, 0.2, 1],
                      }}
                      className={
                        isAccent
                          ? "text-neon [text-shadow:0_0_24px_color-mix(in_oklab,var(--neon)_45%,transparent)]"
                          : ""
                      }
                    >
                      {tok}
                    </motion.span>
                  );
                })}
              </h2>
            </div>
          </ParallaxLayer>

          {/* Body — two paragraphs, muted with gold key terms */}
          <ParallaxLayer progress={progress} depth={0.32}>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 1.4, ease: "easeOut" }}
              className="mt-12 grid gap-8 text-lg leading-relaxed text-muted-foreground sm:text-xl md:grid-cols-2 md:text-[1.35rem] md:leading-[1.55]"
            >
              <p>
                Specialising in{" "}
                <span className="text-foreground">NLP</span>,{" "}
                <span className="text-foreground">deep learning</span>, and
                business-focused machine learning, I develop production-grade
                solutions — from{" "}
                <TahqiqHover>
                  <span className="cursor-help underline decoration-neon/40 decoration-dotted underline-offset-[6px] transition-colors hover:decoration-neon">
                    <span className="text-neon [text-shadow:0_0_18px_color-mix(in_oklab,var(--neon)_45%,transparent)]">
                      LLM
                    </span>
                    <span className="text-foreground">-powered assistants</span>
                  </span>
                </TahqiqHover>{" "}
                to financial forecasting systems.
              </p>
              <p>
                My work extends into research on{" "}
                <span className="text-foreground">cost-sensitive predictive modelling</span>
                , optimising how businesses act on data.
              </p>
            </motion.div>
          </ParallaxLayer>
        </div>
      )}
    </CinematicSection>
  );
}

/* ---------- Tahqiq AI hover preview card ---------- */
function TahqiqHover({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.span
            initial={{ opacity: 0, y: 12, scale: 0.96, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 8, scale: 0.97, filter: "blur(6px)" }}
            transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
            className="pointer-events-none absolute left-1/2 top-full z-50 mt-4 w-[280px] -translate-x-1/2 rounded-xl border border-neon/30 bg-background/85 p-4 text-left shadow-[0_20px_60px_-20px_color-mix(in_oklab,var(--neon)_40%,transparent)] backdrop-blur-xl sm:w-[320px]"
          >
            {/* connector tick */}
            <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-neon/30 bg-background/85" />
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neon">
                Project · 01
              </span>
              <span className="h-px flex-1 bg-neon/30" />
            </div>
            <div className="mt-3 text-base font-semibold text-foreground">
              Tahqiq AI
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              Multilingual LLM research assistant — RAG over Urdu & English
              corpora with citation-grade responses.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["LLM", "RAG", "LangChain", "Urdu/EN"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-cream/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

export function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.32em]">
      <span className="text-neon [text-shadow:0_0_14px_color-mix(in_oklab,var(--neon)_55%,transparent)]">
        {index}
      </span>
      <span className="text-neon/70">—</span>
      <span className="text-muted-foreground">{label}</span>
      <span className="ml-2 hidden h-px w-12 bg-neon/30 sm:inline-block" />
    </div>
  );
}
