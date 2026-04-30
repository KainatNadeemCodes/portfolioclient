import { useEffect, useRef, useState } from "react";

/**
 * Premium custom cursor:
 *  - small dot that tracks pointer 1:1
 *  - large ring that lerps behind for "elastic follow"
 *  - snaps + scales over interactive elements (buttons, links, [data-cursor])
 *  - hides on touch / coarse pointer devices
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    document.documentElement.classList.add("cursor-none-root");

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: target.x, y: target.y };
    let raf = 0;
    let snapRect: DOMRect | null = null;
    let hovering = false;
    let pressed = false;

    const apply = () => {
      // dot follows raw pointer
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      }
      // ring lerps toward snap-target if hovering, else pointer
      let tx = target.x;
      let ty = target.y;
      if (snapRect) {
        tx = snapRect.left + snapRect.width / 2;
        ty = snapRect.top + snapRect.height / 2;
      }
      ring.x += (tx - ring.x) * 0.2;
      ring.y += (ty - ring.y) * 0.2;
      if (ringRef.current) {
        const scale = pressed ? 0.85 : hovering ? 1.6 : 1;
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      }
      raf = requestAnimationFrame(apply);
    };
    raf = requestAnimationFrame(apply);

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      // re-evaluate snap when not currently snapped
      if (!hovering) snapRect = null;
    };

    const interactiveSelector =
      'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor="hover"]';

    const onOver = (e: Event) => {
      const el = e.target as HTMLElement | null;
      if (!el || !el.closest) return;
      const hit = el.closest<HTMLElement>(interactiveSelector);
      if (hit && !hit.hasAttribute("data-cursor-ignore")) {
        hovering = true;
        snapRect = hit.getBoundingClientRect();
        ringRef.current?.classList.add("is-hover");
      }
    };
    const onOut = (e: Event) => {
      const el = e.target as HTMLElement | null;
      if (!el || !el.closest) return;
      const hit = el.closest<HTMLElement>(interactiveSelector);
      if (hit) {
        hovering = false;
        snapRect = null;
        ringRef.current?.classList.remove("is-hover");
      }
    };
    const onDown = (e: PointerEvent) => {
      pressed = true;
      ringRef.current?.classList.add("is-press");
      // emit cybernetic ripple at click point
      const ripple = document.createElement("span");
      ripple.className = "cursor-ripple";
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    };
    const onUp = () => {
      pressed = false;
      ringRef.current?.classList.remove("is-press");
    };

    const onLeaveDoc = () => {
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };
    const onEnterDoc = () => {
      if (dotRef.current) dotRef.current.style.opacity = "1";
      if (ringRef.current) ringRef.current.style.opacity = "1";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, true);
    document.addEventListener("pointerout", onOut, true);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("mouseleave", onLeaveDoc);
    document.addEventListener("mouseenter", onEnterDoc);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver, true);
      document.removeEventListener("pointerout", onOut, true);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeaveDoc);
      document.removeEventListener("mouseenter", onEnterDoc);
      document.documentElement.classList.remove("cursor-none-root");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="custom-cursor-ring pointer-events-none fixed left-0 top-0 z-[200] h-9 w-9 rounded-full border border-neon/60 mix-blend-difference"
        style={{
          transition: "opacity 200ms ease, border-color 200ms ease",
          willChange: "transform",
        }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="custom-cursor-dot pointer-events-none fixed left-0 top-0 z-[201] h-1.5 w-1.5 rounded-full bg-neon"
        style={{
          boxShadow: "0 0 12px var(--neon)",
          willChange: "transform",
        }}
      />
    </>
  );
}
