import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import type {
  Guest,
  InvitationData,
  InvitationProject,
  RsvpEntry,
  WishEntry,
} from "@/types/invitation";

interface Ctx {
  projects: InvitationProject[];
  loading: boolean;
  refresh: () => Promise<void>;
  getProject: (id: string) => InvitationProject | undefined;
  getProjectBySlug: (slug: string) => InvitationProject | undefined;
  createProject: (input: {
    coupleLabel: string;
    slug: string;
    templateSlug: string;
    eventDate: string;
    ownerWoId: string;
  }) => Promise<InvitationProject>;
  updateProject: (
    id: string,
    updater: (p: InvitationProject) => InvitationProject,
  ) => void;
  updateData: (
    id: string,
    updater: (d: InvitationData) => InvitationData,
  ) => void;
  removeProject: (id: string) => void;
  addGuest: (id: string, g: Omit<Guest, "id">) => void;
  updateGuest: (id: string, guestId: string, patch: Partial<Guest>) => void;
  removeGuest: (id: string, guestId: string) => void;
  addRsvp: (id: string, r: Omit<RsvpEntry, "id" | "submittedAt">) => void;
  addWish: (id: string, w: Omit<WishEntry, "id" | "submittedAt">) => void;
}

const ProjectsCtx = createContext<Ctx | null>(null);

// Row → domain mapping. `data` JSON column holds the full InvitationData.
function rowToProject(row: any): InvitationProject {
  const data = (row.data ?? {}) as Partial<InvitationData>;
  return {
    id: row.id,
    slug: row.slug,
    coupleLabel:
      row.bride_name && row.groom_name
        ? `${row.groom_name} & ${row.bride_name}`
        : row.slug,
    eventDate: row.event_date ?? "",
    templateSlug: row.template_slug,
    status: row.status,
    createdAt: (row.created_at ?? "").slice(0, 10),
    ownerWoId: row.owner_id,
    guests: [],
    rsvps: [],
    wishes: [],
    data: {
      id: row.id,
      eventId: row.id,
      templateSlug: row.template_slug,
      groom: data.groom ?? blankPerson(),
      bride: data.bride ?? blankPerson(),
      events: data.events ?? [],
      loveStory: data.loveStory ?? [],
      gallery: data.gallery ?? [],
      gifts: data.gifts ?? [],
      settings: data.settings ?? {},
      custom: data.custom ?? {},
    },
  };
}

function blankPerson() {
  return { fullName: "", nickName: "", fatherName: "", motherName: "" };
}

function guestRow(g: any): Guest {
  return {
    id: g.id,
    name: g.name,
    group: g.group_label ?? undefined,
    pax: g.plus_ones ?? 1,
    slug: g.invite_code ?? slugify(g.name),
    // qr_path is exposed as `qr` for UI convenience (contains storage path).
    ...(g.qr_path ? { qr: g.qr_path as string } : {}),
  } as Guest;
}

function rsvpRow(r: any): RsvpEntry {
  return {
    id: r.id,
    guestName: r.name,
    status:
      r.attendance === "hadir"
        ? "attending"
        : r.attendance === "ragu"
          ? "tentative"
          : "not_attending",
    pax: r.head_count ?? 1,
    submittedAt: r.created_at,
  };
}

function statusToAttendance(
  s: RsvpEntry["status"],
): "hadir" | "tidak_hadir" | "ragu" {
  return s === "attending" ? "hadir" : s === "tentative" ? "ragu" : "tidak_hadir";
}

function wishRow(w: any): WishEntry {
  return {
    id: w.id,
    guestName: w.name,
    message: w.message,
    submittedAt: w.created_at,
  };
}

