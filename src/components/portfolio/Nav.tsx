import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Magnetic } from "./Magnetic";
import { SfxToggle } from "./SfxToggle";

const links = [
  { href: "#summary", label: "Intelligence" },
  { href: "#stack", label: "Expertise" },
  { href: "#vault", label: "Work" },
  { href: "#human", label: "Human" },
  { href: "#certs", label: "Credentials" },
  { href: "#timeline", label: "Experience" },
  { href: "#contact", label: "Connect" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);

  return (
    <>
      <motion.div
        style={{ scaleX }}
        className="fixed left-0 right-0 top-0 z-50 h-px origin-left bg-neon"
      />
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
          scrolled ? "py-3" : "py-6"
        }`}
      >
        <div
          className={`mx-auto flex max-w-6xl items-center justify-between px-6 ${
            scrolled ? "glass-soft rounded-full" : ""
          }`}
        >
          <Link to="/" className="group flex items-center gap-2">
            <span className="relative flex h-7 w-7 items-center justify-center rounded-md border border-neon/40 bg-black">
              <span className="text-[11px] font-bold tracking-tighter neon-text">MA</span>
              <span className="absolute inset-0 rounded-md bg-neon/15 blur-md opacity-0 transition-opacity group-hover:opacity-100" />
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
              abdullah<span className="text-neon">.</span>ds
            </span>
          </Link>

          <nav className="hidden gap-1 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <SfxToggle />
            <Magnetic strength={10} innerStrength={0.45} className="hidden md:inline-block">
              <a
                href="#contact"
                className="rounded-full border border-neon/40 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-neon transition-all hover:bg-neon/10 hover:shadow-[0_0_24px_-4px_var(--neon)]"
              >
                Connect
              </a>
            </Magnetic>

            {/* Mobile menu trigger */}
            <button
              type="button"
              aria-label={menu ? "Close menu" : "Open menu"}
              aria-expanded={menu}
              onClick={() => setMenu((m) => !m)}
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 bg-background/60 backdrop-blur md:hidden"
            >
              <span className="sr-only">Menu</span>
              <span
                className={`absolute h-px w-4 bg-cream transition-transform ${
                  menu ? "translate-y-0 rotate-45" : "-translate-y-1.5"
                }`}
              />
              <span
                className={`absolute h-px w-4 bg-cream transition-opacity ${
                  menu ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute h-px w-4 bg-cream transition-transform ${
                  menu ? "translate-y-0 -rotate-45" : "translate-y-1.5"
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menu && (
          <motion.div
            key="m-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-30 bg-background/95 backdrop-blur-xl md:hidden"
            onClick={() => setMenu(false)}
          >
            <motion.nav
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
              className="flex h-full flex-col items-start justify-center gap-1 px-8 pt-16"
            >
              {links.map((l, i) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenu(false)}
                  className="text-display flex w-full items-center justify-between border-b border-cream/10 py-4 text-3xl text-foreground"
                >
                  <span>{l.label}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-neon">
                    0{i + 1}
                  </span>
                </a>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
