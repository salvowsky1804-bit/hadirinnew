import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";

export interface MusicHandle {
  play: () => void;
}

interface Props {
  src?: string;
  theme: "light" | "dark";
}

/** Floating music toggle. Parent can imperatively start playback from a user gesture. */
export const MusicToggle = forwardRef<MusicHandle, Props>(function MusicToggle(
  { src, theme },
  ref,
) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useImperativeHandle(ref, () => ({
    play: () => {
      const a = audioRef.current;
      if (!a) return;
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    },
  }));

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  if (!src) return null;

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().then(() => setPlaying(true)).catch(() => undefined);
    }
  };

  const isDark = theme === "dark";
  return (
    <>
      <audio ref={audioRef} src={src} loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Hentikan musik" : "Putar musik"}
        aria-pressed={playing}
        className={`fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full shadow-lg backdrop-blur transition hover:scale-105 ${
          isDark
            ? "bg-[var(--gilded)] text-[#1a1612]"
            : "bg-[var(--bordeaux)] text-[var(--ivory)]"
        }`}
      >
        <span
          aria-hidden
          className="text-base"
          style={{ animation: playing ? "spin 4s linear infinite" : undefined }}
        >
          ♪
        </span>
      </button>
      <style>{`@keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }`}</style>
    </>
  );
});