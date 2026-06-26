import { useEffect, useState, type ReactNode } from "react";

interface Props {
  coupleLabel: string;
  guestName?: string;
  buttonLabel?: string;
  background: ReactNode;
  theme: "light" | "dark";
  onOpen?: () => void;
}

/**
 * Full-screen "Buka Undangan" gate that locks scroll until the guest opts in.
 * Mounting `onOpen` lets parent start music in the same user gesture.
 */
export function OpeningGate({
  coupleLabel,
  guestName,
  buttonLabel = "Buka Undangan",
  background,
  theme,
  onOpen,
}: Props) {
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (open) return null;

  const isDark = theme === "dark";
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pembuka undangan"
      style={{
        opacity: leaving ? 0 : 1,
        transition: "opacity 600ms ease",
      }}
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden ${
        isDark ? "text-[var(--ivory)]" : "text-[var(--charcoal)]"
      }`}
    >
      <div className="absolute inset-0">{background}</div>
      <div
        className={`absolute inset-0 ${
          isDark
            ? "bg-gradient-to-b from-black/60 via-black/70 to-black/85"
            : "bg-gradient-to-b from-[var(--ivory)]/70 via-[var(--ivory)]/80 to-[var(--ivory)]/95"
        }`}
      />
      <div className="relative mx-auto flex max-w-md flex-col items-center px-6 text-center">
        <p className="text-[0.7rem] uppercase tracking-[0.4em] opacity-80">
          The Wedding of
        </p>
        <h1
          className="mt-6 font-serif text-4xl italic leading-tight md:text-5xl"
          style={{ animation: "fade-in 900ms ease-out both" }}
        >
          {coupleLabel}
        </h1>
        <div
          className={`mt-8 h-px w-16 ${isDark ? "bg-[var(--gilded)]" : "bg-[var(--bordeaux)]"}`}
        />
        <p className="mt-8 text-xs uppercase tracking-[0.3em] opacity-70">
          Kepada Yth.
        </p>
        <p className="mt-2 font-serif text-xl">
          {guestName ?? "Bapak / Ibu / Saudara / i"}
        </p>
        <button
          type="button"
          onClick={() => {
            setLeaving(true);
            onOpen?.();
            window.setTimeout(() => setOpen(true), 550);
          }}
          className={`mt-10 rounded-full px-8 py-3 text-xs font-medium uppercase tracking-[0.3em] transition hover:scale-[1.03] ${
            isDark
              ? "bg-[var(--gilded)] text-[#1a1612] hover:bg-[var(--gilded)]/90"
              : "bg-[var(--bordeaux)] text-[var(--ivory)] hover:bg-[var(--bordeaux)]/90"
          }`}
        >
          ✦ {buttonLabel}
        </button>
      </div>
    </div>
  );
}