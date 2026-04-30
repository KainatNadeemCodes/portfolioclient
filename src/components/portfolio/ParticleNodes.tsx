import { useEffect, useRef, useState } from "react";

type Node = {
  label: string;
  group: string;
  x: number; // 0..1 normalized
  y: number;
  vx: number;
  vy: number;
  px: number; // pixel
  py: number;
  r: number;
};

const SEED: { label: string; group: string }[] = [
  { label: "Python", group: "Core" },
  { label: "SQL", group: "Core" },
  { label: "PyTorch", group: "DL" },
  { label: "TensorFlow", group: "DL" },
  { label: "XGBoost", group: "ML" },
  { label: "Scikit-learn", group: "ML" },
  { label: "LLMs", group: "NLP" },
  { label: "RAG", group: "NLP" },
  { label: "LangChain", group: "NLP" },
  { label: "Transformers", group: "NLP" },
  { label: "SHAP", group: "ML" },
  { label: "SMOTE", group: "ML" },
  { label: "Pandas", group: "Data" },
  { label: "NumPy", group: "Data" },
  { label: "Docker", group: "Ops" },
  { label: "AWS", group: "Ops" },
  { label: "MLflow", group: "Ops" },
  { label: "Streamlit", group: "Ops" },
];

/**
 * Interactive particle constellation:
 *  - nodes drift slowly, connected by faint lines when near
 *  - cursor repels nodes & strengthens nearby connections
 *  - hover snaps a label & ring around closest node
 */
