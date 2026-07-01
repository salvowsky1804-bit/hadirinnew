// Storage helpers. Buckets are private; we generate long-lived signed URLs
// on upload and store them alongside the record. Egress-friendly because
// each guest fetches the pre-signed URL directly from Supabase Storage CDN.
import { supabase } from "@/integrations/supabase/client";

const FIVE_YEARS = 60 * 60 * 24 * 365 * 5;

function ext(file: File): string {
  const m = /\.([a-zA-Z0-9]+)$/.exec(file.name);
  return m ? m[1].toLowerCase() : "bin";
}

function randId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

/** Client-side downscale to keep upload light + hemat egress. Returns Blob. */
async function compressImage(file: File, maxDim = 1600, quality = 0.82): Promise<Blob> {
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

export async function uploadInvitationMedia(
  projectId: string,
  file: File,
  kind: "cover" | "person" | "gallery" | "misc" = "misc",
): Promise<{ path: string; url: string }> {
  const blob = await compressImage(file);
  const path = `${projectId}/${kind}/${randId()}.webp`;
  const { error } = await supabase.storage
    .from("invitation-media")
    .upload(path, blob, { contentType: "image/webp", upsert: false });
  if (error) throw new Error(error.message);
  const { data, error: sErr } = await supabase.storage
    .from("invitation-media")
    .createSignedUrl(path, FIVE_YEARS);
  if (sErr || !data) throw new Error(sErr?.message ?? "signed url failed");
  return { path, url: data.signedUrl };
}

export async function uploadGuestQr(
  projectId: string,
  guestId: string,
  file: File,
): Promise<{ path: string; url: string }> {
  const blob = await compressImage(file, 900, 0.9);
  const path = `${projectId}/qr/${guestId}.webp`;
  const { error } = await supabase.storage
    .from("guest-qr")
    .upload(path, blob, { contentType: "image/webp", upsert: true });
  if (error) throw new Error(error.message);
  const { data, error: sErr } = await supabase.storage
    .from("guest-qr")
    .createSignedUrl(path, FIVE_YEARS);
  if (sErr || !data) throw new Error(sErr?.message ?? "signed url failed");
  return { path, url: data.signedUrl };
}

export async function uploadInvitationAudio(
  projectId: string,
  file: File,
): Promise<{ path: string; url: string }> {
  const e = ext(file);
  const path = `${projectId}/audio/${randId()}.${e}`;
  const { error } = await supabase.storage
    .from("invitation-media")
    .upload(path, file, { contentType: file.type || "audio/mpeg", upsert: false });
  if (error) throw new Error(error.message);
  const { data, error: sErr } = await supabase.storage
    .from("invitation-media")
    .createSignedUrl(path, FIVE_YEARS);
  if (sErr || !data) throw new Error(sErr?.message ?? "signed url failed");
  return { path, url: data.signedUrl };
}

export async function getSignedUrl(
  bucket: "invitation-media" | "guest-qr",
  path: string,
  seconds = 3600,
): Promise<string | null> {
  const { data } = await supabase.storage.from(bucket).createSignedUrl(path, seconds);
  return data?.signedUrl ?? null;
}