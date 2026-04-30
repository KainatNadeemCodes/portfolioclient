import { motion } from "framer-motion";
import { SectionLabel } from "./Summary";
import { CinematicSection, ParallaxLayer } from "./CinematicSection";
import { ParticleNodes } from "./ParticleNodes";

const groups = [
  {
    title: "ML / Deep Learning",
    items: [
      "TensorFlow · PyTorch",
      "XGBoost · LightGBM",
      "SMOTE · Class Imbalance",
      "SHAP · Interpretability",
      "Hyperparameter Search",
    ],
  },
  {
    title: "NLP / LLMs",
    items: [
      "Transformers · Hugging Face",
      "LangChain · RAG",
      "SpaCy · Tokenisation",
      "Multilingual Pipelines",
      "Intent Classification",
    ],
  },
  {
    title: "Data & MLOps",
    items: [
      "Pandas · NumPy · EDA",
      "Time-Series Forecasting",
      "Feature Engineering",
      "Docker · MLflow · AWS",
      "Streamlit Deployment",
    ],
  },
];

export function TechStack() {
  return (
    <CinematicSection id="stack" className="relative px-6 py-32">
      {({ progress }) => (
        <div className="mx-auto max-w-6xl">
          <ParallaxLayer progress={progress} depth={-0.5}>
            <SectionLabel index="02" label="Core Expertise" />
            <h2 className="text-display mt-6 text-4xl sm:text-5xl md:text-6xl">
              Data <span className="neon-text">nodes</span>.
            </h2>
            <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
              A living map of the tools I build with — drift, repel, and connect.
            </p>
          </ParallaxLayer>

          {/* Interactive constellation */}
          <ParallaxLayer progress={progress} depth={0.2}>
            <div className="mt-10">
              {/* Usage hint */}
              <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/80">
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon shadow-[0_0_8px_var(--neon)]" />
                  Tip — move your cursor across the field to reveal each skill
                </span>
                <span className="hidden h-3 w-px bg-cream/15 sm:inline-block" />
                <span className="hidden sm:inline">Hover a node → see its name & domain</span>
              </div>
              <ParticleNodes />
            </div>
          </ParallaxLayer>

          {/* capability columns */}
          <ParallaxLayer progress={progress} depth={0.5}>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {groups.map((g, i) => (
                <motion.div
                  key={g.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="glass-soft glow-hover rounded-2xl p-6"
                >
                  <div className="font-mono text-[11px] uppercase tracking-widest text-neon">
                    {g.title}
                  </div>
                  <ul className="mt-4 space-y-2">
                    {g.items.map((it) => (
                      <li
                        key={it}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <span className="h-1 w-1 rounded-full bg-neon shadow-[0_0_8px_var(--neon)]" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </ParallaxLayer>
        </div>
      )}
    </CinematicSection>
  );
}
