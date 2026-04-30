import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

/**
 * Cinematic section wrapper.
 *
 * - Wraps a section in a scroll-progress tracker (0 → 1 across the viewport).
 * - Children can opt-in to layered parallax via <ParallaxLayer depth={...}>.
 * - On enter, the section reveals with a soft blur + lift; on exit it fades out
 *   subtly so the next section feels like a new "scene".
 *
 * Honors prefers-reduced-motion (no parallax / no blur).
 */
export function CinematicSection({
  id,
  className = "",
  children,
  /** Reveal direction strength in px. */
  rise = 60,
}: {
  id?: string;
  className?: string;
  children:
    | ReactNode
    | ((ctx: { progress: MotionValue<number>; reduced: boolean }) => ReactNode);
  rise?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = !!useReducedMotion();

  // Tracks 0 when section bottom hits viewport top, 1 when section top hits viewport bottom.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.5,
  });

  // Reveal: section lifts and unblurs as it enters, gently fades on exit.
  const opacity = useTransform(progress, [0, 0.18, 0.85, 1], [0, 1, 1, 0.6]);
  const y = useTransform(progress, [0, 0.25], [rise, 0]);
  const blurPx = useTransform(progress, [0, 0.22], [10, 0]);
  const filter = useTransform(blurPx, (v) => `blur(${v}px)`);

  return (
    <motion.section
      ref={ref}
      id={id}
      style={
        reduced
          ? undefined
          : {
              opacity,
              y,
              filter,
              willChange: "transform, opacity, filter",
            }
      }
      className={className}
    >
      {typeof children === "function" ? children({ progress, reduced }) : children}
    </motion.section>
  );
}

/**
 * A parallax layer that translates vertically based on scroll progress.
 * `depth` < 0 lags behind (back), `depth` > 0 leads (foreground).
 *
 * Range is normalized: depth=1 → ~80px travel across the section.
 */
export function ParallaxLayer({
  progress,
  depth = -0.5,
  className = "",
  children,
  /** Optional horizontal drift (px) — positive moves right at end of section. */
  drift = 0,
  /** Optional scale shift, e.g. 0.05 for a 5% zoom across the section. */
  scaleShift = 0,
}: {
  progress: MotionValue<number>;
  depth?: number;
  className?: string;
  children: ReactNode;
  drift?: number;
  scaleShift?: number;
}) {
  const reduced = !!useReducedMotion();
  const travel = depth * 80; // px
  const y = useTransform(progress, [0, 1], [-travel, travel]);
  const x = useTransform(progress, [0, 1], [-drift, drift]);
  const scale = useTransform(progress, [0, 1], [1 - scaleShift, 1 + scaleShift]);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div style={{ y, x, scale, willChange: "transform" }} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * Decorative seam between sections — a thin glowing line that grows with scroll.
 * Use between adjacent sections for a film-strip "cut" feeling.
 */
export function SectionSeam() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scaleX = useTransform(scrollYProgress, [0.2, 0.8], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0.1, 0.4, 0.9, 1], [0, 1, 1, 0]);
  return (
    <div
      ref={ref}
      aria-hidden
      className="relative mx-auto h-px w-full max-w-[1400px] px-6 sm:px-10"
    >
      <motion.div
        style={{ scaleX, opacity }}
        className="h-px origin-left bg-gradient-to-r from-transparent via-neon to-transparent"
      />
    </div>
  );
}
