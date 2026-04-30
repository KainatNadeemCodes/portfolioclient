import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Linkedin, Mail, MapPin, Send } from "lucide-react";
import { SectionLabel } from "./Summary";
import { Magnetic } from "./Magnetic";
import { CinematicSection, ParallaxLayer } from "./CinematicSection";

export function ContactTerminal() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio inquiry — ${name || "Hello"}`);
    const body = encodeURIComponent(`${msg}\n\n— ${name}\n${email}`);
    window.location.href = `mailto:raoengr1080@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <CinematicSection id="contact" className="relative px-6 py-32">
      {({ progress }) => (
        <div className="mx-auto max-w-5xl">
          <ParallaxLayer progress={progress} depth={-0.4}>
            <SectionLabel index="06" label="Let's Connect" />
            <h2 className="text-display mt-6 text-4xl sm:text-5xl md:text-6xl">
              Open a <span className="neon-text">channel</span>.
            </h2>
          </ParallaxLayer>

          <ParallaxLayer progress={progress} depth={0.25}>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7 }}
          className="glass mt-12 overflow-hidden rounded-3xl"
        >
          {/* terminal bar */}
          <div className="flex items-center justify-between border-b border-white/5 bg-black/40 px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
            </div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              ~/abdullah · ssh contact
            </div>
            <div className="font-mono text-[11px] text-neon">●&nbsp;live</div>
          </div>

          <div className="grid gap-0 md:grid-cols-[1.1fr_1fr]">
            {/* form */}
            <form onSubmit={onSubmit} className="space-y-5 p-7 font-mono text-sm">
              <Field
                label="$ user.name"
                value={name}
                onChange={setName}
                placeholder="Ada Lovelace"
              />
              <Field
                label="$ user.email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="ada@compute.dev"
              />
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-neon">
                  $ message --body
                </label>
                <textarea
                  required
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  rows={5}
                  placeholder="Tell me about the model you want to build…"
                  className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-black/60 p-3 text-foreground placeholder:text-muted-foreground/50 focus:border-neon/60 focus:outline-none focus:ring-2 focus:ring-neon/30"
                />
              </div>

              <Magnetic strength={12} innerStrength={0.5} className="block w-full">
                <button
                  type="submit"
                  className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-neon px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01]"
                  style={{ boxShadow: "0 0 30px -8px var(--neon)" }}
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  {sent ? "transmitted ✓" : "transmit"}
                  <Send className="h-4 w-4" />
                </button>
              </Magnetic>
            </form>

            {/* info */}
            <div className="space-y-3 border-t border-white/5 bg-black/30 p-7 md:border-l md:border-t-0">
              <InfoRow
                icon={Mail}
                label="email"
                value="raoengr1080@gmail.com"
                href="mailto:raoengr1080@gmail.com"
              />
              <InfoRow
                icon={Linkedin}
                label="linkedin"
                value="raoabdullah1080"
                href="https://www.linkedin.com/in/raoabdullah1080/"
              />
              <InfoRow icon={MapPin} label="location" value="Sahiwal · Punjab, PK" />

              <div className="mt-6 rounded-xl border border-white/5 bg-black/40 p-4 font-mono text-[11px] leading-relaxed text-muted-foreground">
                <span className="text-neon">›</span> avg. response &lt; 24h
                <br />
                <span className="text-neon">›</span> open to ML / NLP / Applied AI roles
                <br />
                <span className="text-neon">›</span> remote · hybrid · on-site
              </div>
            </div>
          </div>
          </motion.div>

            <footer className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-8 text-xs text-muted-foreground sm:flex-row">
              <div className="font-mono">
                © 2026 Muhammad Abdullah · <span className="text-neon">decoded with care</span>
              </div>
              <div className="font-mono uppercase tracking-widest">
                Built with React · Framer Motion
              </div>
            </footer>
          </ParallaxLayer>
        </div>
      )}
    </CinematicSection>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-widest text-neon">{label}</label>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-lg border border-white/10 bg-black/60 p-3 text-foreground placeholder:text-muted-foreground/50 focus:border-neon/60 focus:outline-none focus:ring-2 focus:ring-neon/30"
      />
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="glow-hover flex items-center gap-3 rounded-xl border border-white/5 bg-black/40 p-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-neon/30 bg-neon/10 text-neon">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {label}
        </div>
        <div className="truncate text-sm text-foreground">{value}</div>
      </div>
    </div>
  );
  return href ? (
    <a href={href} target="_blank" rel="noreferrer">
      {inner}
    </a>
  ) : (
    inner
  );
}
