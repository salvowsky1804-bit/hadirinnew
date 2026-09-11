import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useProjects } from "@/lib/projects-store";
import { listTemplates } from "@/lib/template-registry";
import { dummyWoTeam } from "@/data/dummy";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { projects } = useProjects();
  const templates = listTemplates();
  const drafts = projects.filter((p) => p.status === "draft").length;
  const published = projects.filter((p) => p.status === "published").length;
  const totalRsvp = projects.reduce((sum, p) => sum + p.rsvps.length, 0);
  const totalAttending = projects.reduce((sum, p) => sum + p.rsvps.filter((r) => r.status === "attending").length, 0);

  // `accent` lifts the two "outcome" numbers so the grid has a focal point.
  const stats: Array<{ label: string; value: number; accent?: boolean }> = [
    { label: "Total Proyek", value: projects.length },
    { label: "Draft", value: drafts },
    { label: "Tayang", value: published, accent: true },
    { label: "Template Aktif", value: templates.length },
    { label: "Total RSVP", value: totalRsvp },
    { label: "Konfirmasi Hadir", value: totalAttending, accent: true },
  ];

  const recent = projects.slice(0, 5);

  return (
    <section className="space-y-8">
      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <div key={s.label} className="sp-card sp-card-hover p-4">
            <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
            <p
              className={`mt-1.5 text-3xl font-semibold leading-none tracking-tight tabular-nums ${
                s.accent ? "text-bordeaux" : "text-foreground"
              }`}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent projects */}
        <div className="sp-card overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="text-base font-semibold">Proyek Terbaru</h3>
            <Link
              to="/admin/projects"
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition hover:text-bordeaux"
            >
              Lihat semua
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {recent.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-3 px-5 py-3.5 text-sm transition hover:bg-muted/50"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="sp-avatar h-9 w-9 shrink-0 text-[11px]">{coupleInitials(p.coupleLabel)}</span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{p.coupleLabel}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {p.templateSlug} · /u/{p.slug}
                    </p>
                  </div>
                </div>
                <span className={`sp-badge ${p.status === "published" ? "sp-badge-ok" : "sp-badge-draft"}`}>
                  <span className="sp-dot" />
                  {p.status === "published" ? "Terbit" : "Draft"}
                </span>
              </li>
            ))}
            {recent.length === 0 && (
              <li className="px-5 py-8 text-center text-sm text-muted-foreground">Belum ada proyek.</li>
            )}
          </ul>
        </div>

        {/* WO team */}
        <div className="sp-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="font-serif text-lg">Tim WO</h3>
            <Link
              to="/admin/team"
              className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.15em] text-muted-foreground transition hover:text-bordeaux"
            >
              Kelola
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {dummyWoTeam.slice(0, 4).map((m) => (
              <li key={m.id} className="flex items-center gap-3 px-5 py-3.5">
                <span className="sp-avatar h-8 w-8 shrink-0 text-[10px]">{coupleInitials(m.name)}</span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{m.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{m.email}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function coupleInitials(label: string): string {
  const parts = label.replace(/&/g, " ").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "·";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
