import { motion, useMotionValue, useSpring, useTransform, type HTMLMotionProps } from "framer-motion";
import { useRef, type PointerEvent, type ReactNode } from "react";

type MagneticProps = {
  children: ReactNode;
  /** Max pixel offset the wrapper travels toward the cursor. Default 14. */
  strength?: number;
  /** Extra parallax factor for the inner content (0 = none, 0.4 = 40% of wrapper). */
  innerStrength?: number;
  className?: string;
} & Omit<HTMLMotionProps<"div">, "children" | "ref">;

/**
 * Magnetic wrapper — element gravitates toward the cursor while hovered,
 * springs back on leave. Pair with CustomCursor for the snap-into-place feel.
 * Respects prefers-reduced-motion.
 */
export function Magnetic({
  children,
  strength = 14,
  innerStrength = 0.4,
  className,
  ...rest
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });
  const ix = useTransform(sx, (v) => v * innerStrength);
  const iy = useTransform(sy, (v) => v * innerStrength);

  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    const nx = Math.max(-1, Math.min(1, relX / (rect.width / 2)));
    const ny = Math.max(-1, Math.min(1, relY / (rect.height / 2)));
    x.set(nx * strength);
    y.set(ny * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x: sx, y: sy, display: "inline-block" }}
      className={className}
      {...rest}
    >
      <motion.div style={{ x: ix, y: iy }}>{children}</motion.div>
    </motion.div>
  );
}
