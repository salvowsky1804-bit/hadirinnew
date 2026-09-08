# Eternal Union Studio

Apa yang sedang kita bangun

Aku ingin membangun sebuah platform undangan pernikahan online — sebuah produk komersial, mirip envelope.id dan satumoment.com, tetapi dipakai sebagai alat kerja internal tim kami, bukan layanan self-service untuk klien.

Cara kerjanya: calon pengantin (klien) bertemu langsung dengan tim kami, memilih desain template undangan, lalu tim kami yang mengisikan datanya sesuai keinginan klien. Jadi klien tidak pernah login dan tidak mengisi apa pun sendiri. Yang dilihat publik hanyalah undangan yang sudah jadi — diakses para tamu lewat sebuah link unik untuk melihat undangan, mengkonfirmasi kehadiran (RSVP), dan menulis ucapan.

Sangat penting untuk fase ini: untuk sekarang aku hanya ingin membangun seluruh tampilan (UI), semua halaman, dan semua alurnya — menggunakan data contoh (dummy) saja. Jangan sambungkan database, jangan pakai Supabase, dan jangan buat sistem login sungguhan dulu. Gunakan data yang ditulis langsung di kode dan simpan perubahan sementara di state lokal saja. Yang paling penting: susun kodenya rapi dan terpisah, supaya nanti backend bisa dipasang di belakangnya tanpa membongkar ulang tampilan.

Teknologi: React + TypeScript + Tailwind CSS (gunakan TypeScript di semua file), React Router untuk navigasi, dan Framer Motion untuk animasi. Buat semuanya mobile-first dan responsif.

Aku ingin hasil akhirnya mengesankan — terasa premium, halus, dan elegan, baik di sisi alat internal maupun (terutama) di undangan yang dilihat tamu.

Dua peran pengguna (plus tamu)

Admin — pemilik platform. Mengelola katalog template, mengelola akun anggota tim WO, dan pengaturan global.

WO (Wedding Organizer) — anggota tim kami. Membuat "proyek undangan" untuk tiap klien: memilih template yang dipilih klien, mengisi datanya, mengelola daftar tamu, menerbitkan, dan membagikan link.

Tamu — tidak login sama sekali. Mengakses undangan lewat link unik untuk melihat, RSVP, dan kirim ucapan.

Karena belum ada autentikasi sungguhan, untuk sekarang palsukan login-nya: buat satu halaman login yang tampilannya jadi, dengan dua tombol/jalur uji untuk masuk sebagai Admin atau sebagai WO (langsung mengarah ke dashboard masing-masing tanpa verifikasi). Sediakan juga cara mudah berpindah peran saat pengujian.

Konsep inti yang harus dipahami sejak awal

Ada tiga ide yang menjadi fondasi seluruh aplikasi ini. Mohon ikuti dengan disiplin, karena ini yang membuat sistem bisa tumbuh tanpa berantakan:

1. Template itu sebuah "folder" mandiri. Tiap desain undangan adalah satu folder berisi komponen tampilannya sendiri. Menambah desain baru = menambah satu folder template baru. Buat aplikasinya mendeteksi folder template yang tersedia secara otomatis (gunakan import.meta.glob milik Vite untuk menemukan semua folder template saat build), sehingga template yang baru ditambahkan langsung muncul di katalog tanpa perlu mendaftarkannya manual satu per satu.

2. Tiap template punya "manifest" yang mendeklarasikan kebutuhannya. Di dalam tiap folder template ada sebuah file manifest yang berisi: informasi katalog (nama, slug, gambar thumbnail, kategori online/offline) dan daftar field data yang dibutuhkan template itu — tiap field punya id, label, jenis input (teks, tanggal, gambar, daftar, tautan, dll), dan keterangan wajib/opsional.

3. Form pengisian data milik WO dibangun secara dinamis dari manifest. Saat WO memilih sebuah template untuk sebuah proyek, form pengisian datanya dibangkitkan otomatis dari daftar field di manifest template tersebut. Artinya, kalau suatu template baru membawa variabel baru (misalnya "ayat favorit", "tautan video prewedding", atau "denah kursi"), form WO otomatis memunculkan input untuk field itu — tanpa perlu mengoding form baru. Buatlah sebuah "form renderer" yang memetakan tiap jenis field ke komponen input yang sesuai.

Soal bentuk data: ada inti bersama yang dimiliki semua undangan (data mempelai, daftar acara, galeri, hadiah, pengaturan, dan sebuah event_id), ditambah field custom per-template yang dideklarasikan manifest. Untuk fase ini, modelkan keduanya dalam satu tipe TypeScript: bagian inti yang tetap, plus sebuah bagian custom yang fleksibel (berisi pasangan id-field dan nilainya). Template membaca dari objek ini untuk menampilkan dirinya.

