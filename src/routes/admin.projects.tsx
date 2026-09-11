import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  Copy,
  ExternalLink,
  Heart,
  MessageSquareHeart,
  Search,
  Users,
  Check,
} from "lucide-react";
import { useProjects } from "@/lib/projects-store";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/projects")({
  component: AdminProjectsPage,
});

const AVATAR_TINTS = [
  "bg-rose-100 text-rose-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
];

function formatDate(iso: string) {
  if (!iso) return null;
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function daysUntil(iso: string) {
  if (!iso) return null;
  const diff = Math.ceil(
    (new Date(iso + "T00:00:00").getTime() - Date.now()) / 86_400_000,
  );
  return diff;
}

function AdminProjectsPage() {
  const { projects, loading } = useProjects();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "draft" | "published">("all");
  const [copied, setCopied] = useState<string | null>(null);

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

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/u/${slug}`;
    navigator.clipboard?.writeText(url).then(
      () => {
        setCopied(slug);
        toast.success("Tautan undangan disalin");
        setTimeout(() => setCopied(null), 1500);
      },
      () => toast.error("Gagal menyalin tautan"),
    );
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
        <div>
          <h2 className="font-serif text-2xl">Semua Proyek</h2>
          <p className="text-xs text-muted-foreground">
            Menampilkan seluruh proyek studio (semua WO). Total {projects.length}.
          </p>
        </div>
        <div className="flex gap-2 text-xs">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Cari pasangan / slug…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-56 rounded-md border border-border bg-background py-1.5 pl-8 pr-3"
            />
          </div>
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
        <div className="sp-card overflow-x-auto p-0">
          <table className="w-full min-w-[880px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                <th className="px-4 py-3">Pasangan</th>
                <th className="px-4 py-3">Tautan</th>
                <th className="px-4 py-3">Template</th>
                <th className="px-4 py-3">Acara</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Tamu</th>
                <th className="px-4 py-3 text-center">RSVP</th>
                <th className="px-4 py-3 text-center">Ucapan</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-muted-foreground">
                    Tidak ada proyek yang cocok.
                  </td>
                </tr>
              ) : null}
              {rows.map((p, i) => {
                const hadir = p.rsvps.filter((r) => r.status === "hadir").length;
                const visibleWishes = p.wishes.filter((w) => w.visible !== false).length;
                const dateLabel = formatDate(p.eventDate);
                const dLeft = daysUntil(p.eventDate);
                const tint = AVATAR_TINTS[i % AVATAR_TINTS.length];
                const initials = p.coupleLabel
                  .split("&")
                  .map((s) => s.trim().charAt(0).toUpperCase())
                  .filter(Boolean)
                  .join("");
                return (
                  <tr key={p.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${tint}`}
                        >
                          {initials || "·"}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium leading-tight">{p.coupleLabel}</p>
                          <p className="text-[11px] text-muted-foreground">
                            Dibuat {formatDate(p.createdAt) ?? "—"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                          /u/{p.slug}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyLink(p.slug)}
                          title="Salin tautan"
                          className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          {copied === p.slug ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-md border border-border bg-background px-2 py-0.5 text-[11px] font-medium capitalize">
                        {p.templateSlug}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {dateLabel ? (
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                          <div className="leading-tight">
                            <p className="text-xs font-medium">{dateLabel}</p>
                            {dLeft !== null && dLeft >= 0 && (
                              <p className="text-[10px] text-muted-foreground">
                                {dLeft === 0 ? "Hari ini" : `${dLeft} hari lagi`}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`sp-badge ${
                          p.status === "published" ? "sp-badge-ok" : "sp-badge-draft"
                        }`}
                      >
                        {p.status === "published" ? "Terbit" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-xs font-medium">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        {p.guests.length}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-xs font-medium">
                        <Heart className="h-3.5 w-3.5 text-muted-foreground" />
                        {hadir}/{p.rsvps.length}
                      </span>
                      <p className="text-[10px] text-muted-foreground">hadir/total</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-xs font-medium">
                        <MessageSquareHeart className="h-3.5 w-3.5 text-muted-foreground" />
                        {visibleWishes}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 text-xs">
                        <Link
                          to="/wo/projects/$projectId"
                          params={{ projectId: p.id }}
                          className="rounded-md border border-border px-2 py-1 transition-colors hover:bg-muted"
                        >
                          Editor
                        </Link>
                        <Link
                          to="/wo/projects/$projectId/rsvp"
                          params={{ projectId: p.id }}
                          className="rounded-md border border-border px-2 py-1 transition-colors hover:bg-muted"
                        >
                          RSVP
                        </Link>
                        <Link
                          to="/wo/projects/$projectId/wishes"
                          params={{ projectId: p.id }}
                          className="rounded-md border border-border px-2 py-1 transition-colors hover:bg-muted"
                        >
                          Ucapan
                        </Link>
                        <Link
                          to="/u/$slug"
                          params={{ slug: p.slug }}
                          target="_blank"
                          title="Buka undangan"
                          className="rounded-md border border-border p-1.5 transition-colors hover:bg-muted"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
