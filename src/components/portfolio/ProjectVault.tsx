import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  HeartPulse,
  Languages,
  Link2,
  MessageSquareText,
  Users,
  Waves,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { SectionLabel } from "./Summary";
import { Magnetic } from "./Magnetic";

type Project = {
  id: string;
  title: string;
  tag: string;
  icon: LucideIcon;
  desc: string;
  metrics: { k: string; v: string }[];
  stack: string[];
  details: {
    impact: string;
    highlights: string[];
    role?: string;
    year?: string;
    type?: string;
    architecture?: { layer: string; desc: string }[];
  };
  typewriter?: boolean;
};

const projects: Project[] = [
  {
    id: "tahqiq-ai",
    title: "Tahqiq AI · Multilingual LLM Assistant",
    tag: "LLM · RAG",
    icon: Languages,
    desc: "Full-stack AI assistant for academic queries across Urdu, Roman Urdu and English — leveraging LLMs with retrieval-augmented generation for context-aware, cross-lingual responses.",
    metrics: [
      { k: "Languages", v: "Urdu · Roman · EN" },
      { k: "Architecture", v: "LLM + RAG" },
    ],
    stack: ["Python", "LLM", "Streamlit", "Multilingual NLP"],
    details: {
      impact:
        "Demonstrated real-world educational accessibility for under-resourced language communities — bringing LLM-grade reasoning to learners outside the English default.",
      highlights: [
        "Multilingual NLP pipeline for query understanding and intent classification",
        "Cross-lingual semantic matching across three distinct scripts",
        "Interactive Streamlit deployment with live retrieval augmentation",
      ],
      role: "Lead Engineer",
      year: "2025",
      type: "Production · Education",
      architecture: [
        { layer: "Ingestion", desc: "Document chunking, embedding, vector index" },
        { layer: "Retrieval", desc: "Cross-lingual semantic search · top-k re-ranking" },
        { layer: "Generation", desc: "Grounded LLM completion with citation handles" },
      ],
    },
    typewriter: true,
  },
  {
    id: "reddit-sentiment",
    title: "Reddit Comment Sentiment Analysis",
    tag: "NLP · Classification",
    icon: MessageSquareText,
    desc: "End-to-end NLP pipeline processing 1M+ Reddit comments for multi-class sentiment classification — TF-IDF vectorisation with regularised logistic regression hitting F1 0.86.",
    metrics: [
      { k: "Volume", v: "1M+ comments" },
      { k: "F1", v: "0.86" },
    ],
    stack: ["Python", "Scikit-learn", "TF-IDF"],
    details: {
      impact:
        "Engineered a production-shape pipeline that handles informal social-media language and class imbalance — turning raw Reddit firehose into structured sentiment signal.",
      highlights: [
        "Custom lemmatisation + domain-specific tokenisation",
        "Class weighting to counter label imbalance",
        "Regularised logistic regression with stratified evaluation",
      ],
      role: "Sole Engineer",
      year: "2024",
      type: "NLP · Pipeline",
      architecture: [
        { layer: "Preprocess", desc: "Lemmatisation · domain tokeniser · stop-word policy" },
        { layer: "Vectorise", desc: "TF-IDF n-grams · sparse feature matrix" },
        { layer: "Classify", desc: "Regularised logistic regression · class-weighted loss" },
      ],
    },
    typewriter: true,
  },
  {
    id: "credit-risk",
    title: "Credit Risk & Default Prediction",
    tag: "Risk Modelling",
    icon: Activity,
    desc: "XGBoost credit-default model with SMOTE for class imbalance — AUC-ROC 0.89, F1 0.78 on the minority class — paired with SHAP explanations for stakeholder-grade transparency.",
    metrics: [
      { k: "AUC-ROC", v: "0.89" },
      { k: "Minority F1", v: "0.78" },
    ],
    stack: ["XGBoost", "SMOTE", "SHAP", "Scikit-learn"],
    details: {
      impact:
        "Delivered regulator-aware risk scoring — SHAP feature attributions made every decision auditable, aligning model behaviour with compliance requirements.",
      highlights: [
        "SMOTE oversampling for minority-class recall",
        "SHAP value analysis for feature-level interpretability",
        "Stakeholder-transparent scoring fit for risk reviews",
      ],
      role: "Modelling Lead",
      year: "2024",
      type: "Risk · Finance",
      architecture: [
        { layer: "Balance", desc: "SMOTE oversample · stratified k-fold validation" },
        { layer: "Model", desc: "XGBoost gradient-boosted trees · early-stop" },
        { layer: "Explain", desc: "SHAP attributions · per-decision audit trail" },
      ],
    },
  },
  {
    id: "energy-forecasting",
    title: "Multi-Step Energy Demand Forecasting",
    tag: "Time Series · DL",
    icon: Zap,
    desc: "LSTM forecasting pipeline benchmarked against Prophet and ARIMA on hourly sensor data — feature engineering reduced MAE by 23% versus baselines.",
    metrics: [
      { k: "MAE Reduction", v: "−23%" },
      { k: "Models", v: "LSTM · Prophet · ARIMA" },
    ],
    stack: ["TensorFlow", "LSTM", "Prophet", "Feature Eng."],
    details: {
      impact:
        "Built a leak-safe, modular forecasting backbone — automated hyperparameter search plus cross-temporal validation make the pipeline ready for ops handover.",
      highlights: [
        "Multi-step horizon prediction on sensor streams",
        "Cross-temporal validation preventing leakage in sequential splits",
        "Automated hyperparameter search across LSTM topologies",
      ],
      role: "ML Engineer",
      year: "2024",
      type: "Time Series · Energy",
      architecture: [
        { layer: "Features", desc: "Lag windows · seasonal encodings · weather joins" },
        { layer: "Forecast", desc: "LSTM multi-step · benchmarked vs Prophet/ARIMA" },
        { layer: "Validate", desc: "Cross-temporal splits · automated HP search" },
      ],
    },
  },
  {
    id: "medical-cnn",
    title: "Medical Image Classification · CNN",
    tag: "Deep Learning · Healthcare",
    icon: HeartPulse,
    desc: "Transfer-learning CNN built on ResNet50 reaching 94.2% accuracy and 98.1% top-3 — with Grad-CAM heatmaps that surface the diagnostic regions driving every prediction.",
    metrics: [
      { k: "Accuracy", v: "94.2%" },
      { k: "Top-3", v: "98.1%" },
    ],
    stack: ["TensorFlow", "ResNet50", "Grad-CAM"],
    details: {
      impact:
        "Closed the loop between deep model and clinician — Grad-CAM overlays make every classification visually defensible, not a black box.",
      highlights: [
        "Transfer learning from ResNet50 with augmentation",
        "Ensemble methods to lift top-3 robustness",
        "Grad-CAM visualisation for clinical interpretability",
      ],
      role: "Deep-Learning Engineer",
      year: "2024",
      type: "Healthcare · Vision",
      architecture: [
        { layer: "Backbone", desc: "ResNet50 transfer learning · fine-tuned head" },
        { layer: "Augment", desc: "Affine · jitter · domain-aware sampling" },
        { layer: "Explain", desc: "Grad-CAM heatmaps over diagnostic regions" },
      ],
    },
  },
  {
    id: "customer-segmentation",
    title: "Customer Segmentation & Recommendation",
    tag: "Unsupervised · RecSys",
    icon: Users,
    desc: "Hybrid system fusing K-Means / DBSCAN segmentation with collaborative filtering — six clean customer clusters and a 31% lift in click-through rate.",
    metrics: [
      { k: "Clusters", v: "6" },
      { k: "CTR Lift", v: "+31%" },
    ],
    stack: ["K-Means", "DBSCAN", "Collaborative Filtering"],
    details: {
      impact:
        "Turned transaction logs into actionable personas — and wired in a weekly retraining loop so cluster assignments stay fresh without manual touch.",
      highlights: [
        "Hybrid segmentation: density + centroid clustering",
        "Collaborative filtering layered on cluster membership",
        "Automated weekly retraining via batch inference",
      ],
      role: "Data Scientist",
      year: "2024",
      type: "Unsupervised · RecSys",
      architecture: [
        { layer: "Segment", desc: "K-Means + DBSCAN hybrid · 6 stable clusters" },
        { layer: "Recommend", desc: "Collaborative filtering on cluster membership" },
        { layer: "Operate", desc: "Weekly batch retraining · drift monitoring" },
      ],
    },
  },
  {
    id: "cost-sensitive-research",
    title: "Cost-Sensitive Predictive Modelling",
    tag: "Published Research",
    icon: Waves,
    desc: "Peer-shared research integrating cost-sensitive learning with interpretable models to optimise customer retention spend — published on Zenodo (DOI 10.5281/zenodo.18372293).",
    metrics: [
      { k: "Net Retention ROI", v: "+34%" },
      { k: "Year", v: "2025" },
    ],
    stack: ["Cost-Sensitive ML", "Interpretability", "LTV"],
    details: {
      impact:
        "Bridged ML research and business decision-making — the paper shows up to 34% better net retention ROI versus accuracy-maximising baselines, with full feature-level transparency.",
      highlights: [
        "Cost-sensitive loss tied to predicted lifetime value",
        "Feature-level contribution analysis for transparency",
        "Churn-oriented decision optimisation framework",
      ],
      role: "Lead Author",
      year: "2025",
      type: "Published Research",
      architecture: [
        { layer: "Frame", desc: "Cost matrix derived from predicted LTV" },
        { layer: "Optimise", desc: "Cost-sensitive learning over interpretable models" },
        { layer: "Decide", desc: "Action policy maximising net retention ROI" },
      ],
    },
  },
];

