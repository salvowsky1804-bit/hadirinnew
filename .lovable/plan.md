
## Tujuan

1. Semua proyek/ tamu/ RSVP/ ucapan tersimpan di Supabase (bukan localStorage), sehingga muncul di Admin & lintas perangkat.
2. Foto (mempelai, galeri, cover) & QR tamu → upload ke Storage bucket, bukan URL manual. Hemat egress, aman untuk 10k tamu.
3. RSVP & Wall Ucapan bisa dibuka dari WO dan Admin.
4. Kelola WO stabil (perbaiki error load/tambah).

---

## 1. Database & Storage (migrasi Supabase)

**Tambah kolom & tabel:**
- `guests`: tambah `qr_path text` (path di bucket private).
- `wishes`: sudah ada, pastikan kolom `guest_name`, `message`, `created_at`, `project_id`.
- Views: `admin_project_summary` opsional (agregat guests/rsvps/wishes count) untuk dashboard.

**RLS/policy:**
- `projects`: WO baca miliknya, Admin baca semua. Insert publik `/u/:slug` tidak boleh — RSVP & wish tetap publik via server function (rate-limit-friendly).
- `rsvps`, `wishes`: SELECT untuk owner + admin; INSERT publik lewat server fn (validasi slug + guest).
- Guests: manage owner + admin. Publik hanya boleh membaca `name, qr_path` lewat server fn saat guest membuka undangan.

**Storage buckets:**
- `invitation-media` (private) — foto mempelai, galeri, cover per proyek. Path: `{project_id}/gallery/{uuid}.webp`, `{project_id}/couple/groom.webp`, dst.
- `guest-qr` (private) — QR per tamu. Path: `{project_id}/{guest_id}.png`.
- Serve via signed URL berumur panjang (1 jam) yang di-cache di client + `Cache-Control: public, max-age=31536000, immutable` (versi via hash pada nama file), sehingga egress = 1× per file per user.
- Policy `storage.objects`: WO/Admin bisa CRUD sesuai kepemilikan project; publik tidak langsung akses — hanya via signed URL dari server fn saat guest buka undangan.

## 2. Server Functions baru (`src/lib/`)

- `projects.functions.ts`: `listProjects` (WO=own, Admin=all), `getProject`, `getProjectBySlug` (publik, terbatas kolom), `createProject`, `updateProjectData`, `deleteProject`.
- `guests.functions.ts`: `listGuests`, `addGuest`, `updateGuest`, `removeGuest`, `uploadGuestQr` (menerima base64/File → upload ke bucket + set `qr_path`), `getGuestQrSignedUrl` (publik, terbatas ke slug+kode).
- `media.functions.ts`: `uploadInvitationMedia` (server-side upload untuk field foto: groom, bride, cover, gallery). Client kirim file → server upload dgn service-role → simpan path ke `projects.data`.
- `rsvps.functions.ts`, `wishes.functions.ts`: list (owner/admin), submit (publik lewat slug).

Semua yang non-publik dilindungi `requireSupabaseAuth` + `has_role`.

## 3. Refactor client

- Ganti `src/lib/projects-store.tsx` menjadi thin wrapper berbasis TanStack Query yang memanggil server fn (buang localStorage).
- `wo.index.tsx`: pakai `useSuspenseQuery(listProjects)` — sekarang Admin juga otomatis lihat semuanya karena role-based.
- Baru: `admin.projects.tsx` (daftar semua proyek + link ke editor).
- `wo.projects.$projectId.tsx`: form pakai mutation `updateProjectData`; upload foto pakai komponen baru `<MediaUploader />` yang memanggil `uploadInvitationMedia`.
- `wo.projects.$projectId.rsvp.tsx`: query `listRsvps` + `listWishes`. Buat juga route yang sama di admin (`admin.projects.$projectId.rsvp.tsx` → reuse komponen).
- Tab "Tamu": tambah kolom "QR" dengan tombol upload (file picker) → panggil `uploadGuestQr`. Preview thumbnail.

## 4. Template guest view

- `u.$slug.tsx`: query `getProjectBySlug` + resolve media dengan `getSignedMediaUrls` (batch) supaya egress hemat.
- RSVP & Wish submit → server fn publik.
- Wishes wall baca dari query (bukan store).

## 5. Fix Kelola WO

- `listWoMembers`: batasi listUsers agar hanya user relevan (perPage bisa penyebab jika >1000 tapi kita jaga). Tampilkan pesan error jelas.
- Verifikasi `attachSupabaseAuth` terdaftar (sudah ada di `start.ts`).
- Sesudah refactor, test alur tambah/hapus.

## 6. Performa & 10k concurrent (Supabase Free)

- Signed URL 1 jam + `Cache-Control` immutable pada upload → CDN & browser cache.
- Semua gambar dikompres ke WebP saat upload (Sharp tidak ada di Worker → pakai `@jsquash/webp` atau kompresi client-side pakai `browser-image-compression` sebelum kirim ke server).
- Query select hanya kolom yang perlu; `guests` di-paginate 100/halaman.
- Realtime tidak dinyalakan untuk `rsvps`/`wishes` (polling 30s cukup untuk WO panel), menghindari biaya socket.
- Indeks: sudah ada; tambah `guests(project_id)`, `rsvps(project_id, created_at desc)`, `wishes(project_id, created_at desc)`.

## Konsekuensi

- Data lokal (localStorage) tidak ikut migrasi → mulai dari kosong.
- Editor project di-refactor cukup dalam; UI tetap sama.
- Butuh 1 migration + 2 storage bucket + ~8 file server fn baru + ~6 file client diperbarui.

Lanjut?
