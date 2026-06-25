import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { dummyProjects } from "@/data/dummy";
import type {
  Guest,
  InvitationData,
  InvitationProject,
  RsvpEntry,
  WishEntry,
} from "@/types/invitation";

const STORAGE_KEY = "studio.projects.v1";

interface Ctx {
  projects: InvitationProject[];
  getProject: (id: string) => InvitationProject | undefined;
  getProjectBySlug: (slug: string) => InvitationProject | undefined;
  createProject: (input: {
    coupleLabel: string;
    slug: string;
    templateSlug: string;
    eventDate: string;
    ownerWoId: string;
  }) => InvitationProject;
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
  removeGuest: (id: string, guestId: string) => void;
  addRsvp: (id: string, r: Omit<RsvpEntry, "id" | "submittedAt">) => void;
  addWish: (id: string, w: Omit<WishEntry, "id" | "submittedAt">) => void;
}

const ProjectsCtx = createContext<Ctx | null>(null);

function loadInitial(): InvitationProject[] {
  if (typeof window === "undefined") return dummyProjects;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return dummyProjects;
    const parsed = JSON.parse(raw) as InvitationProject[];
    if (!Array.isArray(parsed) || parsed.length === 0) return dummyProjects;
    return parsed;
  } catch {
    return dummyProjects;
  }
}

function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<InvitationProject[]>(() =>
    loadInitial(),
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch {
      /* noop */
    }
  }, [projects]);

  const getProject = useCallback(
    (id: string) => projects.find((p) => p.id === id),
    [projects],
  );

  const getProjectBySlug = useCallback(
    (slug: string) => projects.find((p) => p.slug === slug),
    [projects],
  );

  const createProject: Ctx["createProject"] = useCallback((input) => {
    const id = uid("p");
    const project: InvitationProject = {
      id,
      slug: input.slug,
      coupleLabel: input.coupleLabel,
      eventDate: input.eventDate,
      templateSlug: input.templateSlug,
      status: "draft",
      createdAt: new Date().toISOString().slice(0, 10),
      ownerWoId: input.ownerWoId,
      guests: [],
      rsvps: [],
      wishes: [],
      data: {
        id: uid("inv"),
        eventId: uid("evt"),
        templateSlug: input.templateSlug,
        groom: {
          fullName: "",
          nickName: "",
          fatherName: "",
          motherName: "",
        },
        bride: {
          fullName: "",
          nickName: "",
          fatherName: "",
          motherName: "",
        },
        events: [],
        loveStory: [],
        gallery: [],
        gifts: [],
        settings: {},
        custom: {},
      },
    };
    setProjects((prev) => [project, ...prev]);
    return project;
  }, []);

  const updateProject: Ctx["updateProject"] = useCallback((id, updater) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? updater(p) : p)));
  }, []);

  const updateData: Ctx["updateData"] = useCallback((id, updater) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, data: updater(p.data) } : p)),
    );
  }, []);

  const removeProject: Ctx["removeProject"] = useCallback((id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addGuest: Ctx["addGuest"] = useCallback((id, g) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, guests: [...p.guests, { ...g, id: uid("g") }] }
          : p,
      ),
    );
  }, []);

  const removeGuest: Ctx["removeGuest"] = useCallback((id, guestId) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, guests: p.guests.filter((g) => g.id !== guestId) }
          : p,
      ),
    );
  }, []);

  const addRsvp: Ctx["addRsvp"] = useCallback((id, r) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              rsvps: [
                ...p.rsvps,
                {
                  ...r,
                  id: uid("r"),
                  submittedAt: new Date().toISOString(),
                },
              ],
            }
          : p,
      ),
    );
  }, []);

  const addWish: Ctx["addWish"] = useCallback((id, w) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              wishes: [
                ...p.wishes,
                {
                  ...w,
                  id: uid("w"),
                  submittedAt: new Date().toISOString(),
                },
              ],
            }
          : p,
      ),
    );
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      projects,
      getProject,
      getProjectBySlug,
      createProject,
      updateProject,
      updateData,
      removeProject,
      addGuest,
      removeGuest,
      addRsvp,
      addWish,
    }),
    [
      projects,
      getProject,
      getProjectBySlug,
      createProject,
      updateProject,
      updateData,
      removeProject,
      addGuest,
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
  if (typeof window !== "undefined")
    window.localStorage.removeItem(STORAGE_KEY);
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