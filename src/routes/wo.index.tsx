import { createFileRoute, Link } from "@tanstack/react-router";
import { dummyProjects } from "@/data/dummy";

export const Route = createFileRoute("/wo/")({
  component: WoProjectsList,
});

function WoProjectsList() {
  return (
    <section aria-labelledby="projects-heading" className="space-y-4">
      <h2 id="projects-heading" className="sr-only">
        Daftar proyek undangan
      </h2>
      <p className="text-sm text-muted-foreground">
        Tahap 1 — pratinjau daftar proyek (dummy). Editor lengkap dibangun di tahap 3.
      </p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {dummyProjects.map((p) => (
          <li
            key={p.id}
            className="rounded-lg border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-serif text-lg">{p.coupleLabel}</h3>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  p.status === "published"
                    ? "bg-emerald-100 text-emerald-900"
                    : "bg-amber-100 text-amber-900"
                }`}
              >
                {p.status === "published" ? "Terbit" : "Draft"}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Template: {p.templateSlug} · Tanggal acara: {p.eventDate}
            </p>
            <div className="mt-3 flex gap-2 text-xs">
              <Link
                to="/wo/projects/$projectId"
                params={{ projectId: p.id }}
                className="rounded-md bg-foreground px-3 py-1.5 text-background hover:opacity-90"
              >
                Buka editor
              </Link>
              <Link
                to="/u/$slug"
                params={{ slug: p.slug }}
                className="rounded-md border border-border px-3 py-1.5 hover:bg-muted"
              >
                Lihat undangan
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
