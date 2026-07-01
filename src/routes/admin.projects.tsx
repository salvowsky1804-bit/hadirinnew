import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useProjects } from "@/lib/projects-store";

export const Route = createFileRoute("/admin/projects")({
  component: AdminProjectsPage,
});

function AdminProjectsPage() {
  const { projects, loading } = useProjects();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "draft" | "published">("all");

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return projects.filter((p) => {
      if (status !== "all" && p.status !== status) return false;
      if (!needle) return true;
      return (
        p.coupleLabel.toLowerCase().includes(needle) ||
        p.slug.toLowerCase().includes(needle) ||
        p.templateSlug.toLowerCase().includes(needle)
      );
    });
  }, [projects, q, status]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
        <div>
          <h2 className="font-serif text-2xl">Semua Proyek</h2>
          <p className="text-xs text-muted-foreground">
            Menampilkan seluruh proyek studio (semua WO). Total{" "}
            {projects.length}.
          </p>
        </div>
        <div className="flex gap-2 text-xs">
          <input
            placeholder="Cari pasangan / slug…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-1.5"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="rounded-md border border-border bg-background px-3 py-1.5"
          >
            <option value="all">Semua status</option>
            <option value="draft">Draft</option>
            <option value="published">Terbit</option>
          </select>
        </div>
      </header>

      {loading ? (
        <p className="text-sm text-muted-foreground">Memuat…</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Pasangan</th>
                <th className="px-3 py-2">Slug</th>
                <th className="px-3 py-2">Template</th>
                <th className="px-3 py-2">Tanggal</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Tamu</th>
                <th className="px-3 py-2">RSVP</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-3 py-6 text-center text-muted-foreground"
                  >
                    Tidak ada proyek.
                  </td>
                </tr>
              ) : null}
              {rows.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-3 py-2 font-medium">{p.coupleLabel}</td>
                  <td className="px-3 py-2 text-muted-foreground">/u/{p.slug}</td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {p.templateSlug}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {p.eventDate || "—"}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={
                        p.status === "published"
                          ? "text-emerald-700"
                          : "text-amber-700"
                      }
                    >
                      {p.status === "published" ? "Terbit" : "Draft"}
                    </span>
                  </td>
                  <td className="px-3 py-2">{p.guests.length}</td>
                  <td className="px-3 py-2">{p.rsvps.length}</td>
                  <td className="px-3 py-2 text-right text-xs">
                    <Link
                      to="/wo/projects/$projectId"
                      params={{ projectId: p.id }}
                      className="underline"
                    >
                      Editor
                    </Link>{" "}
                    ·{" "}
                    <Link
                      to="/wo/projects/$projectId/rsvp"
                      params={{ projectId: p.id }}
                      className="underline"
                    >
                      RSVP
                    </Link>{" "}
                    ·{" "}
                    <Link
                      to="/u/$slug"
                      params={{ slug: p.slug }}
                      target="_blank"
                      className="underline"
                    >
                      Preview ↗
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}