import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const LINES = [
  "> initializing neural runtime…",
  "> loading model weights · 1.4B params",
  "> handshake: AI gateway · OK",
  "> mounting RAG index · OK",
  "> calibrating amber phosphor…",
  "> booting interface · ready",
];

/**
 * One-shot system boot overlay shown on first paint.
 * Cinematic, ~1.4s total, then unmounts.
 */
export function BootSequence() {
  const [visible, setVisible] = useState(true);
  const [shown, setShown] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVisible(false);
      return;
    }
    let i = 0;
    const lineTimer = setInterval(() => {
      i++;
      setShown(i);
      if (i >= LINES.length) clearInterval(lineTimer);
    }, 160);

    let p = 0;
    const progTimer = setInterval(() => {
      p = Math.min(100, p + 4 + Math.random() * 8);
      setProgress(p);
      if (p >= 100) clearInterval(progTimer);
    }, 60);

    const off = setTimeout(() => setVisible(false), 1700);
    return () => {
      clearInterval(lineTimer);
      clearInterval(progTimer);
      clearTimeout(off);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black"
        >
          <div className="boot-scanline" />
          <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />

          <div className="relative w-[min(620px,90vw)] px-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.45em] text-neon">
              ◍ system · boot
            </div>
            <div className="text-display mt-3 text-3xl text-foreground sm:text-4xl">
              <span className="text-cream/90">decoding</span>{" "}
              <span className="neon-text">portfolio</span>
            </div>

            <div className="mt-6 h-[140px] overflow-hidden border-l border-neon/30 pl-4 font-mono text-[12px] leading-6 text-muted-foreground">
              {LINES.slice(0, shown).map((l, i) => (
                <motion.div
                  key={l}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className={i === shown - 1 ? "text-neon" : ""}
                >
                  {l}
                </motion.div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="relative h-[2px] w-full overflow-hidden bg-cream/10">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-neon"
                  style={{
                    width: `${progress}%`,
                    boxShadow: "0 0 12px var(--neon)",
                  }}
                />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-neon">
                {String(Math.floor(progress)).padStart(3, "0")}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
