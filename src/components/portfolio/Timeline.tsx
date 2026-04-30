import { motion } from "framer-motion";
import {
  Briefcase,
  GitMerge,
  GraduationCap,
  LineChart,
  Plane,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { SectionLabel } from "./Summary";
import { CinematicSection, ParallaxLayer } from "./CinematicSection";

const events = [
  {
    period: "2023 — 2027",
    title: "BSc · Software Engineering",
    org: "University of Sahiwal · GPA 3.52 / 4.0",
    detail:
      "Coursework: Machine Learning, Data Structures & Algorithms, Database Systems, Statistical Methods, Artificial Intelligence and Natural Language Processing.",
    icon: GraduationCap,
  },
  {
    period: "Simulation",
    title: "Data Science Consultant",
    org: "Deloitte",
    detail:
      "Built predictive analytics for client risk — fusing financial time-series with macroeconomic indicators to forecast default probability across a multi-billion-dollar portfolio. Shipped exec-facing dashboards for compliance teams.",
    icon: Briefcase,
  },
  {
    period: "Simulation",
    title: "AI / ML Strategy Analyst",
    org: "BCG X",
    detail:
      "Benchmarked enterprise AI/ML solutions across financial services and healthcare. Recommended MLOps architectures that cut inference latency by 40% while holding model SLAs.",
    icon: Sparkles,
  },
  {
    period: "Simulation",
    title: "Quantitative Data Analyst",
    org: "JPMorgan Chase",
    detail:
      "Built credit scoring and portfolio risk models with gradient boosting and survival analysis for Basel III capital adequacy reporting. Automated pipelines cut manual reconciliation by 60%.",
    icon: ShieldCheck,
  },
  {
    period: "Simulation",
    title: "Data Analyst",
    org: "British Airways",
    detail:
      "Analysed booking and flight data to surface demand patterns — supporting revenue management decisions tied to a projected 8% lift in seat utilisation on key routes.",
    icon: Plane,
  },
  {
    period: "Simulation",
    title: "Business Intelligence Analyst",
    org: "Lloyds Banking Group",
    detail:
      "Customer churn models at AUC-ROC 0.82 plus automated Python reporting that retired legacy Excel — reducing reporting cycle time by 70%.",
    icon: LineChart,
  },
  {
    period: "2025 →",
    title: "Independent Applied AI Research",
    org: "Self-directed",
    detail:
      "End-to-end projects across multilingual LLM assistants, credit risk, time-series forecasting and medical imaging — shipped, evaluated and documented.",
    icon: GitMerge,
  },
];

export function Timeline() {
  return (
    <CinematicSection id="timeline" className="relative px-6 py-32">
      {({ progress }) => (
        <div className="mx-auto max-w-4xl">
          <ParallaxLayer progress={progress} depth={-0.5}>
            <SectionLabel index="05" label="Professional Experience" />
            <h2 className="text-display mt-6 text-4xl sm:text-5xl md:text-6xl">
              The <span className="neon-text">data path</span>.
            </h2>
          </ParallaxLayer>

          <ParallaxLayer progress={progress} depth={0.3}>
            <div className="relative mt-16 pl-10 sm:pl-14">
              {/* glowing path */}
              <div
                className="absolute left-3 top-0 h-full w-px sm:left-5"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, var(--neon) 12%, var(--neon) 88%, transparent)",
                  boxShadow: "0 0 14px 0 var(--neon)",
                }}
              />

              {events.map((e, i) => (
                <motion.div
                  key={e.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="relative mb-12 last:mb-0"
                >
                  <span
                    className="absolute -left-[34px] top-2 flex h-5 w-5 items-center justify-center rounded-full border border-neon/60 bg-background sm:-left-[42px]"
                    style={{ boxShadow: "0 0 18px 0 var(--neon)" }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-neon" />
                  </span>

                  <div className="glass-soft glow-hover rounded-2xl p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-neon">
                        <e.icon className="h-3.5 w-3.5" />
                        {e.period}
                      </div>
                    </div>
                    <h3 className="text-display mt-3 text-2xl text-foreground">{e.title}</h3>
                    <div className="mt-1 text-sm text-muted-foreground">{e.org}</div>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{e.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </ParallaxLayer>
        </div>
      )}
    </CinematicSection>
  );
}