export function ProjectVault() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { isDragging, bind } = useDragScroll(trackRef);

  // Scroll-driven parallax (NOT applied to <section> itself, to keep
  // modal's position:fixed unaffected by ancestor transforms/filters).
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const sp = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.5 });
  const headerY = useTransform(sp, [0, 1], [40, -40]);
  const headerOpacity = useTransform(sp, [0, 0.2, 0.85, 1], [0, 1, 1, 0.7]);
  const trackY = useTransform(sp, [0, 1], [-30, 30]);

  // Deep-link sync
  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash;
      const match = hash.match(/^#project=(.+)$/);
      if (match && projects.some((p) => p.id === match[1])) {
        setActiveId(match[1]);
        requestAnimationFrame(() => {
          document
            .getElementById("vault")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  // Esc to close modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeId) close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId]);

  const open = useCallback((id: string) => {
    setActiveId(id);
    history.replaceState(null, "", `${window.location.pathname}#project=${id}`);
    void import("./sfx").then((m) => m.play("open"));
  }, []);

  const close = useCallback(() => {
    setActiveId(null);
    history.replaceState(null, "", `${window.location.pathname}#vault`);
    void import("./sfx").then((m) => m.play("close"));
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.85, 720), behavior: "smooth" });
  };

  const active = projects.find((p) => p.id === activeId) ?? null;

  return (
    <section ref={sectionRef} id="vault" className="relative px-0 py-32">
      <motion.div
        style={{ y: headerY, opacity: headerOpacity }}
        className="mx-auto max-w-[1400px] px-6 sm:px-10"
      >
        <SectionLabel index="03" label="Selected Work" />
        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-3xl">
            <h2 className="text-display text-5xl sm:text-6xl md:text-7xl">
              Models that <span className="text-serif italic font-normal">ship</span>.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              A selection of systems designed for real-world impact.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="micro-label hidden sm:inline">Drag · Scroll</span>
            <Magnetic strength={10} innerStrength={0.5}>
              <button
                type="button"
                onClick={() => scrollBy(-1)}
                aria-label="Previous project"
                className="focus-glow flex h-11 w-11 items-center justify-center rounded-full border border-cream/15 bg-background/40 text-foreground backdrop-blur transition-all hover:border-neon/60 hover:text-neon"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            </Magnetic>
            <Magnetic strength={10} innerStrength={0.5}>
              <button
                type="button"
                onClick={() => scrollBy(1)}
                aria-label="Next project"
                className="focus-glow flex h-11 w-11 items-center justify-center rounded-full border border-cream/15 bg-background/40 text-foreground backdrop-blur transition-all hover:border-neon/60 hover:text-neon"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </Magnetic>
          </div>
        </div>
      </motion.div>

      {/* Horizontal carousel with subtle vertical parallax on the wrapper */}
      <motion.div style={{ y: trackY }}>
        <div
          ref={trackRef}
          {...bind}
          className={`mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-10 pt-2 sm:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            isDragging
              ? "cursor-grabbing snap-none scroll-auto select-none"
              : "cursor-grab scroll-smooth"
          }`}
        >
          {projects.map((p, i) => (
            <CarouselCard
              key={p.id}
              p={p}
              i={i}
              isLast={i === projects.length - 1}
              isDragging={isDragging}
              onOpen={() => open(p.id)}
            />
          ))}
          <div className="shrink-0 pr-4" aria-hidden />
        </div>
      </motion.div>

      {/* Modal expansion */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex items-stretch justify-center bg-background/80 backdrop-blur-xl"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={`${active.title} — case study`}
          >
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.985 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.985 }}
              transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
              className="relative flex h-full w-full flex-col overflow-hidden bg-background"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Cinematic header */}
              <div className="relative shrink-0 overflow-hidden border-b border-cream/10">
                <div className="absolute inset-0 bg-gradient-to-br from-neon/15 via-background to-background" />
                <div className="grid-bg absolute inset-0 opacity-50" />
                <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-neon/30 blur-[120px]" />

                <div className="relative mx-auto flex w-full max-w-6xl items-start justify-between gap-6 px-6 pb-10 pt-24 sm:px-10">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
                        Case Study
                      </span>
                      <span className="rounded-full border border-neon/30 bg-neon/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-neon">
                        {active.tag}
                      </span>
                    </div>
                    <h3 className="text-display mt-5 text-4xl text-foreground sm:text-5xl md:text-6xl">
                      {active.title.split("·")[0].trim()}
                    </h3>
                    {active.title.includes("·") && (
                      <div className="text-serif mt-2 text-2xl text-cream/70 sm:text-3xl">
                        {active.title.split("·").slice(1).join("·").trim()}
                      </div>
                    )}
                    <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {active.details.role && (
                        <span>
                          Role <span className="ml-2 text-foreground">{active.details.role}</span>
                        </span>
                      )}
                      {active.details.year && (
                        <span>
                          Year <span className="ml-2 text-foreground">{active.details.year}</span>
                        </span>
                      )}
                      {active.details.type && (
                        <span>
                          Type <span className="ml-2 text-foreground">{active.details.type}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const url = `${window.location.origin}${window.location.pathname}#project=${active.id}`;
                        navigator.clipboard?.writeText(url);
                      }}
                      aria-label="Copy direct link"
                      className="focus-glow flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 bg-background/40 text-muted-foreground transition-colors hover:border-neon/60 hover:text-neon"
                    >
                      <Link2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={close}
                      aria-label="Close case study"
                      className="focus-glow flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 bg-background/40 text-muted-foreground transition-colors hover:border-neon/60 hover:text-neon"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="overflow-y-auto">
                <div className="mx-auto grid max-w-6xl gap-12 px-6 py-14 sm:px-10 md:grid-cols-12">
                  <div className="md:col-span-7 space-y-10">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-neon">
                        ◍ Brief
                      </div>
                      <div className="mt-3 text-base leading-relaxed text-foreground/90">
                        {active.typewriter ? <Typewriter text={active.desc} /> : active.desc}
                      </div>
                    </div>

                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-neon">
                        ◍ Impact
                      </div>
                      <p className="mt-3 text-lg leading-relaxed text-foreground">
                        {active.details.impact}
                      </p>
                    </div>

                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-neon">
                        ◍ Technical highlights
                      </div>
                      <ul className="mt-4 space-y-3">
                        {active.details.highlights.map((h) => (
                          <li
                            key={h}
                            className="flex items-start gap-3 text-sm text-muted-foreground sm:text-base"
                          >
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neon shadow-[0_0_10px_var(--neon)]" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="md:col-span-5 space-y-8">
                    <div className="grid grid-cols-2 gap-3">
                      {active.metrics.map((m) => (
                        <div
                          key={m.k}
                          className="glass-soft rounded-xl border border-cream/10 px-4 py-4"
                        >
                          <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                            {m.k}
                          </div>
                          <div className="mt-1 text-base font-semibold text-neon">{m.v}</div>
                        </div>
                      ))}
                    </div>

                    {active.details.architecture && (
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-neon">
                          ◍ Architecture
                        </div>
                        <ol className="mt-4 space-y-2">
                          {active.details.architecture.map((a, idx) => (
                            <li
                              key={a.layer}
                              className="glass-soft relative overflow-hidden rounded-xl border border-cream/10 p-4"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-[10px] uppercase tracking-widest text-neon">
                                  L{idx + 1} · {a.layer}
                                </span>
                              </div>
                              <div className="mt-1 text-sm text-foreground/90">{a.desc}</div>
                              <div className="absolute inset-y-0 left-0 w-[2px] bg-neon shadow-[0_0_12px_var(--neon)]" />
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-neon">
                        ◍ Stack
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {active.stack.map((s) => (
                          <span
                            key={s}
                            className="rounded-md border border-cream/10 bg-cream/5 px-2.5 py-1 font-mono text-[10px] text-muted-foreground"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function CarouselCard({
  p,
  i,
  isLast,
  isDragging,
  onOpen,
}: {
  p: Project;
  i: number;
  isLast: boolean;
  isDragging: boolean;
  onOpen: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={(e) => {
        if (isDragging) {
          e.preventDefault();
          return;
        }
        onOpen();
      }}
      draggable={false}
      id={`project-${p.id}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.6, delay: (i % 4) * 0.06, ease: [0.2, 0.8, 0.2, 1] }}
      className={`glass glow-hover focus-glow group relative flex w-[82vw] shrink-0 snap-start flex-col overflow-hidden rounded-3xl p-7 text-left sm:w-[440px] md:w-[520px] ${
        isLast ? "mr-0" : ""
      }`}
      aria-label={`Open ${p.title}`}
    >
      {/* index */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
        </span>
        <span className="rounded-full border border-neon/30 bg-neon/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-neon">
          {p.tag}
        </span>
      </div>

      {/* big visual area with icon as monogram */}
      <div className="relative mt-6 flex h-44 items-center justify-center overflow-hidden rounded-2xl border border-cream/8 bg-gradient-to-br from-cream/5 via-transparent to-neon/10 sm:h-56">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <p.icon
          className="relative h-20 w-20 text-neon transition-transform duration-700 group-hover:scale-110"
          strokeWidth={1.1}
        />
        <div className="absolute bottom-3 right-3 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
          ID · {p.id}
        </div>
      </div>

      <h3 className="text-display mt-6 text-3xl text-foreground sm:text-4xl">
        {p.title}
      </h3>

      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {p.desc}
      </p>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {p.stack.slice(0, 3).map((s) => (
            <span
              key={s}
              className="rounded-md bg-cream/5 px-2 py-1 font-mono text-[10px] text-muted-foreground"
            >
              {s}
            </span>
          ))}
        </div>
        <span className="micro-label flex items-center gap-2 text-foreground transition-colors group-hover:text-neon">
          Inspect
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </motion.button>
  );
}

function Typewriter({ text }: { text: string }) {
  const [out, setOut] = useState("");
  useEffect(() => {
    let i = 0;
    let cancel = false;
    const tick = () => {
      if (cancel) return;
      setOut(text.slice(0, i));
      if (i < text.length) {
        i++;
        setTimeout(tick, 14);
      }
    };
    tick();
    return () => {
      cancel = true;
    };
  }, [text]);
  return <span className="cursor-blink font-mono text-[13px] leading-relaxed">{out}</span>;
}

/**
 * Drag-to-scroll with pointer capture, click suppression after drag,
 * and inertial momentum on release.
 */
function useDragScroll(ref: React.RefObject<HTMLDivElement | null>) {
  const [isDragging, setIsDragging] = useState(false);
  const state = useRef({
    active: false,
    moved: false,
    startX: 0,
    startScroll: 0,
    lastX: 0,
    lastT: 0,
    velocity: 0,
    pointerId: 0 as number,
    momentumId: 0 as number,
  });

  const cancelMomentum = () => {
    if (state.current.momentumId) {
      cancelAnimationFrame(state.current.momentumId);
      state.current.momentumId = 0;
    }
  };

  const startMomentum = () => {
    const el = ref.current;
    if (!el) return;
    const friction = 0.94;
    const minV = 0.05;
    const step = () => {
      const v = state.current.velocity;
      if (Math.abs(v) < minV) {
        state.current.momentumId = 0;
        return;
      }
      el.scrollLeft -= v;
      state.current.velocity = v * friction;
      state.current.momentumId = requestAnimationFrame(step);
    };
    state.current.momentumId = requestAnimationFrame(step);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // ignore non-primary buttons / touch handled natively well, but we still hijack mouse + pen
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const el = ref.current;
    if (!el) return;
    cancelMomentum();
    state.current.active = true;
    state.current.moved = false;
    state.current.startX = e.clientX;
    state.current.startScroll = el.scrollLeft;
    state.current.lastX = e.clientX;
    state.current.lastT = performance.now();
    state.current.velocity = 0;
    state.current.pointerId = e.pointerId;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = state.current;
    if (!s.active) return;
    const el = ref.current;
    if (!el) return;
    const dx = e.clientX - s.startX;
    if (!s.moved && Math.abs(dx) > 6) {
      s.moved = true;
      setIsDragging(true);
      try {
        (e.currentTarget as HTMLDivElement).setPointerCapture(s.pointerId);
      } catch {
        /* noop */
      }
    }
    if (s.moved) {
      el.scrollLeft = s.startScroll - dx;
      const now = performance.now();
      const dt = Math.max(1, now - s.lastT);
      // px per frame (~16ms) for momentum
      s.velocity = ((e.clientX - s.lastX) / dt) * 16;
      s.lastX = e.clientX;
      s.lastT = now;
    }
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = state.current;
    if (!s.active) return;
    s.active = false;
    try {
      (e.currentTarget as HTMLDivElement).releasePointerCapture(s.pointerId);
    } catch {
      /* noop */
    }
    if (s.moved) {
      startMomentum();
      // keep isDragging true for one tick so child click is suppressed
      requestAnimationFrame(() => setIsDragging(false));
    } else {
      setIsDragging(false);
    }
  };

  useEffect(() => () => cancelMomentum(), []);

  return {
    isDragging,
    bind: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onPointerLeave: (e: React.PointerEvent<HTMLDivElement>) => {
        if (state.current.active) endDrag(e);
      },
    },
  };
}
