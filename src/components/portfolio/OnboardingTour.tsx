import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const STORAGE_KEY = "portfolio.onboarding.v1";

type Step = {
  title: string;
  body: string;
  targetId: string;
  hint: string;
  placement?: "top" | "bottom";
};

const STEPS: Step[] = [
  {
    title: "Welcome — quick tour",
    body: "Three short tips so you don't miss the interactive bits. Takes ~10 seconds.",
    targetId: "__top",
    hint: "Step 1 of 3",
    placement: "bottom",
  },
  {
    title: "Hover the constellation",
    body: "In 02 — Core Expertise, move your cursor across the field. Nodes drift, repel, and reveal each skill on hover.",
    targetId: "stack",
    hint: "Step 2 of 3 · try hovering a node",
    placement: "top",
  },
  {
    title: "Open a case study",
    body: "In 03 — Selected Work, click any project card to expand a full cinematic case study with architecture & impact.",
    targetId: "vault",
    hint: "Step 3 of 3 · click a card to inspect",
    placement: "top",
  },
];

export function OnboardingTour() {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [vw, setVw] = useState(() => (typeof window === "undefined" ? 1024 : window.innerWidth));
  const [vh, setVh] = useState(() => (typeof window === "undefined" ? 768 : window.innerHeight));

  useEffect(() => {
    const onResize = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setActive(true), reduce ? 400 : 2200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!active) return;
    const id = STEPS[step].targetId;
    if (id === "__top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      const buildFake = (): DOMRect => {
        const w = Math.min(520, window.innerWidth - 48);
        return {
          left: (window.innerWidth - w) / 2,
          top: 100,
          width: w,
          height: 180,
          right: 0,
          bottom: 0,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        } as DOMRect;
      };
      const measure = () => setRect(buildFake());
      measure();
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    const measure = () => setRect(target.getBoundingClientRect());
    const t = setTimeout(measure, 450);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
    };
  }, [active, step]);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setActive(false);
  };

  const next = () => {
    void import("./sfx").then((m) => m.play("transition"));
    if (step >= STEPS.length - 1) dismiss();
    else setStep((s) => s + 1);
  };

  if (!active) return null;
  const current = STEPS[step];

  // tooltip position — on narrow screens render as a bottom sheet for guaranteed fit
  const place = current.placement ?? "bottom";
  const isNarrow = vw < 640;
  const cardW = isNarrow ? Math.min(vw - 16, 380) : 360;
  const halfW = cardW / 2 + 12;
  const top = isNarrow
    ? Math.max(16, vh - 280)
    : rect
      ? place === "bottom"
        ? Math.min(vh - 240, rect.bottom + 16)
        : Math.max(16, rect.top - 220)
      : 80;
  const leftRaw = rect ? rect.left + rect.width / 2 : vw / 2;
  const left = isNarrow
    ? vw / 2
    : Math.max(halfW, Math.min(vw - halfW, leftRaw));

  return (
    <AnimatePresence>
      <motion.div
        key="tour-root"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="pointer-events-none fixed inset-0 z-[250]"
      >
        {/* dim + spotlight */}
        <svg className="absolute inset-0 h-full w-full">
          <defs>
            <mask id="tour-mask">
              <rect width="100%" height="100%" fill="white" />
              {rect && (
                <motion.rect
                  initial={false}
                  animate={{
                    x: rect.left - 12,
                    y: rect.top - 12,
                    width: rect.width + 24,
                    height: rect.height + 24,
                  }}
                  transition={{ type: "spring", stiffness: 160, damping: 22 }}
                  rx={20}
                  ry={20}
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(0,0,0,0.62)"
            mask="url(#tour-mask)"
          />
        </svg>

        {/* spotlight ring */}
        {rect && (
          <motion.div
            initial={false}
            animate={{
              x: rect.left - 12,
              y: rect.top - 12,
              width: rect.width + 24,
              height: rect.height + 24,
            }}
            transition={{ type: "spring", stiffness: 160, damping: 22 }}
            className="absolute rounded-[20px] border border-neon/60"
            style={{ boxShadow: "0 0 40px -4px var(--neon), inset 0 0 40px -10px var(--neon)" }}
          />
        )}

        {/* tooltip card */}
        <motion.div
          key={`card-${step}`}
          initial={{ opacity: 0, y: place === "bottom" ? -10 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
          style={{ top, left, width: cardW, transform: "translateX(-50%)" }}
          className="pointer-events-auto absolute rounded-2xl border border-cream/15 bg-background/90 p-5 backdrop-blur-xl"
        >
          <div className="absolute inset-0 -z-10 rounded-2xl"
               style={{ boxShadow: "0 30px 80px -20px rgba(0,0,0,0.6), 0 0 0 1px var(--neon) inset" }} />
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-neon">
              ◍ {current.hint}
            </span>
            <button
              onClick={dismiss}
              className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition hover:text-cream"
            >
              skip
            </button>
          </div>
          <h3 className="text-display mt-3 text-xl text-foreground">{current.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{current.body}</p>

          <div className="mt-5 flex items-center justify-between">
            <div className="flex gap-1.5">
              {STEPS.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 w-6 rounded-full transition ${
                    i === step ? "bg-neon shadow-[0_0_8px_var(--neon)]" : "bg-cream/15"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="rounded-full border border-neon/50 bg-neon/10 px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest text-neon transition hover:bg-neon/20"
            >
              {step >= STEPS.length - 1 ? "Got it →" : "Next →"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