function coupleFromLabel(label: string): { groom: string; bride: string } {
  const parts = label.split(/[&+]/).map((s) => s.trim()).filter(Boolean);
  return { groom: parts[0] ?? label, bride: parts[1] ?? "" };
}

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<InvitationProject[]>([]);
  const [loading, setLoading] = useState(true);
  const debouncers = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  const refresh = useCallback(async () => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data: projRows, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }
    const base = (projRows ?? []).map(rowToProject);
    const ids = base.map((p) => p.id);
    if (ids.length === 0) {
      setProjects([]);
      setLoading(false);
      return;
    }
    const [guestsRes, rsvpsRes, wishesRes] = await Promise.all([
      supabase.from("guests").select("*").in("project_id", ids),
      supabase.from("rsvps").select("*").in("project_id", ids),
      supabase.from("wishes").select("*").in("project_id", ids),
    ]);
    const gMap = new Map<string, Guest[]>();
    for (const g of guestsRes.data ?? []) {
      const list = gMap.get(g.project_id) ?? [];
      list.push(guestRow(g));
      gMap.set(g.project_id, list);
    }
    const rMap = new Map<string, RsvpEntry[]>();
    for (const r of rsvpsRes.data ?? []) {
      const list = rMap.get(r.project_id) ?? [];
      list.push(rsvpRow(r));
      rMap.set(r.project_id, list);
    }
    const wMap = new Map<string, WishEntry[]>();
    for (const w of wishesRes.data ?? []) {
      const list = wMap.get(w.project_id) ?? [];
      list.push(wishRow(w));
      wMap.set(w.project_id, list);
    }
    setProjects(
      base.map((p) => ({
        ...p,
        guests: gMap.get(p.id) ?? [],
        rsvps: rMap.get(p.id) ?? [],
        wishes: wMap.get(p.id) ?? [],
      })),
    );
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    refresh();
  }, [authLoading, refresh]);

  const getProject = useCallback(
    (id: string) => projects.find((p) => p.id === id),
    [projects],
  );

  const getProjectBySlug = useCallback(
    (slug: string) => projects.find((p) => p.slug === slug),
    [projects],
  );

  const createProject: Ctx["createProject"] = useCallback(
    async (input) => {
      const { groom, bride } = coupleFromLabel(input.coupleLabel);
      const initialData: InvitationData = {
        id: "",
        eventId: "",
        templateSlug: input.templateSlug,
        groom: { ...blankPerson(), fullName: groom, nickName: groom },
        bride: { ...blankPerson(), fullName: bride, nickName: bride },
        events: [],
        loveStory: [],
        gallery: [],
        gifts: [],
        settings: {},
        custom: {},
      };
      const { data, error } = await supabase
        .from("projects")
        .insert({
          slug: input.slug,
          template_slug: input.templateSlug,
          event_date: input.eventDate || null,
          groom_name: groom,
          bride_name: bride,
          owner_id: input.ownerWoId,
          status: "draft",
          data: initialData as any,
        })
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      const p = rowToProject(data);
      setProjects((prev) => [p, ...prev]);
      return p;
    },
    [],
  );

  const persistProject = useCallback((id: string) => {
    const timers = debouncers.current;
    const existing = timers.get(id);
    if (existing) clearTimeout(existing);
    timers.set(
      id,
      setTimeout(async () => {
        timers.delete(id);
        const current = (
          (window as unknown as { __projects_snapshot?: InvitationProject[] })
            .__projects_snapshot ?? []
        ).find((p) => p.id === id);
        if (!current) return;
        const { groom, bride } = coupleFromLabel(current.coupleLabel);
        await supabase
          .from("projects")
          .update({
            slug: current.slug,
            event_date: current.eventDate || null,
            groom_name: groom,
            bride_name: bride,
            status: current.status,
            template_slug: current.templateSlug,
            data: current.data as any,
          })
          .eq("id", id);
      }, 600),
    );
  }, []);

  // Keep an always-fresh snapshot for the debouncer to read.
  useEffect(() => {
    (window as unknown as { __projects_snapshot?: InvitationProject[] }).__projects_snapshot =
      projects;
  }, [projects]);

  const updateProject: Ctx["updateProject"] = useCallback(
    (id, updater) => {
      setProjects((prev) => prev.map((p) => (p.id === id ? updater(p) : p)));
      persistProject(id);
    },
    [persistProject],
  );

  const updateData: Ctx["updateData"] = useCallback(
    (id, updater) => {
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, data: updater(p.data) } : p)),
      );
      persistProject(id);
    },
    [persistProject],
  );

  const removeProject: Ctx["removeProject"] = useCallback(async (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    await supabase.from("projects").delete().eq("id", id);
  }, []);

  const addGuest: Ctx["addGuest"] = useCallback(async (id, g) => {
    const { data, error } = await supabase
      .from("guests")
      .insert({
        project_id: id,
        name: g.name,
        group_label: g.group ?? null,
        plus_ones: g.pax,
        invite_code: g.slug,
      })
      .select("*")
      .single();
    if (error) return;
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, guests: [...p.guests, guestRow(data)] } : p,
      ),
    );
  }, []);

  const updateGuest: Ctx["updateGuest"] = useCallback(
    async (id, guestId, patch) => {
      const dbPatch: {
        name?: string;
        group_label?: string | null;
        plus_ones?: number;
        qr_path?: string | null;
      } = {};
      if ("name" in patch && patch.name !== undefined) dbPatch.name = patch.name;
      if ("group" in patch) dbPatch.group_label = patch.group ?? null;
      if ("pax" in patch && patch.pax !== undefined) dbPatch.plus_ones = patch.pax;
      if ("qr" in patch)
        dbPatch.qr_path = (patch as { qr?: string }).qr ?? null;
      setProjects((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                guests: p.guests.map((g) =>
                  g.id === guestId ? { ...g, ...patch } : g,
                ),
              }
            : p,
        ),
      );
      await supabase.from("guests").update(dbPatch).eq("id", guestId);
    },
    [],
  );

  const removeGuest: Ctx["removeGuest"] = useCallback(async (id, guestId) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, guests: p.guests.filter((g) => g.id !== guestId) }
          : p,
      ),
    );
    await supabase.from("guests").delete().eq("id", guestId);
  }, []);

  const addRsvp: Ctx["addRsvp"] = useCallback(async (id, r) => {
    const { data, error } = await supabase
      .from("rsvps")
      .insert({
        project_id: id,
        name: r.guestName,
        attendance: statusToAttendance(r.status) as any,
        head_count: r.pax,
      })
      .select("*")
      .single();
    if (error) return;
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, rsvps: [...p.rsvps, rsvpRow(data)] } : p,
      ),
    );
  }, []);

  const addWish: Ctx["addWish"] = useCallback(async (id, w) => {
    const { data, error } = await supabase
      .from("wishes")
      .insert({ project_id: id, name: w.guestName, message: w.message })
      .select("*")
      .single();
    if (error) return;
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, wishes: [...p.wishes, wishRow(data)] } : p,
      ),
    );
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      projects,
      loading,
      refresh,
      getProject,
      getProjectBySlug,
      createProject,
      updateProject,
      updateData,
      removeProject,
      addGuest,
      updateGuest,
      removeGuest,
      addRsvp,
      addWish,
    }),
    [
      projects,
      loading,
      refresh,
      getProject,
      getProjectBySlug,
      createProject,
      updateProject,
      updateData,
      removeProject,
      addGuest,
      updateGuest,
      removeGuest,
      addRsvp,
      addWish,
    ],
  );

  return (
    <ProjectsCtx.Provider value={value}>{children}</ProjectsCtx.Provider>
  );
}

export function useProjects(): Ctx {
  const ctx = useContext(ProjectsCtx);
  if (!ctx)
    throw new Error("useProjects must be used inside <ProjectsProvider>");
  return ctx;
}

export function resetProjectsStorage() {
  /* no-op — data lives in Supabase now */
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}