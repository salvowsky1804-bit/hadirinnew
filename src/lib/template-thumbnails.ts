// Admin-managed template thumbnail overrides.
// Stored in `public.templates.thumbnail_url` (path in the private
// `template-thumbnails` bucket) and served via long-lived signed URLs.
import { supabase } from "@/integrations/supabase/client";

const BUCKET = "template-thumbnails";
const FIVE_YEARS = 60 * 60 * 24 * 365 * 5;

async function compressImage(file: File, maxDim = 1400, quality = 0.85): Promise<Blob> {
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

function randId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export async function fetchTemplateThumbnailMap(): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from("templates")
    .select("slug, thumbnail_url");
  if (error) throw new Error(error.message);
  const paths = (data ?? []).filter((r) => r.thumbnail_url);
  const out: Record<string, string> = {};
  await Promise.all(
    paths.map(async (r) => {
      const { data: s } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(r.thumbnail_url as string, FIVE_YEARS);
      if (s?.signedUrl) out[r.slug] = s.signedUrl;
    }),
  );
  return out;
}

export async function uploadTemplateThumbnail(
  slug: string,
  name: string,
  file: File,
): Promise<string> {
  const blob = await compressImage(file);
  const path = `${slug}/${randId()}.webp`;
  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: "image/webp", upsert: false });
  if (upErr) throw new Error(upErr.message);

  const { error: dbErr } = await supabase
    .from("templates")
    .upsert(
      { slug, name, thumbnail_url: path, active: true },
      { onConflict: "slug" },
    );
  if (dbErr) throw new Error(dbErr.message);

  const { data: s, error: sErr } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, FIVE_YEARS);
  if (sErr || !s) throw new Error(sErr?.message ?? "signed url failed");
  return s.signedUrl;
}

export async function clearTemplateThumbnail(slug: string): Promise<void> {
  const { data, error } = await supabase
    .from("templates")
    .select("thumbnail_url")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(error.message);
  const path = data?.thumbnail_url;
  if (path) {
    await supabase.storage.from(BUCKET).remove([path]);
  }
  const { error: uErr } = await supabase
    .from("templates")
    .update({ thumbnail_url: null })
    .eq("slug", slug);
  if (uErr) throw new Error(uErr.message);
}