Halaman & menu (lengkap)

A. Halaman publik

Landing page — halaman depan yang menjual dan berkesan mewah. Berisi: bagian hero yang elegan (judul besar bertema pernikahan, kalimat pembuka yang lembut, tombol ajakan); galeri contoh template yang bisa di-scroll dengan animasi halus; bagian "cara kerja" singkat (klien pilih desain → tim kami menggarap → undangan siap dibagikan); bagian testimoni; dan footer. Gunakan palet warna wedding (lihat bagian Desain). Banyak ruang kosong, tipografi anggun, animasi yang lembut saat di-scroll. Inilah etalase yang membuat orang terkesan.

Halaman Login — satu form yang tampilannya elegan, dengan dua pintu masuk uji (Admin / WO) yang mengarahkan ke dashboard masing-masing.

B. Area Admin (/admin)

Layout dengan sidebar kiri dan area konten di kanan. Menu:

Dashboard — ringkasan kartu angka: jumlah proyek undangan, jumlah undangan aktif, jumlah template di katalog, jumlah anggota WO. (Semua dummy.) Plus daftar aktivitas terbaru.

Katalog Template — tampilkan template yang terdeteksi dari folder dalam bentuk grid kartu. Tiap kartu: thumbnail, nama, kategori (online/offline), status (aktif/non-aktif) dengan tombol pengaktif, dan tombol "Lihat Demo". Karena template terdeteksi otomatis, halaman ini juga menampilkan bagian "Template baru terdeteksi" ketika ada folder template baru yang belum diaktifkan — admin tinggal mengaktifkannya. (Untuk sekarang, demokan dengan beberapa template dummy + satu yang berstatus "baru terdeteksi".)

Kelola Akun WO — daftar anggota tim WO (nama, email, status aktif). Bisa tambah, ubah, nonaktifkan. (Data dummy.)

Pengaturan — pengaturan global sederhana (identitas brand, dll).

C. Area WO (/wo)

Layout dengan navigasi dan area konten. Menu:

Daftar Proyek Undangan — daftar semua proyek undangan klien dalam bentuk kartu atau tabel: nama pasangan, tanggal acara, template yang dipakai, status (draft / terbit), dan tanggal dibuat. Ada tombol "Buat Proyek Baru". Tiap proyek bisa dibuka untuk diedit.

Buat / Edit Proyek Undangan — ini inti pekerjaan WO. Alurnya dalam beberapa langkah yang jelas:

Langkah 1 — Pilih Template. Galeri template aktif yang bisa di-preview. WO memilih satu. (Catatan internal opsional: nama paket/harga sebagai penanda internal saja — bukan etalase jualan.)

Langkah 2 — Isi Data. Form yang dibangkitkan dinamis dari manifest template terpilih. Selalu ada bagian inti: Data Mempelai (pria & wanita: nama lengkap, nama panggilan, nama orang tua, foto, akun sosial), Acara (bisa lebih dari satu: nama acara, tanggal, jam mulai & selesai, nama tempat, alamat, link Maps), Love Story (daftar momen bertanggal), Galeri Foto (unggah beberapa foto — untuk sekarang cukup preview lokal), Hadiah (rekening & e-wallet), dan Pengaturan (musik latar, kata sambutan, penutup). Lalu di bawahnya, field custom milik template itu muncul otomatis sesuai manifest.

Langkah 3 — Kelola Tamu. Tabel daftar tamu (nama, grup, jumlah pax), bisa tambah satu per satu atau tambah banyak sekaligus. Tiap tamu punya link personal unik yang bisa disalin (untuk sekarang link dummy, misalnya /u/aksara-rama-sinta?tamu=nama), supaya undangan bisa menyapa nama tamu.

Langkah 4 — Preview & Terbitkan. Tampilkan undangan jadi (template + data yang diisi) persis seperti yang dilihat tamu, lalu tombol "Terbitkan" dan "Salin Link".

RSVP & Ucapan — per proyek: daftar siapa yang sudah konfirmasi hadir/tidak beserta jumlahnya, dan daftar ucapan yang masuk. (Data dummy.)

D. Tampilan Tamu — Undangan itu sendiri (/u/:slug)

Halaman yang dilihat tamu: tanpa login, tanpa menu dashboard, hanya undangannya. Untuk fase ini, buat dua template contoh agar terlihat bahwa form dinamis benar-benar menyesuaikan field yang berbeda:

