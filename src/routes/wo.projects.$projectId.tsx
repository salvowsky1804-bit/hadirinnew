import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useProjects, slugify } from "@/lib/projects-store";
import { getTemplate } from "@/lib/template-registry";
import { PhotoUpload } from "@/components/PhotoUpload";
import { uploadGuestQr, getSignedUrl } from "@/lib/media";
import type {
  GalleryPhoto,
  GiftAccount,
  InvitationData,
  InvitationEvent,
  LoveStoryMoment,
  Person,
  Guest,
} from "@/types/invitation";
import type { TemplateFieldDef } from "@/types/template";

export const Route = createFileRoute("/wo/projects/$projectId")({
  component: ProjectEditor,
});

type Tab =
  | "ringkasan"
  | "pasangan"
  | "acara"
  | "kisah"
  | "galeri"
  | "hadiah"
  | "custom"
  | "tamu";

function ProjectEditor() {
  const { projectId } = Route.useParams();
  const navigate = useNavigate();
  const {
    getProject,
    updateProject,
    updateData,
    removeProject,
    addGuest,
    removeGuest,
    updateGuest,
  } = useProjects();
  const project = getProject(projectId);
  const [tab, setTab] = useState<Tab>("ringkasan");

  if (!project) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-sm">
        Proyek tidak ditemukan.{" "}
        <Link to="/wo" className="underline">
          Kembali ke daftar
        </Link>
      </div>
    );
  }

  const template = getTemplate(project.templateSlug);
  const customFields: TemplateFieldDef[] = template?.manifest.fields ?? [];

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: "ringkasan", label: "Ringkasan" },
    { id: "pasangan", label: "Pasangan" },
    { id: "acara", label: "Acara" },
    { id: "kisah", label: "Kisah" },
    { id: "galeri", label: "Galeri" },
    { id: "hadiah", label: "Hadiah" },
    ...(customFields.length > 0
      ? ([{ id: "custom" as Tab, label: `Custom (${customFields.length})` }] as const)
      : []),
    { id: "tamu", label: `Tamu (${project.guests.length})` },
  ];

  function togglePublish() {
    updateProject(project!.id, (p) => ({
      ...p,
      status: p.status === "published" ? "draft" : "published",
    }));
  }

  function onDelete() {
    if (!confirm("Hapus proyek ini? Tindakan tidak dapat dibatalkan.")) return;
    removeProject(project!.id);
    navigate({ to: "/wo" });
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
        <div>
          <h2 className="font-serif text-2xl">{project.coupleLabel}</h2>
          <p className="text-xs text-muted-foreground">
            Template <strong>{project.templateSlug}</strong> · /u/{project.slug}{" "}
            ·{" "}
            <span
              className={
                project.status === "published"
                  ? "text-emerald-700"
                  : "text-amber-700"
              }
            >
              {project.status === "published" ? "Terbit" : "Draft"}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <Link
            to="/u/$slug"
            params={{ slug: project.slug }}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-border px-3 py-1.5 hover:bg-muted"
          >
            Preview ↗
          </Link>
          <Link
            to="/wo/projects/$projectId/rsvp"
            params={{ projectId }}
            className="rounded-md border border-border px-3 py-1.5 hover:bg-muted"
          >
            RSVP & Ucapan
          </Link>
          <button
            type="button"
            onClick={togglePublish}
            className="rounded-md bg-foreground px-3 py-1.5 text-background hover:opacity-90"
          >
            {project.status === "published" ? "Jadikan Draft" : "Terbitkan"}
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-md border border-destructive px-3 py-1.5 text-destructive hover:bg-destructive/10"
          >
            Hapus
          </button>
        </div>
      </header>

      <nav
        aria-label="Bagian editor"
        className="flex flex-wrap gap-1 border-b border-border"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`-mb-px border-b-2 px-3 py-2 text-sm transition ${
              tab === t.id
                ? "border-foreground font-medium text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="max-w-3xl">
        {tab === "ringkasan" && (
          <SummaryTab
            project={project}
            onChange={(patch) => updateProject(project.id, (p) => ({ ...p, ...patch }))}
          />
        )}
        {tab === "pasangan" && (
          <CoupleTab
            projectId={project.id}
            data={project.data}
            onChange={(d) => updateData(project.id, () => d)}
          />
        )}
        {tab === "acara" && (
          <EventsTab
            data={project.data}
            onChange={(d) => updateData(project.id, () => d)}
          />
        )}
        {tab === "kisah" && (
          <StoryTab
            data={project.data}
            onChange={(d) => updateData(project.id, () => d)}
          />
        )}
        {tab === "galeri" && (
          <GalleryTab
            projectId={project.id}
            data={project.data}
            onChange={(d) => updateData(project.id, () => d)}
          />
        )}
        {tab === "hadiah" && (
          <GiftsTab
            data={project.data}
            onChange={(d) => updateData(project.id, () => d)}
          />
        )}
        {tab === "custom" && customFields.length > 0 && (
          <CustomTab
            fields={customFields}
            data={project.data}
            onChange={(d) => updateData(project.id, () => d)}
          />
        )}
        {tab === "tamu" && (
          <GuestsTab
            project={project}
            onAdd={(g) => addGuest(project.id, g)}
            onRemove={(gid) => removeGuest(project.id, gid)}
            onUpdate={(gid, patch) => updateGuest(project.id, gid, patch)}
          />
        )}
      </div>

      <style>{`.input{width:100%;border:1px solid var(--color-border);border-radius:0.375rem;padding:0.5rem 0.75rem;font-size:0.875rem;background:var(--color-background)}.input:focus{outline:2px solid var(--color-ring);outline-offset:1px}.lbl{display:block;font-size:0.8125rem;font-weight:500;margin-bottom:0.25rem}`}</style>
    </div>
  );
}

// ---------------- Tabs ----------------

type ProjectPatch = { coupleLabel?: string; slug?: string; eventDate?: string };
function SummaryTab({
  project,
  onChange,
}: {
  project: ReturnType<typeof useProjects>["projects"][number];
  onChange: (patch: ProjectPatch) => void;
}) {
  return (
    <div className="space-y-4">
      <Row>
        <label>
          <span className="lbl">Label Pasangan</span>
          <input
            className="input"
            value={project.coupleLabel}
            onChange={(e) => onChange({ coupleLabel: e.target.value })}
            maxLength={80}
          />
        </label>
        <label>
          <span className="lbl">Tanggal Acara</span>
          <input
            type="date"
            className="input"
            value={project.eventDate}
            onChange={(e) => onChange({ eventDate: e.target.value })}
          />
        </label>
      </Row>
      <label className="block">
        <span className="lbl">Slug URL</span>
        <input
          className="input"
          value={project.slug}
          onChange={(e) => onChange({ slug: slugify(e.target.value) })}
          maxLength={60}
        />
        <span className="mt-1 block text-xs text-muted-foreground">
          Undangan: /u/{project.slug}
        </span>
      </label>
    </div>
  );
}

function CoupleTab({
  data,
  projectId,
  onChange,
}: {
  data: InvitationData;
  projectId: string;
  onChange: (d: InvitationData) => void;
}) {
  const update = (key: "groom" | "bride", patch: Partial<Person>) =>
    onChange({ ...data, [key]: { ...data[key], ...patch } });
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {(["groom", "bride"] as const).map((k) => (
        <fieldset key={k} className="space-y-3 rounded-lg border border-border p-4">
          <legend className="px-1 font-serif text-lg">
            {k === "groom" ? "Mempelai Pria" : "Mempelai Wanita"}
          </legend>
          <PersonField
            projectId={projectId}
            person={data[k]}
            onChange={(patch) => update(k, patch)}
          />
        </fieldset>
      ))}
    </div>
  );
}

function PersonField({
  person,
  projectId,
  onChange,
}: {
  person: Person;
  projectId: string;
  onChange: (p: Partial<Person>) => void;
}) {
  return (
    <>
      <label>
        <span className="lbl">Nama Lengkap</span>
        <input
          className="input"
          value={person.fullName}
          onChange={(e) => onChange({ fullName: e.target.value })}
          maxLength={120}
        />
      </label>
      <label>
        <span className="lbl">Nama Panggilan</span>
        <input
          className="input"
          value={person.nickName}
          onChange={(e) => onChange({ nickName: e.target.value })}
          maxLength={60}
        />
      </label>
      <Row>
        <label>
          <span className="lbl">Ayah</span>
          <input
            className="input"
            value={person.fatherName}
            onChange={(e) => onChange({ fatherName: e.target.value })}
          />
        </label>
        <label>
          <span className="lbl">Ibu</span>
          <input
            className="input"
            value={person.motherName}
            onChange={(e) => onChange({ motherName: e.target.value })}
          />
        </label>
      </Row>
      <Row>
        <div>
          <PhotoUpload
            projectId={projectId}
            value={person.photo ?? ""}
            kind="person"
            aspect="portrait"
            label="Foto"
            onChange={(url) => onChange({ photo: url })}
          />
        </div>
        <label>
          <span className="lbl">Instagram</span>
          <input
            className="input"
            value={person.instagram ?? ""}
            onChange={(e) => onChange({ instagram: e.target.value })}
            placeholder="@username"
          />
        </label>
      </Row>
    </>
  );
}

function EventsTab({
  data,
  onChange,
}: {
  data: InvitationData;
  onChange: (d: InvitationData) => void;
}) {
  const set = (events: InvitationEvent[]) => onChange({ ...data, events });
  const blank = (): InvitationEvent => ({
    id: `e_${Math.random().toString(36).slice(2, 8)}`,
    name: "Acara Baru",
    date: "",
    startTime: "",
    endTime: "",
    venueName: "",
    address: "",
  });
  return (
    <RepeaterList
      items={data.events}
      onAdd={() => set([...data.events, blank()])}
      addLabel="+ Tambah Acara"
      empty="Belum ada acara."
      renderItem={(ev, idx) => (
        <>
          <Row>
            <label>
              <span className="lbl">Nama Acara</span>
              <input
                className="input"
                value={ev.name}
                onChange={(e) => {
                  const arr = [...data.events];
                  arr[idx] = { ...ev, name: e.target.value };
                  set(arr);
                }}
              />
            </label>
            <label>
              <span className="lbl">Tanggal</span>
              <input
                type="date"
                className="input"
                value={ev.date}
                onChange={(e) => {
                  const arr = [...data.events];
                  arr[idx] = { ...ev, date: e.target.value };
                  set(arr);
                }}
              />
            </label>
          </Row>
          <Row>
            <label>
              <span className="lbl">Mulai</span>
              <input
                type="time"
                className="input"
                value={ev.startTime}
                onChange={(e) => {
                  const arr = [...data.events];
                  arr[idx] = { ...ev, startTime: e.target.value };
                  set(arr);
                }}
              />
            </label>
            <label>
              <span className="lbl">Selesai</span>
              <input
                type="time"
                className="input"
                value={ev.endTime}
                onChange={(e) => {
                  const arr = [...data.events];
                  arr[idx] = { ...ev, endTime: e.target.value };
                  set(arr);
                }}
              />
            </label>
          </Row>
          <label>
            <span className="lbl">Tempat</span>
            <input
              className="input"
              value={ev.venueName}
              onChange={(e) => {
                const arr = [...data.events];
                arr[idx] = { ...ev, venueName: e.target.value };
                set(arr);
              }}
            />
          </label>
          <label>
            <span className="lbl">Alamat</span>
            <textarea
              className="input"
              rows={2}
              value={ev.address}
              onChange={(e) => {
                const arr = [...data.events];
                arr[idx] = { ...ev, address: e.target.value };
                set(arr);
              }}
            />
          </label>
          <label>
            <span className="lbl">Tautan Google Maps</span>
            <input
              className="input"
              value={ev.mapsUrl ?? ""}
              onChange={(e) => {
                const arr = [...data.events];
                arr[idx] = { ...ev, mapsUrl: e.target.value };
                set(arr);
              }}
              placeholder="https://maps.google.com/..."
            />
          </label>
        </>
      )}
      onRemove={(idx) => set(data.events.filter((_, i) => i !== idx))}
    />
  );
}

function StoryTab({
  data,
  onChange,
}: {
  data: InvitationData;
  onChange: (d: InvitationData) => void;
}) {
  const set = (loveStory: LoveStoryMoment[]) => onChange({ ...data, loveStory });
  const blank = (): LoveStoryMoment => ({
    id: `ls_${Math.random().toString(36).slice(2, 8)}`,
    date: "",
    title: "",
    description: "",
  });
  return (
    <RepeaterList
      items={data.loveStory}
      onAdd={() => set([...data.loveStory, blank()])}
      addLabel="+ Tambah Momen"
      empty="Belum ada momen kisah."
      renderItem={(m, idx) => (
        <>
          <Row>
            <label>
              <span className="lbl">Tanggal</span>
              <input
                type="date"
                className="input"
                value={m.date}
                onChange={(e) => {
                  const arr = [...data.loveStory];
                  arr[idx] = { ...m, date: e.target.value };
                  set(arr);
                }}
              />
            </label>
            <label>
              <span className="lbl">Judul</span>
              <input
                className="input"
                value={m.title}
                onChange={(e) => {
                  const arr = [...data.loveStory];
                  arr[idx] = { ...m, title: e.target.value };
                  set(arr);
                }}
              />
            </label>
          </Row>
          <label>
            <span className="lbl">Cerita</span>
            <textarea
              className="input"
              rows={3}
              value={m.description}
              onChange={(e) => {
                const arr = [...data.loveStory];
                arr[idx] = { ...m, description: e.target.value };
                set(arr);
              }}
              maxLength={500}
            />
          </label>
        </>
      )}
      onRemove={(idx) => set(data.loveStory.filter((_, i) => i !== idx))}
    />
  );
}

function GalleryTab({
  data,
  onChange,
}: {
  data: InvitationData;
  onChange: (d: InvitationData) => void;
}) {
  const set = (gallery: GalleryPhoto[]) => onChange({ ...data, gallery });
  const blank = (): GalleryPhoto => ({
    id: `ph_${Math.random().toString(36).slice(2, 8)}`,
    url: "",
  });
  return (
    <RepeaterList
      items={data.gallery}
      onAdd={() => set([...data.gallery, blank()])}
      addLabel="+ Tambah Foto"
      empty="Galeri kosong."
      renderItem={(ph, idx) => (
        <>
          <label>
            <span className="lbl">URL Foto</span>
            <input
              className="input"
              value={ph.url}
              onChange={(e) => {
                const arr = [...data.gallery];
                arr[idx] = { ...ph, url: e.target.value };
                set(arr);
              }}
              placeholder="https://…"
            />
          </label>
          <label>
            <span className="lbl">Caption (opsional)</span>
            <input
              className="input"
              value={ph.caption ?? ""}
              onChange={(e) => {
                const arr = [...data.gallery];
                arr[idx] = { ...ph, caption: e.target.value };
                set(arr);
              }}
              maxLength={120}
            />
          </label>
          {ph.url ? (
            <img
              src={ph.url}
              alt=""
              className="mt-2 h-24 w-24 rounded object-cover"
            />
          ) : null}
        </>
      )}
      onRemove={(idx) => set(data.gallery.filter((_, i) => i !== idx))}
    />
  );
}

function GiftsTab({
  data,
  onChange,
}: {
  data: InvitationData;
  onChange: (d: InvitationData) => void;
}) {
  const set = (gifts: GiftAccount[]) => onChange({ ...data, gifts });
  const blank = (): GiftAccount => ({
    id: `gi_${Math.random().toString(36).slice(2, 8)}`,
    kind: "bank",
    provider: "",
    accountNumber: "",
    accountName: "",
  });
  return (
    <RepeaterList
      items={data.gifts}
      onAdd={() => set([...data.gifts, blank()])}
      addLabel="+ Tambah Rekening"
      empty="Belum ada hadiah."
      renderItem={(g, idx) => (
        <>
          <Row>
            <label>
              <span className="lbl">Jenis</span>
              <select
                className="input"
                value={g.kind}
                onChange={(e) => {
                  const arr = [...data.gifts];
                  arr[idx] = { ...g, kind: e.target.value as GiftAccount["kind"] };
                  set(arr);
                }}
              >
                <option value="bank">Bank</option>
                <option value="ewallet">E-Wallet</option>
              </select>
            </label>
            <label>
              <span className="lbl">Penyedia</span>
              <input
                className="input"
                value={g.provider}
                onChange={(e) => {
                  const arr = [...data.gifts];
                  arr[idx] = { ...g, provider: e.target.value };
                  set(arr);
                }}
                placeholder="BCA / GoPay"
              />
            </label>
          </Row>
          <Row>
            <label>
              <span className="lbl">Nomor</span>
              <input
                className="input"
                value={g.accountNumber}
                onChange={(e) => {
                  const arr = [...data.gifts];
                  arr[idx] = { ...g, accountNumber: e.target.value };
                  set(arr);
                }}
              />
            </label>
            <label>
              <span className="lbl">Atas Nama</span>
              <input
                className="input"
                value={g.accountName}
                onChange={(e) => {
                  const arr = [...data.gifts];
                  arr[idx] = { ...g, accountName: e.target.value };
                  set(arr);
                }}
              />
            </label>
          </Row>
        </>
      )}
      onRemove={(idx) => set(data.gifts.filter((_, i) => i !== idx))}
    />
  );
}

function CustomTab({
  fields,
  data,
  onChange,
}: {
  fields: TemplateFieldDef[];
  data: InvitationData;
  onChange: (d: InvitationData) => void;
}) {
  const setVal = (id: string, value: unknown) =>
    onChange({ ...data, custom: { ...data.custom, [id]: value } });
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Field di bawah dideklarasikan oleh manifest template.
      </p>
      {fields.map((f) => {
        const val = (data.custom[f.id] as string | undefined) ?? "";
        return (
          <label key={f.id} className="block">
            <span className="lbl">
              {f.label}
              {f.required ? <span className="text-destructive"> *</span> : null}
            </span>
            {f.type === "textarea" ? (
              <textarea
                className="input"
                rows={4}
                value={val}
                placeholder={f.placeholder}
                onChange={(e) => setVal(f.id, e.target.value)}
              />
            ) : (
              <input
                className="input"
                type={f.type === "date" ? "date" : f.type === "time" ? "time" : f.type === "url" ? "url" : "text"}
                value={val}
                placeholder={f.placeholder}
                onChange={(e) => setVal(f.id, e.target.value)}
              />
            )}
            {f.help ? (
              <span className="mt-1 block text-xs text-muted-foreground">
                {f.help}
              </span>
            ) : null}
          </label>
        );
      })}
    </div>
  );
}

function GuestsTab({
  project,
  onAdd,
  onRemove,
}: {
  project: ReturnType<typeof useProjects>["projects"][number];
  onAdd: (g: { name: string; group?: string; pax: number; slug: string }) => void;
  onRemove: (id: string) => void;
}) {
  const [name, setName] = useState("");
  const [group, setGroup] = useState("");
  const [pax, setPax] = useState(1);
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = name.trim();
    if (trimmed.length < 2) return setError("Nama minimal 2 karakter");
    if (trimmed.length > 80) return setError("Nama maksimal 80 karakter");
    if (pax < 1 || pax > 20) return setError("Pax 1–20");
    onAdd({
      name: trimmed,
      group: group.trim() || undefined,
      pax,
      slug: slugify(trimmed),
    });
    setName("");
    setGroup("");
    setPax(1);
  }

  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-3 font-medium">Tambah Tamu</h3>
        <Row>
          <label className="md:col-span-2">
            <span className="lbl">Nama / Keluarga</span>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              required
            />
          </label>
          <label>
            <span className="lbl">Grup</span>
            <input
              className="input"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              placeholder="Keluarga / Teman"
              maxLength={40}
            />
          </label>
          <label>
            <span className="lbl">Pax</span>
            <input
              type="number"
              min={1}
              max={20}
              className="input"
              value={pax}
              onChange={(e) => setPax(Number(e.target.value) || 1)}
            />
          </label>
        </Row>
        {error ? (
          <p role="alert" className="mt-2 text-xs text-destructive">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          className="mt-3 rounded-md bg-foreground px-3 py-1.5 text-xs text-background hover:opacity-90"
        >
          Tambah
        </button>
      </form>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-3 py-2">Nama</th>
              <th className="px-3 py-2">Grup</th>
              <th className="px-3 py-2">Pax</th>
              <th className="px-3 py-2">Tautan</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {project.guests.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-muted-foreground">
                  Belum ada tamu.
                </td>
              </tr>
            ) : null}
            {project.guests.map((g) => {
              const url = `/u/${project.slug}?tamu=${encodeURIComponent(g.name)}`;
              return (
                <tr key={g.id} className="border-t border-border">
                  <td className="px-3 py-2 font-medium">{g.name}</td>
                  <td className="px-3 py-2 text-muted-foreground">{g.group ?? "—"}</td>
                  <td className="px-3 py-2">{g.pax}</td>
                  <td className="px-3 py-2">
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs underline"
                    >
                      buka ↗
                    </a>{" "}
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof navigator !== "undefined")
                          navigator.clipboard?.writeText(window.location.origin + url);
                      }}
                      className="text-xs text-muted-foreground underline"
                    >
                      salin
                    </button>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => onRemove(g.id)}
                      className="text-xs text-destructive hover:underline"
                    >
                      hapus
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------- helpers ----------------

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 md:grid-cols-2">{children}</div>;
}

function RepeaterList<T extends { id: string }>({
  items,
  onAdd,
  onRemove,
  renderItem,
  addLabel,
  empty,
}: {
  items: T[];
  onAdd: () => void;
  onRemove: (idx: number) => void;
  renderItem: (item: T, idx: number) => React.ReactNode;
  addLabel: string;
  empty: string;
}) {
  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="rounded-md border border-dashed border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
          {empty}
        </p>
      ) : null}
      {items.map((it, idx) => (
        <div
          key={it.id}
          className="space-y-3 rounded-lg border border-border bg-card p-4"
        >
          {renderItem(it, idx)}
          <button
            type="button"
            onClick={() => onRemove(idx)}
            className="text-xs text-destructive hover:underline"
          >
            Hapus
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="rounded-md border border-dashed border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
      >
        {addLabel}
      </button>
    </div>
  );
}
