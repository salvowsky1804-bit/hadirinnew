// Admin-managed offline (printable) invitation templates.
// Files (JPG/PNG/PDF) are stored in the private `offline-templates` bucket
// and served via long-lived signed URLs.
import { supabase } from "@/integrations/supabase/client";

const BUCKET = "offline-templates";
const FIVE_YEARS = 60 * 60 * 24 * 365 * 5;

export type OfflineFileKind = "image" | "pdf";

export type OfflineFile = {
  path: string;
  kind: OfflineFileKind;
  name: string;
  order?: number;
};

export type OfflineTemplate = {
  id: string;
  slug: string;
  name: string;
  category: string | null;
  description: string | null;
  cover_path: string | null;
  files: OfflineFile[];
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type OfflineTemplateWithUrls = OfflineTemplate & {
  cover_url: string | null;
  file_urls: (OfflineFile & { url: string })[];
};

function randId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

async function compressImage(file: File, maxDim = 1800, quality = 0.85): Promise<Blob> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, maxDim / Math.max(bmp.width, bmp.height));
    const w = Math.round(bmp.width * scale);
    const h = Math.round(bmp.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(bmp, 0, 0, w, h);
    return await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b ?? file), "image/webp", quality),
    );
  } catch {
    return file;
  }
}

async function sign(path: string | null | undefined): Promise<string | null> {
  if (!path) return null;
  const { data } = await supabase.storage.from(BUCKET).createSignedUrl(path, FIVE_YEARS);
  return data?.signedUrl ?? null;
}

function detectKind(file: File): OfflineFileKind {
  if (file.type === "application/pdf" || /\.pdf$/i.test(file.name)) return "pdf";
  return "image";
}

export async function listOfflineTemplates(opts: { includeInactive?: boolean } = {}): Promise<OfflineTemplateWithUrls[]> {
  let q = supabase.from("offline_templates").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false });
  if (!opts.includeInactive) q = q.eq("active", true);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  const rows = (data ?? []) as unknown as OfflineTemplate[];
  return Promise.all(
    rows.map(async (r) => {
      const cover_url = await sign(r.cover_path);
      const file_urls = await Promise.all(
        (r.files ?? []).map(async (f) => ({ ...f, url: (await sign(f.path)) ?? "" })),
      );
      return { ...r, cover_url, file_urls };
    }),
  );
}

export async function uploadOfflineFile(slug: string, file: File): Promise<OfflineFile> {
  const kind = detectKind(file);
  const blob = kind === "image" ? await compressImage(file) : file;
  const ext = kind === "pdf" ? "pdf" : "webp";
  const contentType = kind === "pdf" ? "application/pdf" : "image/webp";
  const path = `${slug}/${randId()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, { contentType, upsert: false });
  if (error) throw new Error(error.message);
  return { path, kind, name: file.name };
}

export async function createOfflineTemplate(input: {
  slug: string;
  name: string;
  category?: string;
  description?: string;
}): Promise<OfflineTemplate> {
  const { data, error } = await supabase
    .from("offline_templates")
    .insert({
      slug: input.slug,
      name: input.name,
      category: input.category ?? null,
      description: input.description ?? null,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as unknown as OfflineTemplate;
}

export async function updateOfflineTemplate(id: string, patch: Partial<Omit<OfflineTemplate, "id" | "created_at" | "updated_at">>): Promise<void> {
  const { error } = await supabase.from("offline_templates").update(patch as never).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteOfflineTemplate(id: string): Promise<void> {
  const { data } = await supabase.from("offline_templates").select("cover_path, files").eq("id", id).maybeSingle();
  const paths: string[] = [];
  if (data?.cover_path) paths.push(data.cover_path as string);
  const files = ((data?.files ?? []) as OfflineFile[]) ?? [];
  files.forEach((f) => paths.push(f.path));
  if (paths.length) await supabase.storage.from(BUCKET).remove(paths);
  const { error } = await supabase.from("offline_templates").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function removeStorageObjects(paths: string[]): Promise<void> {
  if (paths.length === 0) return;
  await supabase.storage.from(BUCKET).remove(paths);
}

export function signPath(path: string): Promise<string | null> {
  return sign(path);
}