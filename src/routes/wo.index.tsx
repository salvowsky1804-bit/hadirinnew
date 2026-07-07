import { createFileRoute, Link } from "@tanstack/react-router";
import { useProjects } from "@/lib/projects-store";
import { Plus, Calendar, Users, MessageSquareHeart, Pencil, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/wo/")({
  component: WoProjectsList,
});

function WoProjectsList() {
  const { projects } = useProjects();
  return (
    <section aria-labelledby="projects-heading" className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="projects-heading" className="font-serif text-2xl text-foreground">
            Daftar Proyek Undangan
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {projects.length} proyek aktif · klik kartu untuk membuka editor.
          </p>
        </div>
        <Link
          to="/wo/new"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Proyek Baru
        </Link>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {projects.map((p) => (
          <li key={p.id} className="sp-card sp-card-hover flex flex-col p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate font-serif text-xl text-foreground">{p.coupleLabel}</h3>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  Template {p.templateSlug} · /u/{p.slug}
                </p>
              </div>
              <span className={`sp-badge shrink-0 ${p.status === "published" ? "sp-badge-ok" : "sp-badge-draft"}`}>
                <span className="sp-dot" />
                {p.status === "published" ? "Terbit" : "Draft"}
              </span>
            </div>

            <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <div className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[--color-sage]" />
                <span>{p.eventDate || "Tanggal belum diatur"}</span>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-[--color-sage]" />
                <span>
                  {p.guests.length} tamu · {p.rsvps.length} RSVP
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <MessageSquareHeart className="h-3.5 w-3.5 text-[--color-sage]" />
                <span>{p.wishes.length} ucapan</span>
              </div>
            </dl>

            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4 text-xs">
              <Link
                to="/wo/projects/$projectId"
                params={{ projectId: p.id }}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 font-medium text-primary-foreground transition hover:opacity-90"
              >
                <Pencil className="h-3.5 w-3.5" />
                Buka editor
              </Link>
              <Link
                to="/wo/projects/$projectId/rsvp"
                params={{ projectId: p.id }}
                className="rounded-md border border-border px-3 py-1.5 text-foreground transition hover:bg-muted"
              >
                RSVP
              </Link>
              <Link
                to="/wo/projects/$projectId/wishes"
                params={{ projectId: p.id }}
                className="rounded-md border border-border px-3 py-1.5 text-foreground transition hover:bg-muted"
              >
                Ucapan
              </Link>
              <Link
                to="/u/$slug"
                params={{ slug: p.slug }}
                target="_blank"
                rel="noreferrer"
                className="ml-auto inline-flex items-center gap-1 text-muted-foreground transition hover:text-bordeaux"
              >
                Lihat undangan
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </li>
        ))}

        {projects.length === 0 ? (
          <li className="col-span-full rounded-lg border border-dashed border-border bg-muted/30 p-10 text-center">
            <p className="text-sm text-muted-foreground">Belum ada proyek. Mulai dengan membuat undangan pertama.</p>
            <Link
              to="/wo/new"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Proyek Baru
            </Link>
          </li>
        ) : null}
      </ul>
    </section>
  );
}
