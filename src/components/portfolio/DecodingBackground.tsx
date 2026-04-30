import { useEffect, useRef } from "react";

/**
 * Generative "decoding" overlay for the hero:
 *  - falling glyph columns (matrix-like, restrained)
 *  - characters near the bottom solidify into amber as scroll progresses
 *  - completely behind the hero copy, low opacity, GPU-cheap
 */
export function DecodingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = window.innerWidth;
    let h = window.innerHeight;
    const fontSize = 14;
    let cols = 0;
    let drops: number[] = [];
    let chars: string[][] = [];
    let raf = 0;
    let lastDraw = 0;
    let scrollProgress = 0;

    const charset =
      "01アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEFGHabcdef{}[]<>=+-*/&|".split("");

    const resize = () => {
      w = window.innerWidth;
      h = Math.max(window.innerHeight, 720);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.floor(w / fontSize);
      drops = Array.from({ length: cols }, () => Math.random() * (h / fontSize));
      chars = Array.from({ length: cols }, () =>
        Array.from({ length: Math.ceil(h / fontSize) }, () =>
          charset[(Math.random() * charset.length) | 0],
        ),
      );
    };

    const onScroll = () => {
      const max = Math.max(1, window.innerHeight * 0.9);
      scrollProgress = Math.min(1, Math.max(0, window.scrollY / max));
    };

    const draw = (t: number) => {
      const interval = reduce ? 240 : 70;
      if (t - lastDraw < interval) {
        raf = requestAnimationFrame(draw);
        return;
      }
      lastDraw = t;

      // trail
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect(0, 0, w, h);

      ctx.font = `${fontSize}px "JetBrains Mono", ui-monospace, monospace`;
      for (let i = 0; i < cols; i++) {
        const y = drops[i] * fontSize;
        const ch = chars[i][drops[i] | 0] || charset[0];

        // vertical position factor: 0 top → 1 bottom
        const yFactor = Math.min(1, y / h);
        // "decoded" zone grows with scroll
        const decodeThreshold = 0.55 - scrollProgress * 0.5;
        const decoded = yFactor > decodeThreshold;

        if (decoded) {
          // amber glow head
          const intensity = Math.min(1, (yFactor - decodeThreshold) * 2);
          ctx.fillStyle = `rgba(255, 196, 110, ${0.18 + intensity * 0.5})`;
        } else {
          ctx.fillStyle = "rgba(180, 180, 180, 0.12)";
        }
        ctx.fillText(ch, i * fontSize, y);

        // head highlight
        if (Math.random() > 0.985) {
          ctx.fillStyle = "rgba(255, 220, 150, 0.9)";
          ctx.fillText(ch, i * fontSize, y);
        }

        if (y > h && Math.random() > 0.975) {
          drops[i] = 0;
        } else {
          drops[i] += 1;
        }
        // occasionally swap glyph
        if (Math.random() > 0.97) {
          chars[i][drops[i] | 0] = charset[(Math.random() * charset.length) | 0];
        }
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    onScroll();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        maskImage:
          "radial-gradient(ellipse at 50% 40%, black 0%, black 35%, transparent 80%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at 50% 40%, black 0%, black 35%, transparent 80%)",
        opacity: 0.55,
      }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