export function ParticleNodes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hoverLabel, setHoverLabel] = useState<{
    label: string;
    group: string;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const pointer = { x: -9999, y: -9999, active: false };
    let nodes: Node[] = [];
    let raf = 0;
    let hoverIdx = -1;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // recompute pixel positions
      for (const n of nodes) {
        n.px = n.x * w;
        n.py = n.y * h;
      }
    };

    const init = () => {
      nodes = SEED.map((s) => {
        const x = Math.random();
        const y = Math.random();
        return {
          label: s.label,
          group: s.group,
          x,
          y,
          vx: (Math.random() - 0.5) * 0.04,
          vy: (Math.random() - 0.5) * 0.04,
          px: 0,
          py: 0,
          r: 2 + Math.random() * 1.6,
        };
      });
      resize();
    };

    const groupColor = (g: string) => {
      // amber-only palette with slight variance
      switch (g) {
        case "DL":
          return "rgba(255, 196, 110, ALPHA)";
        case "NLP":
          return "rgba(255, 180, 90, ALPHA)";
        case "ML":
          return "rgba(255, 210, 130, ALPHA)";
        case "Ops":
          return "rgba(230, 180, 110, ALPHA)";
        case "Data":
          return "rgba(255, 220, 150, ALPHA)";
        default:
          return "rgba(255, 200, 120, ALPHA)";
      }
    };

    const tick = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      const dt = reduceMotion ? 0 : 1;
      // physics
      for (const n of nodes) {
        // drift in normalized space
        n.x += (n.vx / 100) * dt;
        n.y += (n.vy / 100) * dt;
        if (n.x < 0 || n.x > 1) n.vx *= -1;
        if (n.y < 0 || n.y > 1) n.vy *= -1;
        n.x = Math.max(0, Math.min(1, n.x));
        n.y = Math.max(0, Math.min(1, n.y));
        n.px = n.x * w;
        n.py = n.y * h;

        if (pointer.active) {
          const dx = n.px - pointer.x;
          const dy = n.py - pointer.y;
          const dist = Math.hypot(dx, dy);
          const range = 160;
          if (dist < range && dist > 0.001) {
            const force = (1 - dist / range) * 0.6;
            n.px += (dx / dist) * force * 4;
            n.py += (dy / dist) * force * 4;
            // re-normalize
            n.x = Math.max(0, Math.min(1, n.px / w));
            n.y = Math.max(0, Math.min(1, n.py / h));
          }
        }
      }

      // find hover node
      hoverIdx = -1;
      if (pointer.active) {
        let best = 28;
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          const d = Math.hypot(n.px - pointer.x, n.py - pointer.y);
          if (d < best) {
            best = d;
            hoverIdx = i;
          }
        }
      }

      // edges
      const linkRange = Math.min(180, Math.max(110, w * 0.14));
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.px - b.px, a.py - b.py);
          if (d < linkRange) {
            let alpha = (1 - d / linkRange) * 0.35;
            // boost lines near pointer
            if (pointer.active) {
              const mx = (a.px + b.px) / 2;
              const my = (a.py + b.py) / 2;
              const dp = Math.hypot(mx - pointer.x, my - pointer.y);
              if (dp < 220) alpha += (1 - dp / 220) * 0.5;
            }
            alpha = Math.min(0.85, alpha);
            ctx.strokeStyle = `rgba(255, 196, 110, ${alpha * 0.55})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.px, a.py);
            ctx.lineTo(b.px, b.py);
            ctx.stroke();
          }
        }
      }

      // nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const isHover = i === hoverIdx;
        const r = isHover ? 5.5 : n.r;
        const baseAlpha = isHover ? 1 : 0.85;
        const fill = groupColor(n.group).replace("ALPHA", String(baseAlpha));
        ctx.beginPath();
        ctx.arc(n.px, n.py, r, 0, Math.PI * 2);
        ctx.fillStyle = fill;
        ctx.shadowBlur = isHover ? 22 : 8;
        ctx.shadowColor = "rgba(255, 196, 110, 0.85)";
        ctx.fill();
        ctx.shadowBlur = 0;

        if (isHover) {
          ctx.beginPath();
          ctx.arc(n.px, n.py, 14, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255, 196, 110, 0.6)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // hover label state push (throttled by RAF)
      if (hoverIdx >= 0) {
        const n = nodes[hoverIdx];
        setHoverLabel((prev) => {
          if (
            prev &&
            prev.label === n.label &&
            Math.abs(prev.x - n.px) < 1 &&
            Math.abs(prev.y - n.py) < 1
          )
            return prev;
          return { label: n.label, group: n.group, x: n.px, y: n.py };
        });
      } else if (hoverLabel) {
        setHoverLabel(null);
      }

      raf = requestAnimationFrame(tick);
    };

    let pinTimer: ReturnType<typeof setTimeout> | null = null;
    let isTouch = false;

    const onMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
      if (e.pointerType !== "mouse") {
        isTouch = true;
        // On touch, keep the pointer active for a short window so the label is readable
        if (pinTimer) clearTimeout(pinTimer);
        pinTimer = setTimeout(() => {
          pointer.active = false;
          pointer.x = -9999;
          pointer.y = -9999;
        }, 2200);
      }
    };
    const onDown = (e: PointerEvent) => {
      // Touch tap → treat as a "hover" sample at the tap point
      if (e.pointerType !== "mouse") onMove(e);
    };
    const onLeave = (e: PointerEvent) => {
      // Don't clear immediately on touch — pinTimer handles it
      if (isTouch && e.pointerType !== "mouse") return;
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };

    init();
    raf = requestAnimationFrame(tick);
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerdown", onDown);
    wrap.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      if (pinTimer) clearTimeout(pinTimer);
      ro.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerdown", onDown);
      wrap.removeEventListener("pointerleave", onLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={wrapRef}
      data-cursor-ignore
      className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-cream/8 bg-gradient-to-br from-cream/[0.02] via-transparent to-neon/[0.06] sm:h-[520px]"
    >
      <div className="absolute inset-0 grid-bg opacity-30" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {hoverLabel && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-neon/40 bg-background/80 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-neon backdrop-blur"
          style={{
            left: hoverLabel.x,
            top: hoverLabel.y - 28,
            boxShadow: "0 0 20px -4px var(--neon)",
          }}
        >
          {hoverLabel.label} <span className="text-muted-foreground">· {hoverLabel.group}</span>
        </div>
      )}
      <div className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70">
        <span className="hidden sm:inline">Hover · Repel · Connect</span>
        <span className="sm:hidden">Tap · Drift · Connect</span>
      </div>
    </div>
  );
}
