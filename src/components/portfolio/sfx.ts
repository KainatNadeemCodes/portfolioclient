/**
 * Lightweight WebAudio synth for cybernetic UI sound effects.
 * No assets — every sound is generated procedurally.
 *
 * Persisted opt-in lives at localStorage["portfolio.sfx"] = "1" | "0".
 * Audio context is created lazily on first user gesture (browser autoplay policy).
 */

type Sound = "hover" | "click" | "open" | "close" | "transition" | "boot";

const KEY = "portfolio.sfx";
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = false;
let lastHoverAt = 0;

function readEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(KEY) === "1";
}

export function isSfxEnabled(): boolean {
  return enabled;
}

export function setSfxEnabled(v: boolean) {
  enabled = v;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, v ? "1" : "0");
    window.dispatchEvent(new CustomEvent("sfx:change", { detail: v }));
  }
  if (v) {
    ensureCtx();
    play("click");
  }
}

export function initSfx() {
  enabled = readEnabled();
}

function ensureCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext })
        .AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.18;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

function blip(opts: {
  freq: number;
  type?: OscillatorType;
  attack?: number;
  decay?: number;
  gain?: number;
  slideTo?: number;
  slideTime?: number;
}) {
  const c = ensureCtx();
  if (!c || !master) return;
  const t = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = opts.type ?? "sine";
  osc.frequency.setValueAtTime(opts.freq, t);
  if (opts.slideTo) {
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(20, opts.slideTo),
      t + (opts.slideTime ?? 0.12),
    );
  }
  const peak = opts.gain ?? 0.6;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(peak, t + (opts.attack ?? 0.005));
  g.gain.exponentialRampToValueAtTime(0.0001, t + (opts.attack ?? 0.005) + (opts.decay ?? 0.12));
  osc.connect(g).connect(master);
  osc.start(t);
  osc.stop(t + 0.5);
}

function noiseBurst(duration = 0.08, gain = 0.15, hp = 1200) {
  const c = ensureCtx();
  if (!c || !master) return;
  const t = c.currentTime;
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * duration), c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = c.createBufferSource();
  src.buffer = buf;
  const filter = c.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = hp;
  const g = c.createGain();
  g.gain.value = gain;
  src.connect(filter).connect(g).connect(master);
  src.start(t);
}

export function play(sound: Sound) {
  if (!enabled) return;
  switch (sound) {
    case "hover": {
      // throttle hover so it doesn't machine-gun
      const now = performance.now();
      if (now - lastHoverAt < 60) return;
      lastHoverAt = now;
      blip({ freq: 1800, type: "sine", attack: 0.002, decay: 0.05, gain: 0.18 });
      break;
    }
    case "click":
      blip({ freq: 880, type: "triangle", attack: 0.002, decay: 0.09, gain: 0.35, slideTo: 320, slideTime: 0.08 });
      noiseBurst(0.04, 0.08, 2400);
      break;
    case "open":
      blip({ freq: 220, type: "sawtooth", attack: 0.005, decay: 0.22, gain: 0.18, slideTo: 880, slideTime: 0.18 });
      blip({ freq: 1320, type: "sine", attack: 0.005, decay: 0.18, gain: 0.12 });
      break;
    case "close":
      blip({ freq: 880, type: "sawtooth", attack: 0.004, decay: 0.18, gain: 0.16, slideTo: 180, slideTime: 0.16 });
      break;
    case "transition":
      noiseBurst(0.18, 0.05, 600);
      blip({ freq: 110, type: "sine", attack: 0.01, decay: 0.3, gain: 0.1, slideTo: 55, slideTime: 0.3 });
      break;
    case "boot":
      blip({ freq: 60, type: "sine", attack: 0.02, decay: 0.5, gain: 0.18, slideTo: 240, slideTime: 0.4 });
      blip({ freq: 1200, type: "triangle", attack: 0.005, decay: 0.18, gain: 0.08 });
      break;
  }
}

/**
 * Mount once near the root: wires global listeners that emit hover/click sounds
 * for any element marked with data-sfx="hover" or data-sfx="click".
 */
export function attachGlobalSfxListeners() {
  if (typeof window === "undefined") return () => {};
  const onOver = (e: Event) => {
    const t = e.target as HTMLElement | null;
    if (!t?.closest) return;
    if (t.closest('[data-sfx~="hover"], a, button')) play("hover");
  };
  const onDown = (e: Event) => {
    const t = e.target as HTMLElement | null;
    if (!t?.closest) return;
    if (t.closest('[data-sfx~="click"], button, a')) play("click");
  };
  window.addEventListener("pointerover", onOver, { passive: true });
  window.addEventListener("pointerdown", onDown, { passive: true });
  return () => {
    window.removeEventListener("pointerover", onOver);
    window.removeEventListener("pointerdown", onDown);
  };
}
