import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Search, ExternalLink } from "lucide-react";
import { listTemplates } from "@/lib/template-registry";
import { fetchTemplateThumbnailMap } from "@/lib/template-thumbnails";

export const Route = createFileRoute("/katalog")({
  head: () => ({
    meta: [
      { title: "Katalog Template Undangan — Senandika Studio" },
      {
        name: "description",
        content:
          "Jelajahi seluruh koleksi template undangan pernikahan digital kami. Saring berdasarkan kategori dan paket, lalu lihat pratinjau langsung.",
      },
      { property: "og:title", content: "Katalog Template Undangan" },
      {
        property: "og:description",
        content: "Seluruh koleksi template undangan digital Senandika Studio.",
      },
    ],
  }),
  component: KatalogPage,
});

type DeviceMode = "mobile" | "desktop";

function KatalogPage() {
  const templates = listTemplates();
  const [thumbs, setThumbs] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | "online" | "offline">("all");
  const [pkg, setPkg] = useState<string>("all");
  const [previewSlug, setPreviewSlug] = useState<string | null>(null);
  const [device, setDevice] = useState<DeviceMode>("desktop");

  useEffect(() => {
    let alive = true;
    fetchTemplateThumbnailMap()
      .then((m) => {
        if (alive) setThumbs(m);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const packages = useMemo(() => {
    const s = new Set<string>();
    templates.forEach((t) => {
      if (t.manifest.internalPackage) s.add(t.manifest.internalPackage);
    });
    return Array.from(s).sort();
  }, [templates]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return templates.filter(({ manifest: m }) => {
      if (category !== "all" && m.category !== category) return false;
      if (pkg !== "all" && m.internalPackage !== pkg) return false;
      if (q) {
        const hay = `${m.name} ${m.tagline ?? ""} ${m.internalPackage ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [templates, category, pkg, query]);

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

  const previewTpl = templates.find((t) => t.manifest.slug === previewSlug);

  return (
    <div className="min-h-dvh bg-ivory text-charcoal">
      <header className="border-b border-charcoal/10 bg-ivory/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-10">
          <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-stone hover:text-bordeaux">
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Link>
          <Link to="/" className="flex items-baseline gap-2">
            <span className="font-serif text-xl italic text-bordeaux">Senandika</span>
            <span className="text-[10px] uppercase tracking-[0.35em] text-stone">Studio</span>
          </Link>
          <a
            href="#kontak"
            className="rounded-full bg-bordeaux px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-ivory hover:bg-charcoal"
          >
            Konsultasi
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-20">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.45em] text-gilded">Katalog Template</p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-charcoal md:text-5xl">
            Jelajahi seluruh <span className="italic text-bordeaux">koleksi undangan</span> kami.
          </h1>
          <p className="mt-5 text-sm leading-loose text-stone md:text-base">
            Saring berdasarkan kategori dan paket, cari nama template, atau langsung lihat pratinjaunya.
          </p>
        </div>

        {/* Filters */}
        <div className="mt-10 flex flex-wrap items-center gap-3 rounded-2xl border border-charcoal/10 bg-white/60 p-4 shadow-sm">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari template..."
              className="w-full rounded-full border border-charcoal/15 bg-ivory py-2.5 pl-9 pr-4 text-sm outline-none focus:border-bordeaux"
            />
          </div>

          <FilterGroup
            label="Kategori"
            value={category}
            onChange={(v) => setCategory(v as typeof category)}
            options={[
              { value: "all", label: "Semua" },
              { value: "online", label: "Online" },
              { value: "offline", label: "Offline" },
            ]}
          />

          {packages.length > 0 && (
            <FilterGroup
              label="Paket"
              value={pkg}
              onChange={setPkg}
              options={[
                { value: "all", label: "Semua" },
                ...packages.map((p) => ({ value: p, label: p })),
              ]}
            />
          )}
        </div>

        <p className="mt-5 text-xs uppercase tracking-[0.25em] text-stone">
          Menampilkan {filtered.length} dari {templates.length} template
        </p>

        {/* Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(({ manifest: m }) => {
            const thumb = thumbs[m.slug] ?? m.thumbnail;
            return (
              <article
                key={m.slug}
                className="group overflow-hidden rounded-2xl border border-charcoal/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-bordeaux/10"
              >
                <button
                  type="button"
                  onClick={() => {
                    setDevice("desktop");
                    setPreviewSlug(m.slug);
                  }}
                  className="relative block aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-cream to-ivory"
                >
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={`Thumbnail template ${m.name}`}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : null}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 text-left">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-gilded">{m.internalPackage ?? m.category}</p>
                    <h3 className="mt-1 font-serif text-2xl italic text-ivory drop-shadow">{m.name}</h3>
                  </div>
                  <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.2em] text-charcoal">
                    {m.category}
                  </span>
                </button>
                <div className="flex items-center justify-between gap-3 p-4">
                  <p className="line-clamp-2 text-xs leading-relaxed text-stone">{m.tagline ?? "—"}</p>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setDevice("desktop");
                        setPreviewSlug(m.slug);
                      }}
                      className="rounded-full bg-bordeaux px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-ivory hover:bg-charcoal"
                    >
                      Pratinjau
                    </button>
                    <a
                      href={`/preview/${m.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Buka pratinjau ${m.name} di tab baru`}
                      className="rounded-full border border-charcoal/20 p-1.5 text-charcoal hover:border-bordeaux hover:text-bordeaux"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-charcoal/20 bg-white/50 p-10 text-center">
              <p className="text-sm text-stone">Tidak ada template yang cocok dengan filter.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                  setPkg("all");
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-charcoal/20 px-4 py-2 text-xs uppercase tracking-[0.22em] text-charcoal hover:border-bordeaux hover:text-bordeaux"
              >
                Reset filter <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {previewTpl && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Pratinjau template ${previewTpl.manifest.name}`}
          className="fixed inset-0 z-50 flex flex-col bg-black/75 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewSlug(null);
          }}
        >
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 text-white">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-white/60">Pratinjau Template</p>
              <h2 className="truncate font-serif text-lg">{previewTpl.manifest.name}</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex overflow-hidden rounded-md border border-white/20 text-xs">
                <button
                  type="button"
                  onClick={() => setDevice("mobile")}
                  className={`px-3 py-1.5 uppercase tracking-widest ${
                    device === "mobile" ? "bg-white text-black" : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  Mobile
                </button>
                <button
                  type="button"
                  onClick={() => setDevice("desktop")}
                  className={`px-3 py-1.5 uppercase tracking-widest ${
                    device === "desktop" ? "bg-white text-black" : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  Desktop
                </button>
              </div>
              <a
                href={`/preview/${previewTpl.manifest.slug}`}
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
                device === "mobile"
                  ? "h-[min(85vh,820px)] w-[390px] max-w-full"
                  : "h-[min(90vh,900px)] w-full max-w-6xl"
              }`}
            >
              <iframe
                key={previewTpl.manifest.slug + device}
                title={`Pratinjau ${previewTpl.manifest.name}`}
                src={`/preview/${previewTpl.manifest.slug}`}
                className="h-full w-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] uppercase tracking-[0.25em] text-stone">{label}</span>
      <div className="inline-flex overflow-hidden rounded-full border border-charcoal/15 bg-ivory text-xs">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`px-3 py-1.5 uppercase tracking-[0.15em] transition ${
              value === o.value ? "bg-bordeaux text-ivory" : "text-stone hover:bg-cream"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}