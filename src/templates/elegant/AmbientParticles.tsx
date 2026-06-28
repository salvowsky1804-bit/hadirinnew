import { useMemo } from "react";

interface Props {
  count?: number;
  className?: string;
}

/** Floating golden particles, CSS-only, GPU-accelerated. */
export function AmbientParticles({ count = 14, className = "" }: Props) {
  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 6;
        const duration = 8 + Math.random() * 8;
        const size = 2 + Math.random() * 3;
        return { i, left, delay, duration, size };
      }),
    [count],
  );
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {items.map((p) => (
        <span
          key={p.i}
          className="elegant-particle"
          style={{
            left: `${p.left}%`,
            bottom: "-10px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}