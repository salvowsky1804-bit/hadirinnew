import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Plus, Trash2, Upload, X, FileText, Image as ImageIcon, Star, Eye, EyeOff, Loader2 } from "lucide-react";
import {
  createOfflineTemplate,
  deleteOfflineTemplate,
  listOfflineTemplates,
  removeStorageObjects,
  updateOfflineTemplate,
  uploadOfflineFile,
  type OfflineFile,
  type OfflineTemplateWithUrls,
} from "@/lib/offline-templates";

export const Route = createFileRoute("/admin/offline-templates")({
  head: () => ({ meta: [{ title: "Undangan Offline — Admin" }] }),
  component: OfflineTemplatesAdmin,
});

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 60);
}

function OfflineTemplatesAdmin() {
  const [items, setItems] = useState<OfflineTemplateWithUrls[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("");

  async function refresh() {
    setLoading(true);
    try {
      const data = await listOfflineTemplates({ includeInactive: true });
      setItems(data);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Gagal memuat");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    refresh();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    setErr(null);
    try {
      await createOfflineTemplate({
        slug: slugify(newName) + "-" + Math.random().toString(36).slice(2, 6),
        name: newName.trim(),
        category: newCategory.trim() || undefined,
      });
      setNewName("");
      setNewCategory("");
      await refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Gagal membuat");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus template ini beserta seluruh berkasnya?")) return;
    try {
      await deleteOfflineTemplate(id);
      setItems((s) => s.filter((x) => x.id !== id));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Gagal menghapus");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.4em] text-stone">Admin</p>
          <h1 className="mt-2 font-serif text-3xl text-charcoal">Katalog Undangan Offline</h1>
          <p className="mt-2 max-w-2xl text-sm text-stone">
            Kelola desain undangan cetak yang dibuat di Canva. Unggah beberapa gambar (JPG/PNG) atau PDF per template. Calon mempelai akan melihat galerinya di halaman katalog.
          </p>
        </div>
      </header>

      {err && (
        <div className="mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700">{err}</div>
      )}

      <form onSubmit={handleCreate} className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl border border-charcoal/10 bg-white p-4 shadow-sm">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[10px] uppercase tracking-[0.25em] text-stone">Nama Template</label>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Contoh: Bunga Klasik"
            className="mt-1 w-full rounded-md border border-charcoal/20 bg-ivory px-3 py-2 text-sm outline-none focus:border-bordeaux"
          />
        </div>
        <div className="w-48">
          <label className="block text-[10px] uppercase tracking-[0.25em] text-stone">Kategori</label>
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Klasik / Modern / dsb"
            className="mt-1 w-full rounded-md border border-charcoal/20 bg-ivory px-3 py-2 text-sm outline-none focus:border-bordeaux"
          />
        </div>
        <button
          type="submit"
          disabled={creating || !newName.trim()}
          className="inline-flex items-center gap-2 rounded-full bg-bordeaux px-4 py-2 text-xs uppercase tracking-[0.22em] text-ivory hover:bg-charcoal disabled:opacity-50"
        >
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Tambah
        </button>
      </form>

      {loading ? (
        <div className="mt-10 flex justify-center text-stone"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-charcoal/20 bg-white/50 p-10 text-center text-sm text-stone">
          Belum ada template offline. Buat yang pertama di atas.
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {items.map((t) => (
            <TemplateEditor key={t.id} tpl={t} onChange={refresh} onDelete={() => handleDelete(t.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function TemplateEditor({
  tpl,
  onChange,
  onDelete,
}: {
  tpl: OfflineTemplateWithUrls;
  onChange: () => void;
  onDelete: () => void;
}) {
  const [name, setName] = useState(tpl.name);
  const [category, setCategory] = useState(tpl.category ?? "");
  const [description, setDescription] = useState(tpl.description ?? "");
  const [active, setActive] = useState(tpl.active);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [localErr, setLocalErr] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function saveMeta() {
    setBusy(true);
    setLocalErr(null);
    try {
      await updateOfflineTemplate(tpl.id, {
        name,
        category: category || null,
        description: description || null,
        active,
      });
      onChange();
    } catch (e) {
      setLocalErr(e instanceof Error ? e.message : "Gagal menyimpan");
    } finally {
      setBusy(false);
    }
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setLocalErr(null);
    try {
      const uploaded: OfflineFile[] = [];
      for (const f of Array.from(files)) {
        const meta = await uploadOfflineFile(tpl.slug, f);
        uploaded.push(meta);
      }
      const nextFiles = [...tpl.files, ...uploaded];
      const patch: Record<string, unknown> = { files: nextFiles };
      if (!tpl.cover_path) {
        const firstImage = uploaded.find((u) => u.kind === "image") ?? nextFiles.find((u) => u.kind === "image");
        if (firstImage) patch.cover_path = firstImage.path;
      }
      await updateOfflineTemplate(tpl.id, patch);
      onChange();
    } catch (e) {
      setLocalErr(e instanceof Error ? e.message : "Gagal mengunggah");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function removeFile(path: string) {
    if (!confirm("Hapus berkas ini?")) return;
    try {
      await removeStorageObjects([path]);
      const nextFiles = tpl.files.filter((f) => f.path !== path);
      const patch: Record<string, unknown> = { files: nextFiles };
      if (tpl.cover_path === path) {
        const fallback = nextFiles.find((f) => f.kind === "image");
        patch.cover_path = fallback?.path ?? null;
      }
      await updateOfflineTemplate(tpl.id, patch);
      onChange();
    } catch (e) {
      setLocalErr(e instanceof Error ? e.message : "Gagal menghapus");
    }
  }

  async function setCover(path: string) {
    try {
      await updateOfflineTemplate(tpl.id, { cover_path: path });
      onChange();
    } catch (e) {
      setLocalErr(e instanceof Error ? e.message : "Gagal menyimpan");
    }
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-charcoal/10 bg-white shadow-sm">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream">
        {tpl.cover_url ? (
          <img src={tpl.cover_url} alt={tpl.name} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs uppercase tracking-widest text-stone">
            Belum ada gambar
          </div>
        )}
        <span
          className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-widest ${
            tpl.active ? "bg-emerald-500/90 text-white" : "bg-stone/70 text-white"
          }`}
        >
          {tpl.active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />} {tpl.active ? "Aktif" : "Nonaktif"}
        </span>
      </div>

      <div className="space-y-3 p-4">
        <div className="grid grid-cols-2 gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama"
            className="rounded-md border border-charcoal/15 bg-ivory px-3 py-2 text-sm outline-none focus:border-bordeaux"
          />
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Kategori"
            className="rounded-md border border-charcoal/15 bg-ivory px-3 py-2 text-sm outline-none focus:border-bordeaux"
          />
        </div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Deskripsi singkat..."
          rows={2}
          className="w-full rounded-md border border-charcoal/15 bg-ivory px-3 py-2 text-sm outline-none focus:border-bordeaux"
        />
        <label className="flex items-center gap-2 text-xs text-stone">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /> Tampilkan di katalog publik
        </label>

        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-stone">Berkas ({tpl.files.length})</p>
          <ul className="mt-2 divide-y divide-charcoal/5 rounded-md border border-charcoal/10">
            {tpl.file_urls.length === 0 && (
              <li className="p-3 text-center text-xs text-stone">Belum ada berkas</li>
            )}
            {tpl.file_urls.map((f) => (
              <li key={f.path} className="flex items-center gap-3 p-2 text-xs">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded bg-cream">
                  {f.kind === "image" && f.url ? (
                    <img src={f.url} alt={f.name} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-stone">
                      <FileText className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-charcoal">{f.name}</p>
                  <p className="text-[10px] uppercase tracking-widest text-stone">{f.kind}</p>
                </div>
                {f.kind === "image" && (
                  <button
                    type="button"
                    title={tpl.cover_path === f.path ? "Cover" : "Jadikan cover"}
                    onClick={() => setCover(f.path)}
                    className={`rounded p-1.5 ${tpl.cover_path === f.path ? "text-gilded" : "text-stone hover:text-bordeaux"}`}
                  >
                    <Star className="h-4 w-4" fill={tpl.cover_path === f.path ? "currentColor" : "none"} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeFile(f.path)}
                  className="rounded p-1.5 text-stone hover:text-red-600"
                  title="Hapus"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,application/pdf"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="mt-2 inline-flex items-center gap-2 rounded-full border border-charcoal/20 px-3 py-1.5 text-[11px] uppercase tracking-widest text-charcoal hover:border-bordeaux hover:text-bordeaux disabled:opacity-50"
          >
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />} Unggah JPG/PNG/PDF
          </button>
        </div>

        {localErr && <p className="text-xs text-red-600">{localErr}</p>}

        <div className="flex items-center justify-between gap-2 border-t border-charcoal/10 pt-3">
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
          >
            <X className="h-3.5 w-3.5" /> Hapus template
          </button>
          <button
            type="button"
            onClick={saveMeta}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-full bg-bordeaux px-4 py-1.5 text-[11px] uppercase tracking-[0.22em] text-ivory hover:bg-charcoal disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImageIcon className="h-3.5 w-3.5" />} Simpan
          </button>
        </div>
      </div>
    </article>
  );
}