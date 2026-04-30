import { motion } from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import { Magnetic } from "./Magnetic";
import { DecodingBackground } from "./DecodingBackground";

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden px-6 pb-12 pt-32 sm:px-10">
      <DecodingBackground />
      {/* Top corner micro-labels (Shader-style scroll cue) */}
      <div className="mx-auto flex w-full max-w-[1400px] items-start justify-between">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="micro-label flex items-center gap-2"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-neon" />
          </span>
          <span>Available · 2026</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="micro-label hidden text-right sm:block"
        >
          Sahiwal · Punjab, PK
          <br />
          37° · Clear
        </motion.div>
      </div>

      {/* Massive sculptural headline */}
      <div className="mx-auto w-full max-w-[1400px]">
        <h1 className="text-display text-foreground">
          {[
            { word: "Decoding", className: "" },
            { word: "the Future", className: "text-serif italic font-normal text-cream/90" },
            { word: "through Data.", className: "" },
          ].map((item, i) => (
            <motion.span
              key={item.word}
              initial={{ opacity: 0, y: 80, filter: "blur(24px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.1, delay: 0.25 + i * 0.18, ease: [0.2, 0.8, 0.2, 1] }}
              className={`block text-[14vw] leading-[0.85] sm:text-[12vw] md:text-[10.5vw] ${item.className}`}
            >
              {item.word}
            </motion.span>
          ))}
        </h1>
      </div>

      {/* Bottom rail */}
      <div className="mx-auto mt-16 flex w-full max-w-[1400px] flex-col gap-10 sm:mt-20 sm:flex-row sm:items-end sm:justify-between">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.05 }}
          className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base"
        >
          Muhammad Abdullah — Data Scientist & Applied AI Engineer building
          production-grade NLP, deep learning and risk systems that turn raw
          signal into business decisions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.2 }}
          className="flex flex-col items-start gap-4 sm:items-end"
        >
          <Magnetic strength={18} innerStrength={0.5}>
            <a
              href="#vault"
              className="focus-glow group inline-flex items-center gap-3 rounded-full border border-cream/15 bg-background/40 px-6 py-3 text-sm font-medium text-foreground backdrop-blur-md transition-all hover:border-neon/60 hover:bg-neon/5"
            >
              <span>Inspect selected work</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neon text-primary-foreground transition-transform group-hover:rotate-[-45deg]">
                <ArrowDownRight className="h-3.5 w-3.5" />
              </span>
            </a>
          </Magnetic>
          <span className="micro-label">Scroll ↓</span>
        </motion.div>
      </div>
    </section>
  );
}
