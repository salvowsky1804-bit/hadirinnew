// Read-only helpers for guest-facing pages. Uses the anon Supabase client;
// RLS restricts access to published projects and their child rows.
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { InvitationData, InvitationProject, WishEntry } from "@/types/invitation";

function blankPerson() {
  return { fullName: "", nickName: "", fatherName: "", motherName: "" };
}

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

export function usePublicProject(slug: string) {
  const [state, setState] = useState<{
    loading: boolean;
    project: InvitationProject | null;
    error: string | null;
  }>({ loading: true, project: null, error: null });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        setState({ loading: false, project: null, error: error.message });
        return;
      }
      setState({
        loading: false,
        project: data ? rowToProject(data) : null,
        error: null,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return state;
}

export async function submitPublicRsvp(input: {
  projectId: string;
  name: string;
  status: "attending" | "tentative" | "not_attending";
  pax: number;
}) {
  const attendance =
    input.status === "attending"
      ? "hadir"
      : input.status === "tentative"
        ? "ragu"
        : "tidak_hadir";
  const { error } = await supabase.from("rsvps").insert({
    project_id: input.projectId,
    name: input.name,
    attendance,
    head_count: input.pax,
  });
  if (error) throw new Error(error.message);
}

export async function submitPublicWish(input: {
  projectId: string;
  name: string;
  message: string;
}) {
  const { error } = await supabase.from("wishes").insert({
    project_id: input.projectId,
    name: input.name,
    message: input.message,
  });
  if (error) throw new Error(error.message);
}

export function usePublicWishes(projectId: string | undefined) {
  const [wishes, setWishes] = useState<WishEntry[]>([]);
  const [reloadFlag, setReloadFlag] = useState(0);

  useEffect(() => {
    if (!projectId) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("wishes")
        .select("id,name,message,created_at")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })
        .limit(40);
      if (cancelled || !data) return;
      setWishes(
        data.map((w: any) => ({
          id: w.id,
          guestName: w.name,
          message: w.message,
          submittedAt: w.created_at,
        })),
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [projectId, reloadFlag]);

  return { wishes, reload: () => setReloadFlag((x) => x + 1) };
}

/** Fetch signed URL for the QR image of a specific guest name in a project. */
export function usePublicGuestQr(
  projectId: string | undefined,
  guestName: string | undefined,
) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!projectId || !guestName) {
      setUrl(null);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("guests")
        .select("qr_path")
        .eq("project_id", projectId)
        .eq("name", guestName)
        .maybeSingle();
      const path = (data as { qr_path?: string } | null)?.qr_path;
      if (!path) {
        if (!cancelled) setUrl(null);
        return;
      }
      const { data: signed } = await supabase.storage
        .from("guest-qr")
        .createSignedUrl(path, 60 * 60 * 24);
      if (!cancelled) setUrl(signed?.signedUrl ?? null);
    })();
    return () => {
      cancelled = true;
    };
  }, [projectId, guestName]);
  return url;
}