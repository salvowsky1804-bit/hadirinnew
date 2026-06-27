import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { dummyWoTeam, type WoMember } from "@/data/dummy";
import { useProjects } from "@/lib/projects-store";

export const Route = createFileRoute("/admin/team")({
  component: TeamPage,
});

const STORAGE = "studio.wo-team.v1";

function loadTeam(): WoMember[] {
  if (typeof window === "undefined") return dummyWoTeam;
  try {
    const raw = window.localStorage.getItem(STORAGE);
    if (!raw) return dummyWoTeam;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : dummyWoTeam;
  } catch {
    return dummyWoTeam;
  }
}

function TeamPage() {
  const { projects } = useProjects();
  const [team, setTeam] = useState<WoMember[]>(() => loadTeam());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE, JSON.stringify(team));
  }, [team]);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setTeam((t) => [
      ...t,
      {
        id: `wo-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        active: true,
        joinedAt: new Date().toISOString().slice(0, 10),
      },
    ]);
    setName("");
    setEmail("");
  };

  const toggle = (id: string) =>
    setTeam((t) =>
      t.map((m) => (m.id === id ? { ...m, active: !m.active } : m)),
    );

  const remove = (id: string) => {
    if (!confirm("Hapus akun WO ini?")) return;
    setTeam((t) => t.filter((m) => m.id !== id));
  };

  const projectCount = (woId: string) =>
    projects.filter((p) => p.ownerWoId === woId).length;

  const inputCls =
    "w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-foreground focus:outline-none";

  return (
    <section className="space-y-6">
      <form
        onSubmit={add}
        className="rounded-lg border border-border bg-card p-4"
      >
        <h3 className="font-serif text-lg">Tambah Akun WO</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Anggota tim baru akan menerima akses ke editor proyek.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama lengkap"
            className={inputCls}
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@studio.id"
            className={inputCls}
            required
          />
          <button
            type="submit"
            className="rounded-md bg-foreground px-4 py-2 text-sm text-background hover:opacity-90"
          >
            Tambah
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Bergabung</th>
              <th className="px-4 py-3 text-center">Proyek</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {team.map((m) => (
              <tr key={m.id}>
                <td className="px-4 py-3 font-medium">{m.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{m.email}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {m.joinedAt}
                </td>
                <td className="px-4 py-3 text-center">{projectCount(m.id)}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] uppercase tracking-widest ${
                      m.active
                        ? "bg-emerald-100 text-emerald-900"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {m.active ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => toggle(m.id)}
                    className="mr-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
                  >
                    {m.active ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                  <button
                    onClick={() => remove(m.id)}
                    className="text-xs uppercase tracking-widest text-red-700 hover:text-red-900"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {team.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  Belum ada akun WO.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
