import type { ReactNode } from "react";
import { AmbientParticles } from "./AmbientParticles";

interface SectionShellProps {
  bgImage?: string;
  sideLabel?: string;
  ornaments?: boolean;
  particles?: number;
  children: ReactNode;
  className?: string;
}

/**
 * Cinematic section wrapper: blurred hero backdrop + onyx overlay,
 * optional vertical side labels, gold corner ornaments, ambient particles.
 */
export function SectionShell({
  bgImage,
  sideLabel,
  ornaments = false,
  particles = 0,
  children,
  className = "",
}: SectionShellProps) {
  return (
    <section
      className={`relative w-full overflow-hidden px-5 py-16 sm:px-8 md:py-24 ${className}`}
    >
      {bgImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${bgImage})`,
              filter: "blur(10px)",
              transform: "scale(1.12)",
            }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-[var(--onyx)]/85" />
        </>
      )}
      {particles > 0 && <AmbientParticles count={particles} />}
      {sideLabel && (
        <>
          <VerticalLabel text={sideLabel} side="left" />
          <VerticalLabel text={sideLabel} side="right" />
        </>
      )}
      {ornaments && <CornerOrnaments />}
      <div className="relative z-10 mx-auto w-full max-w-3xl">{children}</div>
    </section>
  );
}

function VerticalLabel({ text, side }: { text: string; side: "left" | "right" }) {
  return (
    <div
      className={`pointer-events-none absolute top-1/2 z-10 hidden -translate-y-1/2 select-none md:block ${
        side === "left" ? "left-4" : "right-4"
      }`}
      aria-hidden
    >
      <div
        className="flex items-center gap-3 text-[var(--cream)]/60"
        style={{
          writingMode: "vertical-rl",
          transform: side === "left" ? "rotate(180deg)" : "none",
        }}
      >
        <span
          className="text-lg italic"
          style={{ fontFamily: '"Cormorant", "Cormorant Garamond", serif' }}
        >
          The
        </span>
        <span className="font-serif text-[10px] uppercase elegant-track-3">{text}</span>
      </div>
    </div>
  );
}

function CornerOrnaments() {
  const svg = (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M2 18 V2 H18" />
      <path d="M8 2 H2 V8" opacity="0.6" />
      <circle cx="2" cy="2" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
  return (
    <>
      <span className="elegant-corner top-4 left-4">{svg}</span>
      <span className="elegant-corner top-4 right-4" style={{ transform: "scaleX(-1)" }}>
        {svg}
      </span>
      <span className="elegant-corner bottom-4 left-4" style={{ transform: "scaleY(-1)" }}>
        {svg}
      </span>
      <span
        className="elegant-corner bottom-4 right-4"
        style={{ transform: "scale(-1,-1)" }}
      >
        {svg}
      </span>
    </>
  );
}