import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { resetProjectsStorage } from "@/lib/projects-store";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

interface StudioSettings {
  studioName: string;
  contactEmail: string;
  whatsappNumber: string;
  defaultTemplate: string;
  enableMusicByDefault: boolean;
  enableGuestMessages: boolean;
}

const STORAGE = "studio.settings.v1";
const DEFAULTS: StudioSettings = {
  studioName: "Studio Undangan",
  contactEmail: "halo@studio.id",
  whatsappNumber: "+62 812-0000-0000",
  defaultTemplate: "aksara",
  enableMusicByDefault: true,
  enableGuestMessages: true,
};

function loadSettings(): StudioSettings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

function SettingsPage() {
  const [settings, setSettings] = useState<StudioSettings>(() => loadSettings());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 1800);
    return () => clearTimeout(t);
  }, [saved]);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    window.localStorage.setItem(STORAGE, JSON.stringify(settings));
    setSaved(true);
  };

  const set = <K extends keyof StudioSettings>(k: K, v: StudioSettings[K]) =>
    setSettings((s) => ({ ...s, [k]: v }));

  const inputCls =
    "w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-foreground focus:outline-none";

  return (
    <form onSubmit={save} className="max-w-2xl space-y-8">
      <section className="rounded-lg border border-border bg-card p-5">
        <h3 className="font-serif text-lg">Identitas Studio</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Muncul di footer undangan & email koordinasi.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Nama Studio">
            <input
              value={settings.studioName}
              onChange={(e) => set("studioName", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Email Kontak">
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => set("contactEmail", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="WhatsApp">
            <input
              value={settings.whatsappNumber}
              onChange={(e) => set("whatsappNumber", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Template Default">
            <select
              value={settings.defaultTemplate}
              onChange={(e) => set("defaultTemplate", e.target.value)}
              className={inputCls}
            >
              <option value="aksara">Aksara</option>
              <option value="senandika">Senandika</option>
            </select>
          </Field>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card p-5">
        <h3 className="font-serif text-lg">Preferensi Tampilan Tamu</h3>
        <div className="mt-4 space-y-3">
          <Toggle
            label="Aktifkan musik secara default"
            checked={settings.enableMusicByDefault}
            onChange={(v) => set("enableMusicByDefault", v)}
          />
          <Toggle
            label="Izinkan tamu mengirim ucapan"
            checked={settings.enableGuestMessages}
            onChange={(v) => set("enableGuestMessages", v)}
          />
        </div>
      </section>

      <section className="rounded-lg border border-red-200 bg-red-50 p-5">
        <h3 className="font-serif text-lg text-red-900">Zona Berbahaya</h3>
        <p className="mt-1 text-xs text-red-800">
          Reset penyimpanan lokal akan menghapus semua proyek yang dibuat di
          browser ini.
        </p>
        <button
          type="button"
          onClick={() => {
            if (!confirm("Reset semua data proyek lokal?")) return;
            resetProjectsStorage();
            window.location.reload();
          }}
          className="mt-3 rounded-md border border-red-400 px-3 py-1.5 text-xs uppercase tracking-widest text-red-900 hover:bg-red-100"
        >
          Reset data proyek
        </button>
      </section>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="rounded-md bg-foreground px-5 py-2 text-sm text-background hover:opacity-90"
        >
          Simpan Perubahan
        </button>
        {saved && (
          <span className="text-sm text-emerald-700">Tersimpan ✓</span>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2 text-sm">
      <span>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-foreground" : "bg-muted"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-background transition ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </label>
  );
}
