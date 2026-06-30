import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  addWoMember,
  listWoMembers,
  removeWoMember,
  setWoMemberActive,
} from "@/lib/team.functions";

export const Route = createFileRoute("/admin/team")({
  component: TeamPage,
});

function TeamPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listWoMembers);
  const addFn = useServerFn(addWoMember);
  const toggleFn = useServerFn(setWoMemberActive);
  const removeFn = useServerFn(removeWoMember);

  const { data: team = [], isLoading, error } = useQuery({
    queryKey: ["admin", "wo-team"],
    queryFn: () => listFn(),
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["admin", "wo-team"] });

  const addMut = useMutation({
    mutationFn: (vars: {
      fullName: string;
      email: string;
      password: string;
      phone?: string;
    }) => addFn({ data: vars }),
    onSuccess: () => {
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setFormError(null);
      invalidate();
    },
    onError: (e: Error) => setFormError(e.message),
  });

  const toggleMut = useMutation({
    mutationFn: (vars: { id: string; active: boolean }) =>
      toggleFn({ data: vars }),
    onSuccess: invalidate,
  });

  const removeMut = useMutation({
    mutationFn: (id: string) => removeFn({ data: { id } }),
    onSuccess: invalidate,
  });

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || password.length < 8) {
      setFormError("Nama, email, dan password (min 8 karakter) wajib diisi.");
      return;
    }
    addMut.mutate({
      fullName: name.trim(),
      email: email.trim(),
      password,
      phone: phone.trim() || undefined,
    });
  };

  const toggle = (id: string, active: boolean) =>
    toggleMut.mutate({ id, active: !active });

  const remove = (id: string) => {
    if (!confirm("Hapus akun WO ini?")) return;
    removeMut.mutate(id);
  };

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
          Akun dibuat di Supabase Auth dan langsung dapat login dengan peran WO.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 8 karakter)"
            className={inputCls}
            minLength={8}
            required
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="No. WA (opsional)"
            className={inputCls}
          />
        </div>
        {formError && (
          <p className="mt-3 text-xs text-red-700">{formError}</p>
        )}
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={addMut.isPending}
            className="rounded-md bg-foreground px-4 py-2 text-sm text-background hover:opacity-90 disabled:opacity-50"
          >
            {addMut.isPending ? "Menambahkan…" : "Tambah"}
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
                  {new Date(m.joinedAt).toLocaleDateString("id-ID")}
                </td>
                <td className="px-4 py-3 text-center">{m.projectCount}</td>
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
                    onClick={() => toggle(m.id, m.active)}
                    disabled={toggleMut.isPending}
                    className="mr-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
                  >
                    {m.active ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                  <button
                    onClick={() => remove(m.id)}
                    disabled={removeMut.isPending}
                    className="text-xs uppercase tracking-widest text-red-700 hover:text-red-900"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {team.length === 0 && !isLoading && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  Belum ada akun WO. Tambahkan dari form di atas.
                </td>
              </tr>
            )}
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Memuat data tim…
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-sm text-red-700">
                  Gagal memuat: {(error as Error).message}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
