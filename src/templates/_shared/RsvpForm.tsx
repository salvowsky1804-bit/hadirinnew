import { useState } from "react";
import { useProjects } from "@/lib/projects-store";
import type { RsvpStatus } from "@/types/invitation";

interface Props {
  projectId?: string;
  guestName?: string;
  theme: "light" | "dark";
}

export function RsvpForm({ projectId, guestName, theme }: Props) {
  const { addRsvp, addWish } = useProjects();
  const [name, setName] = useState(guestName ?? "");
  const [status, setStatus] = useState<RsvpStatus>("attending");
  const [pax, setPax] = useState(1);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isDark = theme === "dark";
  const inputCls = isDark
    ? "w-full rounded-md border border-[var(--gilded)]/30 bg-white/5 px-3 py-2 text-[var(--ivory)] placeholder:text-[var(--ivory)]/40 focus:border-[var(--gilded)] focus:outline-none"
    : "w-full rounded-md border border-[var(--bordeaux)]/20 bg-white px-3 py-2 text-[var(--charcoal)] placeholder:text-[var(--stone)]/60 focus:border-[var(--bordeaux)] focus:outline-none";

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId || !name.trim()) return;
    addRsvp(projectId, { guestName: name.trim(), status, pax });
    if (message.trim()) {
      addWish(projectId, { guestName: name.trim(), message: message.trim() });
    }
    setSubmitted(true);
    setMessage("");
  };

  if (submitted) {
    return (
      <div
        className={`rounded-lg p-6 text-center ${
          isDark
            ? "border border-[var(--gilded)]/30 bg-white/5"
            : "border border-[var(--bordeaux)]/15 bg-white/60"
        }`}
      >
        <p className="font-serif text-2xl italic">Terima kasih</p>
        <p className="mt-2 text-sm opacity-80">
          Konfirmasi & doa Anda telah kami terima.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 text-left">
      <div>
        <label className="mb-1 block text-xs uppercase tracking-[0.2em] opacity-70">
          Nama
        </label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputCls}
          placeholder="Nama Anda"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-[0.2em] opacity-70">
            Kehadiran
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as RsvpStatus)}
            className={inputCls}
          >
            <option value="attending">Hadir</option>
            <option value="tentative">Mungkin</option>
            <option value="not_attending">Tidak hadir</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-[0.2em] opacity-70">
            Jumlah tamu
          </label>
          <input
            type="number"
            min={1}
            max={10}
            value={pax}
            onChange={(e) => setPax(Number(e.target.value))}
            className={inputCls}
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs uppercase tracking-[0.2em] opacity-70">
          Ucapan & Doa (opsional)
        </label>
        <textarea
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={inputCls}
          placeholder="Doa terbaik untuk pengantin…"
        />
      </div>
      <button
        type="submit"
        className={`w-full rounded-full px-6 py-3 text-xs font-medium uppercase tracking-[0.3em] transition hover:scale-[1.01] ${
          isDark
            ? "bg-[var(--gilded)] text-[#1a1612]"
            : "bg-[var(--bordeaux)] text-[var(--ivory)]"
        }`}
      >
        Kirim Konfirmasi
      </button>
    </form>
  );
}