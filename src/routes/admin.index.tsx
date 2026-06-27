import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useProjects } from "@/lib/projects-store";
import { listTemplates } from "@/lib/template-registry";
import { dummyWoTeam } from "@/data/dummy";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { projects } = useProjects();
  const templates = listTemplates();
  const drafts = projects.filter((p) => p.status === "draft").length;
  const published = projects.filter((p) => p.status === "published").length;
  const totalRsvp = projects.reduce((sum, p) => sum + p.rsvps.length, 0);
  const totalAttending = projects.reduce(
    (sum, p) => sum + p.rsvps.filter((r) => r.status === "attending").length,
    0,
  );

  const stats = [
    { label: "Total Proyek", value: projects.length },
    { label: "Draft", value: drafts },
    { label: "Tayang", value: published },
    { label: "Template Aktif", value: templates.length },
    { label: "Total RSVP", value: totalRsvp },
    { label: "Konfirmasi Hadir", value: totalAttending },
  ];

  const recent = projects.slice(0, 5);

  return (
    <section className="space-y-8">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-lg border border-border bg-card p-4"
          >
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
              {s.label}
            </p>
            <p className="mt-2 font-serif text-3xl">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <h3 className="font-serif text-lg">Proyek Terbaru</h3>
            <Link
              to="/wo"
              className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              Lihat semua →
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {recent.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between px-5 py-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{p.coupleLabel}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {p.templateSlug} · /u/{p.slug}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] uppercase tracking-widest ${
                    p.status === "published"
                      ? "bg-emerald-100 text-emerald-900"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {p.status}
                </span>
              </li>
            ))}
            {recent.length === 0 && (
              <li className="px-5 py-6 text-sm text-muted-foreground">
                Belum ada proyek.
              </li>
            )}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-5 py-3">
              <h3 className="font-serif text-lg">Tim WO</h3>
            </div>
            <ul className="divide-y divide-border">
              {dummyWoTeam.slice(0, 4).map((m) => (
                <li key={m.id} className="px-5 py-3 text-sm">
                  <p className="font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.email}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