Template "Aksara" — gaya klasik elegan. Memakai field inti saja.

Template "Senandika" — gaya yang sedikit berbeda, dan manifest-nya membawa dua field custom tambahan: "ayat/kutipan favorit" dan "tautan video prewedding". Tunjukkan bahwa ketika template ini dipilih, form WO otomatis memunculkan kedua input itu, dan template menampilkannya.

Tiap template tersusun ke bawah saat di-scroll, dengan bagian: Cover/Gerbang Pembuka (nama mempelai + tombol "Buka Undangan"; saat ditekan, gerbang terbuka dengan animasi halus dan musik mulai), Hero (nama + tanggal + hitung mundur), Mempelai, Love Story (timeline), Acara (dengan tombol "Lihat Lokasi" ke Maps), Galeri, Hadiah (tombol salin rekening), RSVP (form kehadiran + jumlah, simpan ke state lokal dulu), Buku Tamu/Ucapan (form + daftar ucapan), dan Penutup. Sertakan tombol musik (putar/jeda) yang mengambang dan animasi muncul saat di-scroll di tiap bagian.

Alur penggunaan (flow)

Alur Admin: masuk lewat login → Dashboard → membuka Katalog Template, mengaktifkan template yang baru terdeteksi → mengelola akun WO → mengatur brand.

Alur WO: masuk lewat login → Daftar Proyek → "Buat Proyek Baru" → pilih template → mengisi data klien lewat form dinamis → kelola tamu dan menyalin link personal → preview → terbitkan → membagikan link. Sewaktu-waktu kembali untuk memantau RSVP & ucapan tiap proyek.

Alur Tamu: membuka link → melihat Cover → menekan "Buka Undangan" (gerbang terbuka, musik mulai) → menggulir menikmati seluruh bagian → mengisi RSVP → menulis ucapan.

Persiapan untuk fitur mendatang (belum dibuat sekarang): tiap proyek undangan punya field event_id sebagai penghubung ke aplikasi scan QR untuk absensi tamu di hari acara. Sediakan field-nya saja sebagai persiapan, tanpa membangun fitur QR-nya.

Performa — wajib cepat, tanpa mengorbankan gambar & animasi

Aku ingin undangan tetap kaya gambar dan animasi, tetapi tidak boleh lag sama sekali, terutama di ponsel. Terapkan teknik berikut:

Gambar: gunakan format modern (WebP), sediakan beberapa ukuran responsif (srcset) sehingga ponsel tidak menarik gambar resolusi besar, dan lazy-load semua gambar yang berada di bawah layar (jangan dimuat sampai hampir terlihat). Selalu tetapkan dimensi/aspect-ratio gambar agar tata letak tidak "melompat" saat gambar dimuat (cegah layout shift). Beri efek placeholder (blur-up) saat gambar sedang dimuat.

Animasi: animasikan hanya properti transform dan opacity (ringan untuk GPU); hindari menganimasikan properti yang memicu re-layout seperti width/height/top/left. Picu animasi scroll dengan IntersectionObserver (muncul saat elemen masuk layar, dan cukup sekali), bukan dengan event listener scroll yang berat. Jaga durasi animasi wajar dan gunakan will-change seperlunya saja.

Pemuatan kode: muat tiap template secara lazy (code-splitting per rute/template) sehingga tamu hanya mengunduh kode satu template yang dibuka, bukan semua template. Muat musik dan komponen berat lainnya secara malas/ditunda.

Daftar panjang: untuk daftar tamu dan daftar ucapan yang bisa banyak, gunakan paginasi atau virtualisasi agar tidak merender ratusan baris sekaligus.

Font: preload font utama, gunakan font-display: swap, dan pakai subset huruf bila memungkinkan.

Aksesibilitas — wajib patuh WCAG (target level AA)

Seluruh aplikasi harus dapat digunakan semua orang dan memenuhi WCAG 2.1 level AA:

Kontras warna: teks terhadap latarnya minimal rasio 4.5:1 (teks normal) dan 3:1 (teks besar). Ini penting khusus untuk tema wedding — warna dekoratif yang lembut (misalnya emas di atas krem) tidak boleh dipakai untuk teks yang harus dibaca; pakai warna gelap yang kontras untuk teks. Periksa setiap kombinasi.

Teks alternatif: semua gambar punya alt yang bermakna (foto dekoratif murni boleh alt kosong).

Keyboard: semua elemen interaktif bisa diakses dan dioperasikan lewat keyboard, dengan indikator fokus yang terlihat jelas dan urutan tab yang logis.

HTML semantik: gunakan struktur heading yang benar dan berurutan, landmark (header, nav, main, footer), dan elemen yang tepat (tombol adalah button, bukan div).

