import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useProjects } from "@/lib/projects-store";

export const Route = createFileRoute("/wo/projects/$projectId/rsvp")({
  component: RsvpPage,
});

function RsvpPage() {
  const { projectId } = Route.useParams();
  const { getProject, loading } = useProjects();
  const project = getProject(projectId);

  const summary = useMemo(() => {
    if (!project) return { attending: 0, tentative: 0, not: 0, totalPax: 0 };
    return project.rsvps.reduce(
      (acc, r) => {
        if (r.status === "attending") {
          acc.attending += 1;
          acc.totalPax += r.pax;
        } else if (r.status === "tentative") acc.tentative += 1;
        else acc.not += 1;
        return acc;
      },
      { attending: 0, tentative: 0, not: 0, totalPax: 0 },
    );
  }, [project]);

  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        Memuat RSVP &amp; ucapan…
      </div>
    );
  }

  if (!project) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-sm">
        Proyek tidak ditemukan.{" "}
        <Link to="/wo" className="underline">
          Kembali
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
        <div>
          <h2 className="font-serif text-2xl">RSVP &amp; Ucapan</h2>
          <p className="text-xs text-muted-foreground">
            {project.coupleLabel} · /u/{project.slug}
          </p>
        </div>
        <Link
          to="/wo/projects/$projectId"
          params={{ projectId }}
          className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted"
        >
          ← Editor
        </Link>
        <Link
          to="/wo/projects/$projectId/wishes"
          params={{ projectId }}
          className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted"
        >
          Kelola Ucapan →
        </Link>
      </header>

      <div className="grid gap-3 sm:grid-cols-4">
        <Stat label="Hadir" value={summary.attending} tone="ok" />
        <Stat label="Mungkin" value={summary.tentative} tone="draft" />
        <Stat label="Tidak Hadir" value={summary.not} tone="wine" />
        <Stat label="Total Pax" value={summary.totalPax} />
      </div>

      <section>
        <h3 className="mb-3 font-medium">Konfirmasi Tamu</h3>
        <div className="sp-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50 text-left text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Tamu</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Pax</th>
                <th className="px-3 py-2">Waktu</th>
              </tr>
            </thead>
            <tbody>
              {project.rsvps.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-6 text-center text-muted-foreground">
                    Belum ada RSVP.
                  </td>
                </tr>
              ) : null}
              {project.rsvps.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="px-3 py-2 font-medium">{r.guestName}</td>
                  <td className="px-3 py-2">
                    <StatusPill status={r.status} />
                  </td>
                  <td className="px-3 py-2">{r.pax}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">
                    {new Date(r.submittedAt).toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="mb-3 font-medium">Ucapan &amp; Doa</h3>
        <ul className="grid gap-3 sm:grid-cols-2">
          {project.wishes.length === 0 ? (
            <li className="col-span-full rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
              Belum ada ucapan.
            </li>
          ) : null}
          {project.wishes.map((w) => (
            <li key={w.id} className="sp-card p-4">
              <p className="text-sm">{w.message}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                — {w.guestName} · {new Date(w.submittedAt).toLocaleDateString("id-ID")}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: "ok" | "draft" | "wine" }) {
  const toneClass =
    tone === "ok"
      ? "text-[oklch(0.4_0.055_150)]"
      : tone === "draft"
        ? "text-[oklch(0.47_0.05_62)]"
        : tone === "wine"
          ? "text-bordeaux"
          : "text-foreground";
  return (
    <div className="sp-card p-4">
      <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">{label}</p>
      <p className={`mt-1 font-serif text-4xl leading-none ${toneClass}`}>{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: "attending" | "tentative" | "not_attending" }) {
  const map = {
    attending: { l: "Hadir", c: "sp-badge-ok" },
    tentative: { l: "Mungkin", c: "sp-badge-draft" },
    not_attending: { l: "Tidak", c: "sp-badge-wine" },
  } as const;
  return <span className={`sp-badge ${map[status].c}`}>{map[status].l}</span>;
}
