import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useProjects } from "@/lib/projects-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { WishEntry } from "@/types/invitation";

export const Route = createFileRoute("/wo/projects/$projectId/wishes")({
  component: WishesPage,
});

type SortKey = "newest" | "oldest" | "name";

function WishesPage() {
  const { projectId } = Route.useParams();
  const { getProject, loading } = useProjects();
  const project = getProject(projectId);

  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [active, setActive] = useState<WishEntry | null>(null);

  const items = useMemo(() => {
    if (!project) return [] as WishEntry[];
    const term = q.trim().toLowerCase();
    let list = project.wishes.filter(
      (w) =>
        !term ||
        w.guestName.toLowerCase().includes(term) ||
        w.message.toLowerCase().includes(term),
    );
    list = [...list].sort((a, b) => {
      if (sort === "name") return a.guestName.localeCompare(b.guestName);
      const da = new Date(a.submittedAt).getTime();
      const db = new Date(b.submittedAt).getTime();
      return sort === "newest" ? db - da : da - db;
    });
    return list;
  }, [project, q, sort]);

  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        Memuat ucapan tamu…
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
          <h2 className="font-serif text-2xl">Ucapan &amp; Doa Tamu</h2>
          <p className="text-xs text-muted-foreground">
            {project.coupleLabel} · {project.wishes.length} ucapan
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/wo/projects/$projectId/rsvp"
            params={{ projectId }}
            className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted"
          >
            RSVP
          </Link>
          <Link
            to="/wo/projects/$projectId"
            params={{ projectId }}
            className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted"
          >
            ← Editor
          </Link>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Cari nama atau isi ucapan…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="newest">Terbaru</option>
          <option value="oldest">Terlama</option>
          <option value="name">Nama (A–Z)</option>
        </select>
        <span className="text-xs text-muted-foreground">
          Menampilkan {items.length} dari {project.wishes.length}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-10 text-center text-sm text-muted-foreground">
          Belum ada ucapan yang cocok.
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((w) => (
            <li key={w.id}>
              <button
                type="button"
                onClick={() => setActive(w)}
                className="group flex h-full w-full flex-col rounded-lg border border-border bg-card p-4 text-left transition hover:border-foreground/40 hover:shadow-sm"
              >
                <p className="line-clamp-4 text-sm leading-relaxed">
                  {w.message}
                </p>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {w.guestName}
                  </span>
                  <span>
                    {new Date(w.submittedAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {active?.guestName}
            </DialogTitle>
            <DialogDescription>
              {active
                ? new Date(active.submittedAt).toLocaleString("id-ID", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })
                : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="whitespace-pre-wrap rounded-md border border-border bg-muted/30 p-4 text-sm leading-relaxed">
            {active?.message}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}