Form: tiap input punya label yang terhubung, pesan kesalahan yang jelas, dan atribut ARIA bila perlu.

Tombol ikon (seperti tombol musik) wajib punya aria-label.

Jangan sampaikan informasi hanya lewat warna (misalnya status hadir/tidak harus ada teks/ikon, bukan warna saja).

Gerak: hormati prefers-reduced-motion — kurangi atau matikan animasi untuk pengguna yang memilih setelan itu.

Target sentuh minimal kira-kira 44×44 piksel.

Desain & warna

Pemisahan tampilan:

Landing page memakai palet wedding yang elegan (di bawah).

Dashboard Admin & WO dibuat bersih, profesional, dan elegan, tetapi lebih netral dan fungsional — ini alat kerja yang dipakai berjam-jam, jadi utamakan kejelasan; cukup beri sentuhan brand yang halus.

Template undangan punya estetikanya masing-masing (Aksara dan Senandika boleh berbeda nuansa).

Palet warna wedding untuk landing page (silakan pakai ini sebagai dasar, dan tetap pastikan kontras teks memenuhi WCAG):

Latar utama — krem gading lembut: #F7F3EC

Teks utama — cokelat espreso pekat (kontras tinggi di atas krem): #2B2622

Teks sekunder — taupe hangat: #6E655C (pastikan ≥ 4.5:1 di atas krem)

Aksen dekoratif — emas sampanye: #C2A56B (hanya untuk ornamen, garis, dan judul besar — jangan untuk teks kecil)

Aksen lembut sekunder — sage/hijau pucat: #9CA891

Warna tombol/CTA utama — anggur tua: #6E2A36 (dengan teks putih di atasnya agar kontras aman)

Kesan yang ingin dicapai: anggun, tenang, sedikit editorial/mewah. Tipografi judul memakai serif yang elegan, teks isi memakai huruf yang nyaman dibaca. Gunakan ruang kosong dengan berani, transisi yang halus, dan micro-interaction kecil (hover, tombol) yang terasa "mahal".

Aturan penting (mohon dipatuhi)

Belum ada backend. Jangan pasang Supabase/database/login sungguhan. Semua data berupa dummy yang ditulis di kode, perubahan disimpan di state lokal.

Pisahkan data dari tampilan. Definisikan satu tipe TypeScript untuk data undangan (bagian inti tetap + bagian custom yang fleksibel) dan satu tipe untuk manifest template (informasi katalog + daftar field). Sediakan data undangan contoh yang mengikuti tipe ini.

Template murni tampilan. Komponen template menerima data lewat props dan hanya menampilkannya; template tidak mengambil data sendiri dari mana pun.

Form dinamis dari manifest. Form pengisian data WO dibangkitkan dari daftar field manifest template terpilih, lewat sebuah "form renderer" yang memetakan jenis field ke komponen input.

Deteksi template otomatis dari folder (gunakan import.meta.glob), jangan pendaftaran manual.

Struktur folder rapi, kira-kira: pages (per rute), components (umum, dipakai ulang), templates/aksara dan templates/senandika (tiap template = folder berisi manifest + komponen per-bagian), types (tipe data & manifest), data (data dummy), dan lib (utilitas, termasuk form renderer).

Gunakan TypeScript di semua file.

Patuhi performa & aksesibilitas seperti dua bagian di atas.

Mobile-first dan responsif di seluruh halaman.

Urutan membangun (supaya tidak kewalahan)

Tolong bangun bertahap dan tunjukkan hasil tiap tahap:

Siapkan struktur rute & kerangka layout untuk ketiga area (publik, admin, WO), login palsu, dan cara berpindah peran. Siapkan juga tipe data inti, tipe manifest, dan data dummy.

Bangun landing page yang berkesan dengan palet wedding (sekaligus tetapkan dasar desain, performa, dan aksesibilitas).

Bangun area WO dengan data dummy: daftar proyek, alur buat/edit proyek (pilih template → form dinamis dari manifest → kelola tamu → preview), dan halaman RSVP & ucapan.

Bangun dua template contoh (Aksara & Senandika) untuk tampilan tamu — lengkap dengan animasi scroll, gerbang pembuka, musik, performa optimal, dan aksesibilitas. Pastikan Senandika memunculkan field custom-nya.

Bangun area Admin: dashboard, katalog template (dengan "template baru terdeteksi"), kelola akun WO, dan pengaturan.

Mulai dari langkah 1.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://hadirinnew.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/daee7857-04ce-4a9e-8471-b7a22eafe343).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
