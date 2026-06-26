import { useEffect, useState } from "react";
import { diffParts } from "./utils";

interface Props {
  targetIso: string;
  theme: "light" | "dark";
}

export function Countdown({ targetIso, theme }: Props) {
  const [parts, setParts] = useState(() => diffParts(targetIso));
  useEffect(() => {
    const t = window.setInterval(() => setParts(diffParts(targetIso)), 1000);
    return () => window.clearInterval(t);
  }, [targetIso]);

  const isDark = theme === "dark";
  const items = [
    { label: "Hari", value: parts.days },
    { label: "Jam", value: parts.hours },
    { label: "Menit", value: parts.minutes },
    { label: "Detik", value: parts.seconds },
  ];
  return (
    <div className="flex flex-wrap justify-center gap-3 md:gap-5">
      {items.map((it) => (
        <div
          key={it.label}
          className={`w-20 rounded-md py-3 text-center md:w-24 ${
            isDark
              ? "border border-[var(--gilded)]/30 bg-white/5"
              : "border border-[var(--bordeaux)]/15 bg-white/60"
          }`}
        >
          <div
            className={`font-serif text-2xl md:text-3xl ${
              isDark ? "text-[var(--gilded)]" : "text-[var(--bordeaux)]"
            }`}
          >
            {String(it.value).padStart(2, "0")}
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.25em] opacity-70">
            {it.label}
          </div>
        </div>
      ))}
    </div>
  );
}