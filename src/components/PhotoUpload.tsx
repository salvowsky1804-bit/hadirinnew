import { useRef, useState } from "react";
import { uploadInvitationMedia } from "@/lib/media";

interface Props {
  projectId: string;
  value?: string;
  kind?: "cover" | "person" | "gallery" | "misc";
  onChange: (url: string) => void;
  label?: string;
  aspect?: "square" | "portrait" | "landscape";
}

export function PhotoUpload({
  projectId,
  value,
  onChange,
  kind = "misc",
  label = "Foto",
  aspect = "square",
}: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function pick(f: File) {
    setBusy(true);
    setErr(null);
    try {
      const { url } = await uploadInvitationMedia(projectId, f, kind);
      onChange(url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload gagal");
    } finally {
      setBusy(false);
    }
  }

  const box =
    aspect === "portrait"
      ? "aspect-[3/4]"
      : aspect === "landscape"
        ? "aspect-[4/3]"
        : "aspect-square";

  return (
    <div className="space-y-2">
      <span className="lbl">{label}</span>
      <div
        className={`relative w-32 overflow-hidden rounded-md border border-dashed border-border bg-muted/30 ${box}`}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-[10px] uppercase tracking-widest text-muted-foreground">
            {busy ? "Mengunggah…" : "Belum ada foto"}
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={busy}
          className="rounded-md border border-border px-2.5 py-1 hover:bg-muted disabled:opacity-50"
        >
          {value ? "Ganti" : "Unggah"}
        </button>
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-destructive hover:underline"
          >
            hapus
          </button>
        ) : null}
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) pick(f);
            e.target.value = "";
          }}
        />
      </div>
      {err ? <p className="text-xs text-destructive">{err}</p> : null}
    </div>
  );
}