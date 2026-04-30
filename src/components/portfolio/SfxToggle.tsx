import { useEffect, useState } from "react";
import { initSfx, isSfxEnabled, setSfxEnabled, attachGlobalSfxListeners, play } from "./sfx";

/**
 * Compact toggle for cybernetic UI sound effects.
 * - Lazy-initialises WebAudio on first opt-in (browser autoplay policy)
 * - Persists choice in localStorage
 * - Shows a subtle first-visit hint badge
 */
export function SfxToggle() {
  const [on, setOn] = useState(false);
  const [hint, setHint] = useState(false);

  useEffect(() => {
    initSfx();
    setOn(isSfxEnabled());
    const detach = attachGlobalSfxListeners();
    const seen = localStorage.getItem("portfolio.sfx.seen");
    if (!seen) {
      const t = setTimeout(() => setHint(true), 4200);
      const off = setTimeout(() => {
        setHint(false);
        localStorage.setItem("portfolio.sfx.seen", "1");
      }, 9200);
      return () => {
        clearTimeout(t);
        clearTimeout(off);
        detach();
      };
    }
    return detach;
  }, []);

  const toggle = () => {
    const next = !on;
    setSfxEnabled(next);
    setOn(next);
    setHint(false);
    localStorage.setItem("portfolio.sfx.seen", "1");
    if (next) play("boot");
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={on}
        aria-label={on ? "Mute interface sounds" : "Enable interface sounds"}
        data-sfx="click"
        className="group flex items-center gap-2 rounded-full border border-cream/15 bg-background/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground backdrop-blur transition hover:border-neon/40 hover:text-neon"
      >
        <span
          className={`relative inline-flex h-2 w-2 rounded-full transition ${
            on ? "bg-neon shadow-[0_0_10px_var(--neon)]" : "bg-cream/30"
          }`}
        >
          {on && <span className="absolute inset-0 animate-ping rounded-full bg-neon/60" />}
        </span>
        <span className="hidden sm:inline">{on ? "sfx · on" : "sfx · off"}</span>
        <span className="sm:hidden">{on ? "♪" : "○"}</span>
      </button>

      {hint && !on && (
        <div className="pointer-events-none absolute right-0 top-[calc(100%+10px)] w-[220px] rounded-xl border border-neon/40 bg-background/90 p-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground backdrop-blur-xl">
          <span className="text-neon">tip ·</span> enable sfx for cybernetic feedback on hover &amp; click
          <span className="absolute -top-1 right-6 h-2 w-2 rotate-45 border-l border-t border-neon/40 bg-background/90" />
        </div>
      )}
    </div>
  );
}
