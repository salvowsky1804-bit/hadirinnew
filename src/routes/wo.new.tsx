import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { listTemplates } from "@/lib/template-registry";
import { slugify, useProjects } from "@/lib/projects-store";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/wo/new")({
  component: NewProjectPage,
});

const schema = z.object({
  coupleLabel: z.string().trim().min(3, "Label minimal 3 karakter").max(80),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Hanya huruf kecil, angka, dan tanda hubung"),
  templateSlug: z.string().min(1, "Pilih satu template"),
  eventDate: z.string().min(1, "Tanggal acara wajib"),
});

function NewProjectPage() {
  const navigate = useNavigate();
  const { createProject, getProjectBySlug } = useProjects();
  const { user } = useAuth();
  const templates = listTemplates();

  const [coupleLabel, setCoupleLabel] = useState("");
  const [slug, setSlug] = useState("");
  const [templateSlug, setTemplateSlug] = useState(
    templates[0]?.manifest.slug ?? "",
  );
  const [eventDate, setEventDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onCoupleChange(v: string) {
    setCoupleLabel(v);
    if (!slug || slug === slugify(coupleLabel)) setSlug(slugify(v));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse({
      coupleLabel,
      slug,
      templateSlug,
      eventDate,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Form tidak valid");
      return;
    }
    if (getProjectBySlug(parsed.data.slug)) {
      setError("Slug sudah dipakai proyek lain");
      return;
    }
    try {
      const project = await createProject({
        ...parsed.data,
        ownerWoId: user?.id ?? "wo-unknown",
      });
      navigate({
        to: "/wo/projects/$projectId",
        params: { projectId: project.id },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat proyek");
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-6">
      <header>
        <h2 className="font-serif text-xl">Proyek Undangan Baru</h2>
        <p className="text-sm text-muted-foreground">
          Isi data dasar dan pilih template. Detail lanjutan dapat diatur di
          editor.
        </p>
      </header>

      <Field label="Label Pasangan" hint="Contoh: Rama & Sinta">
        <input
          required
          value={coupleLabel}
          onChange={(e) => onCoupleChange(e.target.value)}
          maxLength={80}
          className="input"
          placeholder="Rama & Sinta"
        />
      </Field>
      <Field
        label="Slug URL"
        hint={`Undangan akan diakses di /u/${slug || "..."}`}
      >
        <input
          required
          value={slug}
          onChange={(e) => setSlug(slugify(e.target.value))}
          maxLength={60}
          className="input"
          placeholder="rama-sinta"
        />
      </Field>
      <Field label="Tanggal Acara">
        <input
          required
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          className="input"
        />
      </Field>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">Pilih Template</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {templates.map((t) => {
            const active = t.manifest.slug === templateSlug;
            return (
              <label
                key={t.manifest.slug}
                className={`cursor-pointer rounded-lg border p-4 transition ${
                  active
                    ? "border-foreground bg-muted"
                    : "border-border hover:border-foreground/40"
                }`}
              >
                <input
                  type="radio"
                  name="template"
                  className="sr-only"
                  value={t.manifest.slug}
                  checked={active}
                  onChange={() => setTemplateSlug(t.manifest.slug)}
                />
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-lg">{t.manifest.name}</span>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {t.manifest.internalPackage}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t.manifest.tagline}
                </p>
                {t.manifest.fields.length > 0 ? (
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    +{t.manifest.fields.length} field custom
                  </p>
                ) : null}
              </label>
            );
          })}
        </div>
      </fieldset>

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
        >
          Buat Proyek
        </button>
        <button
          type="button"
          onClick={() => navigate({ to: "/wo" })}
          className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted"
        >
          Batal
        </button>
      </div>

      <style>{`.input{width:100%;border:1px solid var(--color-border);border-radius:0.375rem;padding:0.5rem 0.75rem;font-size:0.875rem;background:var(--color-background)}.input:focus{outline:2px solid var(--color-ring);outline-offset:1px}`}</style>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}