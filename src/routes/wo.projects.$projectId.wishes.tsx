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
type FilterKey = "all" | "visible" | "hidden";

function WishesPage() {
  const { projectId } = Route.useParams();
  const { getProject, loading, setWishVisibility, removeWish } = useProjects();
  const project = getProject(projectId);

  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [active, setActive] = useState<WishEntry | null>(null);

  const items = useMemo(() => {
    if (!project) return [] as WishEntry[];
    const term = q.trim().toLowerCase();
    let list = project.wishes.filter(
      (w) =>
        (!term ||
          w.guestName.toLowerCase().includes(term) ||
          w.message.toLowerCase().includes(term)) &&
        (filter === "all" ||
          (filter === "visible" && w.visible !== false) ||
          (filter === "hidden" && w.visible === false)),
    );
    list = [...list].sort((a, b) => {
      if (sort === "name") return a.guestName.localeCompare(b.guestName);
      const da = new Date(a.submittedAt).getTime();
      const db = new Date(b.submittedAt).getTime();
      return sort === "newest" ? db - da : da - db;
    });
    return list;
  }, [project, q, sort, filter]);

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

  const hiddenCount = project.wishes.filter((w) => w.visible === false).length;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
        <div>
          <h2 className="font-serif text-2xl">Ucapan &amp; Doa Tamu</h2>
          <p className="text-xs text-muted-foreground">
            {project.coupleLabel} · {project.wishes.length} ucapan
            {hiddenCount > 0 ? ` · ${hiddenCount} disembunyikan` : ""}
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
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterKey)}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="all">Semua status</option>
          <option value="visible">Ditampilkan</option>
          <option value="hidden">Disembunyikan</option>
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
              <div
                className={`group flex h-full w-full flex-col rounded-lg border p-4 text-left transition hover:shadow-sm ${
                  w.visible === false
                    ? "border-dashed border-border bg-muted/40 opacity-70"
                    : "border-border bg-card hover:border-foreground/40"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActive(w)}
                  className="text-left"
                >
                  <p className="line-clamp-4 text-sm leading-relaxed">
                    {w.message}
                  </p>
                </button>
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
                <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-2">
                  <label className="flex cursor-pointer items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={w.visible !== false}
                      onChange={(e) =>
                        setWishVisibility(projectId, w.id, e.target.checked)
                      }
                      className="h-3.5 w-3.5 cursor-pointer"
                    />
                    <span>
                      {w.visible === false
                        ? "Disembunyikan"
                        : "Tampil di undangan"}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        confirm(
                          `Hapus ucapan dari ${w.guestName}? Tindakan ini tidak dapat dibatalkan.`,
                        )
                      ) {
                        removeWish(projectId, w.id);
                      }
                    }}
                    className="rounded border border-border px-2 py-1 text-xs text-muted-foreground hover:border-destructive hover:text-destructive"
                  >
                    Hapus
                  </button>
                </div>
              </div>
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