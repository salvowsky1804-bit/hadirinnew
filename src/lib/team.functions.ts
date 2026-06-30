import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin only");
}

export interface WoMemberRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  active: boolean;
  joinedAt: string;
  projectCount: number;
}

export const listWoMembers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<WoMemberRow[]> => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { data: roles, error: rolesErr } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .eq("role", "wo");
    if (rolesErr) throw new Error(rolesErr.message);
    const ids = (roles ?? []).map((r) => r.user_id);
    if (ids.length === 0) return [];

    const [{ data: profiles }, { data: projects }, usersRes] =
      await Promise.all([
        supabaseAdmin
          .from("profiles")
          .select("id, full_name, phone, active, created_at")
          .in("id", ids),
        supabaseAdmin
          .from("projects")
          .select("owner_id")
          .in("owner_id", ids),
        supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
      ]);

    const emailById = new Map<string, string>();
    for (const u of usersRes.data?.users ?? []) {
      if (u.id && u.email) emailById.set(u.id, u.email);
    }
    const countById = new Map<string, number>();
    for (const p of projects ?? []) {
      countById.set(p.owner_id, (countById.get(p.owner_id) ?? 0) + 1);
    }

    return (profiles ?? []).map((p) => ({
      id: p.id,
      name: p.full_name || emailById.get(p.id) || "Tanpa nama",
      email: emailById.get(p.id) ?? "",
      phone: p.phone,
      active: p.active,
      joinedAt: p.created_at,
      projectCount: countById.get(p.id) ?? 0,
    }));
  });

const addSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
});

export const addWoMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => addSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.fullName, phone: data.phone ?? null },
    });
    if (error) throw new Error(error.message);
    // handle_new_user trigger inserts profile + wo role automatically.
    return { id: created.user?.id };
  });

const toggleSchema = z.object({
  id: z.string().uuid(),
  active: z.boolean(),
});

export const setWoMemberActive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => toggleSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ active: data.active })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    // Also block/unblock sign-in by banning the auth user.
    await supabaseAdmin.auth.admin.updateUserById(data.id, {
      ban_duration: data.active ? "none" : "876000h",
    });
    return { ok: true };
  });

const removeSchema = z.object({ id: z.string().uuid() });

export const removeWoMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => removeSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId);
    if (data.id === context.userId)
      throw new Error("Tidak bisa menghapus akun sendiri");
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });