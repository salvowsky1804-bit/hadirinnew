import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { listTemplates } from "@/lib/template-registry";
import {
  dummyDetectedNewTemplate,
  dummyTemplateActiveState,
} from "@/data/dummy";
import { useProjects } from "@/lib/projects-store";

export const Route = createFileRoute("/admin/templates")({
  component: TemplatesCatalog,
});

const ACTIVE_KEY = "studio.templates.active";
const DISMISSED_KEY = "studio.templates.dismissed-new";

function loadActive(): Record<string, boolean> {
  if (typeof window === "undefined") return dummyTemplateActiveState;
  try {
    const raw = window.localStorage.getItem(ACTIVE_KEY);
    return raw ? JSON.parse(raw) : dummyTemplateActiveState;
  } catch {
    return dummyTemplateActiveState;
  }
}

function TemplatesCatalog() {
  const templates = listTemplates();
  const { projects } = useProjects();
  const [active, setActive] = useState<Record<string, boolean>>(() =>
    loadActive(),
  );
  const [dismissedNew, setDismissedNew] = useState(false);
  const [previewSlug, setPreviewSlug] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">(
    "mobile",
  );

  useEffect(() => {
    if (!previewSlug) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewSlug(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [previewSlug]);

  const previewTemplate = templates.find(
    (t) => t.manifest.slug === previewSlug,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(ACTIVE_KEY, JSON.stringify(active));
  }, [active]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setDismissedNew(window.localStorage.getItem(DISMISSED_KEY) === "1");
  }, []);

  const toggle = (slug: string) =>
    setActive((s) => ({ ...s, [slug]: !(s[slug] ?? true) }));

  const usageCount = (slug: string) =>
    projects.filter((p) => p.templateSlug === slug).length;

  const knownSlugs = new Set(templates.map((t) => t.manifest.slug));
  const showNewDetected =
    !knownSlugs.has(dummyDetectedNewTemplate.slug) && !dismissedNew;

  return (
    <section className="space-y-6">
      {showNewDetected && (
        <div className="flex items-start justify-between gap-4 rounded-lg border border-amber-300 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <span
              aria-hidden
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-200 text-amber-900"
            >
              ✦
            </span>
            <div>
              <p className="text-sm font-semibold text-amber-900">
                Template baru terdeteksi: {dummyDetectedNewTemplate.name}
              </p>
              <p className="mt-1 text-xs text-amber-800">
                Folder <code>src/templates/{dummyDetectedNewTemplate.slug}/</code>{" "}
                ditemukan namun manifest belum lengkap. Lengkapi{" "}
                <code>manifest.ts</code> agar otomatis terdaftar di katalog.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              window.localStorage.setItem(DISMISSED_KEY, "1");
              setDismissedNew(true);
            }}
            className="shrink-0 rounded-md border border-amber-400 px-3 py-1.5 text-xs uppercase tracking-widest text-amber-900 hover:bg-amber-100"
          >
            Tutup
          </button>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map(({ manifest }) => {
          const isActive = active[manifest.slug] ?? true;
          const used = usageCount(manifest.slug);
          return (
            <article
              key={manifest.slug}
              className="overflow-hidden rounded-lg border border-border bg-card"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                <img
                  src={manifest.thumbnail}
                  alt={manifest.name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <span
                  className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-widest ${
                    isActive
                      ? "bg-emerald-100 text-emerald-900"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isActive ? "Aktif" : "Nonaktif"}
                </span>
              </div>
              <div className="space-y-3 p-4">
                <div>
                  <h3 className="font-serif text-xl">{manifest.name}</h3>
                  {manifest.tagline && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {manifest.tagline}
                    </p>
                  )}
                </div>
                <dl className="grid grid-cols-3 gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
                  <div>
                    <dt>Kategori</dt>
                    <dd className="mt-0.5 text-foreground normal-case tracking-normal">
                      {manifest.category}
                    </dd>
                  </div>
                  <div>
                    <dt>Paket</dt>
                    <dd className="mt-0.5 text-foreground normal-case tracking-normal">
                      {manifest.internalPackage ?? "—"}
                    </dd>
                  </div>
                  <div>
                    <dt>Dipakai</dt>
                    <dd className="mt-0.5 text-foreground normal-case tracking-normal">
                      {used} proyek
                    </dd>
                  </div>
                </dl>
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="text-xs text-muted-foreground">
                    {manifest.fields.length} field custom
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewSlug(manifest.slug)}
                      className="rounded-md border border-border bg-foreground px-3 py-1.5 text-xs uppercase tracking-widest text-background hover:opacity-90"
                    >
                      Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => toggle(manifest.slug)}
                      className="rounded-md border border-border px-3 py-1.5 text-xs uppercase tracking-widest hover:bg-muted"
                    >
                      {isActive ? "Nonaktifkan" : "Aktifkan"}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {previewTemplate && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Pratinjau template ${previewTemplate.manifest.name}`}
          className="fixed inset-0 z-50 flex flex-col bg-black/70 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewSlug(null);
          }}
        >
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 text-white">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-white/60">
                Pratinjau Template
              </p>
              <h2 className="truncate font-serif text-lg">
                {previewTemplate.manifest.name}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex overflow-hidden rounded-md border border-white/20 text-xs">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`px-3 py-1.5 uppercase tracking-widest ${
                    previewDevice === "mobile"
                      ? "bg-white text-black"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  Mobile
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`px-3 py-1.5 uppercase tracking-widest ${
                    previewDevice === "desktop"
                      ? "bg-white text-black"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  Desktop
                </button>
              </div>
              <a
                href={`/preview/${previewTemplate.manifest.slug}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-white/20 px-3 py-1.5 text-xs uppercase tracking-widest text-white hover:bg-white/10"
              >
                Tab baru
              </a>
              <button
                type="button"
                onClick={() => setPreviewSlug(null)}
                aria-label="Tutup pratinjau"
                className="rounded-md border border-white/20 px-3 py-1.5 text-xs uppercase tracking-widest text-white hover:bg-white/10"
              >
                Tutup
              </button>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center overflow-auto p-4">
            <div
              className={`overflow-hidden rounded-lg bg-white shadow-2xl transition-all ${
                previewDevice === "mobile"
                  ? "h-[min(85vh,820px)] w-[390px] max-w-full"
                  : "h-[min(90vh,900px)] w-full max-w-6xl"
              }`}
            >
              <iframe
                key={previewTemplate.manifest.slug + previewDevice}
                title={`Pratinjau ${previewTemplate.manifest.name}`}
                src={`/preview/${previewTemplate.manifest.slug}`}
                className="h-full w-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
