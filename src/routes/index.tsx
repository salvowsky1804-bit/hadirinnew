import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import heroImg from "@/assets/landing-hero.jpg";
import craftImg from "@/assets/landing-craft.jpg";
import leafImg from "@/assets/leaf.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Studio Undangan — Undangan Pernikahan Digital" },
      {
        name: "description",
        content:
          "Studio undangan pernikahan digital yang dikerjakan langsung oleh tim kami — elegan, premium, dan dipersonalisasi untuk setiap pasangan.",
      },
      { property: "og:title", content: "Studio Undangan" },
      {
        property: "og:description",
        content: "Undangan pernikahan digital yang anggun dan dipersonalisasi.",
      },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-dvh bg-ivory font-sans text-charcoal antialiased">
      <SiteNav />
      <Hero />
      <Marquee />
      <Philosophy />
      <Process />
      <Showcase />
      <Craft />
      <Testimonial />
      <ClosingCTA />
      <Footer />
    </div>
  );
}

function SiteNav() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-serif text-2xl italic text-ivory drop-shadow-sm">
            Senandika
          </span>
          <span className="text-[10px] uppercase tracking-[0.35em] text-ivory/80">
            Studio
          </span>
        </Link>
        <div className="hidden items-center gap-8 text-xs uppercase tracking-[0.25em] text-ivory/90 md:flex">
          <a href="#filosofi" className="hover:text-ivory">Filosofi</a>
          <a href="#proses" className="hover:text-ivory">Proses</a>
          <a href="#galeri" className="hover:text-ivory">Galeri</a>
          <a href="#kontak" className="hover:text-ivory">Kontak</a>
        </div>
        <Link
          to="/login"
          className="rounded-full border border-ivory/60 px-5 py-2 text-xs uppercase tracking-[0.25em] text-ivory transition hover:bg-ivory hover:text-bordeaux"
        >
          Masuk Studio
        </Link>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative isolate min-h-[100dvh] overflow-hidden">
      <img
        src={heroImg}
        alt="Pengantin berpegangan tangan memegang sekuntum peony putih"
        width={1280}
        height={1600}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/55 via-charcoal/30 to-charcoal/70" />
      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-5xl flex-col items-center justify-center px-6 pt-32 pb-24 text-center text-ivory">
        <p className="animate-fade-in text-[11px] uppercase tracking-[0.5em] text-ivory/80">
          Est. 2024 · Indonesia
        </p>
        <h1
          className="mt-8 max-w-4xl font-serif text-5xl font-light leading-[1.05] md:text-7xl lg:text-[88px]"
          style={{ animation: "fade-in 0.8s ease-out 0.1s both" }}
        >
          Setiap kisah cinta layak <em className="italic text-gilded">dikenang</em> dengan anggun.
        </h1>
        <p
          className="mt-8 max-w-xl text-base leading-relaxed text-ivory/85 md:text-lg"
          style={{ animation: "fade-in 0.8s ease-out 0.25s both" }}
        >
          Studio undangan digital yang dikurasi bersama Anda — dari pertemuan
          pertama, perancangan, hingga undangan tersebar ke tangan tamu istimewa.
        </p>
        <div
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
          style={{ animation: "fade-in 0.8s ease-out 0.4s both" }}
        >
          <a
            href="#kontak"
            className="rounded-full bg-ivory px-8 py-3.5 text-xs uppercase tracking-[0.3em] text-bordeaux transition hover:bg-gilded hover:text-ivory"
          >
            Jadwalkan Konsultasi
          </a>
          <Link
            to="/u/$slug"
            params={{ slug: "rama-sinta" }}
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-ivory"
          >
            <span className="border-b border-ivory/60 pb-1 transition group-hover:border-gilded group-hover:text-gilded">
              Lihat Contoh Undangan
            </span>
            <span aria-hidden className="transition group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-8 z-10 flex justify-center">
        <div className="h-12 w-px animate-pulse bg-ivory/50" aria-hidden />
      </div>
    </section>
  );
}

function Marquee() {
  const items = [
    "Dikerjakan Tangan",
    "Kurasi Pribadi",
    "Template Premium",
    "Pendampingan Penuh",
    "Tanpa Repot Login",
  ];
  return (
    <div className="border-y border-charcoal/10 bg-cream py-5">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 text-[11px] uppercase tracking-[0.35em] text-stone">
        {items.map((label, i) => (
          <span key={label} className="flex items-center gap-10">
            {label}
            {i < items.length - 1 ? <span aria-hidden className="text-gilded">✦</span> : null}
          </span>
        ))}
      </div>
    </div>
  );
}

function Philosophy() {
  return (
    <section id="filosofi" className="relative overflow-hidden bg-ivory py-28 md:py-36">
      <img
        src={leafImg}
        alt=""
        aria-hidden
        width={512}
        height={512}
        loading="lazy"
        className="pointer-events-none absolute -top-10 -left-16 w-72 -rotate-12 opacity-40"
      />
      <img
        src={leafImg}
        alt=""
        aria-hidden
        width={512}
        height={512}
        loading="lazy"
        className="pointer-events-none absolute -bottom-16 -right-20 w-80 rotate-180 opacity-30"
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <p className="text-[11px] uppercase tracking-[0.5em] text-gilded">Filosofi Kami</p>
        <h2 className="mt-6 font-serif text-4xl leading-tight text-charcoal md:text-5xl">
          Bukan sekadar kartu —
          <span className="italic text-bordeaux"> sebuah pembuka kisah.</span>
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-base leading-loose text-stone">
          Kami percaya undangan adalah napas pertama dari sebuah perayaan. Itu
          sebabnya kami duduk bersama Anda, memilih setiap detail, dan
          mengerjakannya seperti merangkai bunga — sehelai demi sehelai, dengan
          tenang dan teliti.
        </p>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    {
      n: "01",
      title: "Pertemuan",
      body: "Bertemu langsung dengan tim kami. Ceritakan visi pernikahan Anda sambil menikmati secangkir kopi.",
    },
    {
      n: "02",
      title: "Pilih Desain",
      body: "Telusuri katalog template eksklusif. Tim kami membantu menemukan yang paling sesuai dengan karakter Anda.",
    },
    {
      n: "03",
      title: "Kami Rangkai",
      body: "Anda tidak perlu mengisi apa pun. Tim kami menyusun semua detail — dari ayat favorit hingga galeri.",
    },
    {
      n: "04",
      title: "Sebarkan",
      body: "Tautan personal untuk setiap tamu, lengkap dengan RSVP, ucapan, dan kenangan yang tersimpan.",
    },
  ];
  return (
    <section id="proses" className="bg-charcoal py-28 text-ivory md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-[11px] uppercase tracking-[0.5em] text-gilded">
              Cara Kerja
            </p>
            <h2 className="mt-6 font-serif text-4xl leading-tight md:text-5xl">
              Empat langkah,
              <br />
              <span className="italic text-gilded">tanpa repot.</span>
            </h2>
            <p className="mt-6 max-w-md text-sm leading-loose text-ivory/70">
              Anda hanya datang, bercerita, dan menyetujui. Sisanya biar kami.
              Tidak ada akun yang perlu dibuat, tidak ada form yang perlu
              diisi.
            </p>
          </div>
          <ol className="md:col-span-7 md:pl-8">
            {steps.map((s) => (
              <li
                key={s.n}
                className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-2 border-t border-ivory/15 py-8 first:border-t-0 first:pt-0"
              >
                <span className="font-serif text-3xl italic text-gilded">
                  {s.n}
                </span>
                <div>
                  <h3 className="font-serif text-2xl">{s.title}</h3>
                  <p className="mt-3 text-sm leading-loose text-ivory/70">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Showcase() {
  const cards = [
    {
      slug: "rama-sinta",
      name: "Aksara",
      tag: "Klasik · Minimal",
      tone: "from-cream to-ivory",
      desc: "Untuk pasangan yang mencintai keheningan dan ruang putih.",
    },
    {
      slug: "arka-naya",
      name: "Senandika",
      tag: "Modern · Sinematik",
      tone: "from-bordeaux/90 to-charcoal",
      desc: "Membawa ayat favorit dan video prewedding sebagai pembuka.",
      dark: true,
    },
  ];
  return (
    <section id="galeri" className="bg-ivory py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.5em] text-gilded">
              Koleksi Template
            </p>
            <h2 className="mt-4 max-w-xl font-serif text-4xl leading-tight md:text-5xl">
              Dua karakter,
              <span className="italic text-bordeaux"> tak terhingga cerita.</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm text-stone">
            Setiap template dirancang sebagai kanvas — siap diberi nyawa oleh
            kisah Anda.
          </p>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {cards.map((c) => (
            <Link
              key={c.slug}
              to="/u/$slug"
              params={{ slug: c.slug }}
              className="group relative overflow-hidden rounded-sm border border-charcoal/10 transition hover:border-gilded/60"
            >
              <div
                className={`aspect-[4/5] bg-gradient-to-br ${c.tone} relative flex items-center justify-center p-12`}
              >
                <div className="text-center">
                  <p
                    className={`text-[10px] uppercase tracking-[0.5em] ${c.dark ? "text-gilded" : "text-stone"}`}
                  >
                    {c.tag}
                  </p>
                  <h3
                    className={`mt-6 font-serif text-6xl italic ${c.dark ? "text-ivory" : "text-bordeaux"}`}
                  >
                    {c.name}
                  </h3>
                  <p
                    className={`mx-auto mt-8 max-w-xs text-sm leading-relaxed ${c.dark ? "text-ivory/75" : "text-stone"}`}
                  >
                    {c.desc}
                  </p>
                </div>
                <div className="absolute inset-x-8 bottom-8 flex items-center justify-between">
                  <span
                    className={`text-[10px] uppercase tracking-[0.3em] ${c.dark ? "text-ivory/70" : "text-stone"}`}
                  >
                    Lihat Contoh
                  </span>
                  <span
                    aria-hidden
                    className={`text-lg transition group-hover:translate-x-1 ${c.dark ? "text-gilded" : "text-bordeaux"}`}
                  >
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Craft() {
  const stats = [
    { v: "120+", l: "Pasangan Dikerjakan" },
    { v: "100%", l: "Dirangkai Tim Kami" },
    { v: "24 jam", l: "Pendampingan" },
  ];
  return (
    <section className="bg-cream py-28 md:py-36">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 md:grid-cols-2 md:gap-20">
        <div className="relative">
          <img
            src={craftImg}
            alt="Undangan pernikahan terbuka dengan segel lilin emas di atas kain linen"
            width={1280}
            height={960}
            loading="lazy"
            className="w-full rounded-sm shadow-2xl shadow-bordeaux/10"
          />
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.5em] text-gilded">
            Karya
          </p>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-charcoal md:text-5xl">
            Setiap undangan, <span className="italic text-bordeaux">sebuah pengabdian.</span>
          </h2>
          <p className="mt-6 leading-loose text-stone">
            Kami memperlakukan undangan Anda seperti surat tulisan tangan —
            disusun perlahan, diperiksa berulang, dan diserahkan dengan
            kehangatan. Tidak ada yang dititipkan ke mesin.
          </p>
          <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-charcoal/15 pt-10">
            {stats.map((s) => (
              <div key={s.l}>
                <dt className="font-serif text-3xl text-bordeaux md:text-4xl">
                  {s.v}
                </dt>
                <dd className="mt-2 text-[10px] uppercase tracking-[0.25em] text-stone">
                  {s.l}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function Testimonial() {
  return (
    <section className="bg-ivory py-28 md:py-36">
      <figure className="mx-auto max-w-3xl px-6 text-center">
        <span className="font-serif text-6xl italic text-gilded" aria-hidden>
          “
        </span>
        <blockquote className="-mt-4 font-serif text-2xl leading-relaxed text-charcoal md:text-3xl">
          Kami hanya bertemu, bercerita, lalu undangannya datang lebih indah
          dari yang kami bayangkan. Tamu kami bahkan bertanya siapa yang
          membuatnya.
        </blockquote>
        <figcaption className="mt-10 text-[11px] uppercase tracking-[0.4em] text-stone">
          Naya &amp; Arka — Pernikahan Mei 2025
        </figcaption>
      </figure>
    </section>
  );
}

function ClosingCTA() {
  return (
    <section
      id="kontak"
      className="relative isolate overflow-hidden bg-bordeaux py-28 text-ivory md:py-36"
    >
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <img
          src={leafImg}
          alt=""
          aria-hidden
          width={512}
          height={512}
          loading="lazy"
          className="absolute -left-10 top-10 w-72 -rotate-45"
        />
        <img
          src={leafImg}
          alt=""
          aria-hidden
          width={512}
          height={512}
          loading="lazy"
          className="absolute -right-10 bottom-10 w-72 rotate-180"
        />
      </div>
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <p className="text-[11px] uppercase tracking-[0.5em] text-gilded">
          Mulai Perjalanan
        </p>
        <h2 className="mt-6 font-serif text-4xl leading-tight md:text-6xl">
          Mari rangkai undangan
          <br />
          <span className="italic text-gilded">yang seindah hari Anda.</span>
        </h2>
        <p className="mx-auto mt-8 max-w-lg text-ivory/80">
          Jadwalkan pertemuan dengan tim kami. Kami sediakan waktu, secangkir
          teh, dan ruang untuk mendengar cerita Anda.
        </p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <a
            href="mailto:halo@senandika.studio"
            className="rounded-full bg-ivory px-8 py-3.5 text-xs uppercase tracking-[0.3em] text-bordeaux transition hover:bg-gilded hover:text-ivory"
          >
            halo@senandika.studio
          </a>
          <a
            href="https://wa.me/6281234567890"
            className="rounded-full border border-ivory/60 px-8 py-3.5 text-xs uppercase tracking-[0.3em] text-ivory transition hover:bg-ivory hover:text-bordeaux"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-charcoal py-14 text-ivory/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-2xl italic text-ivory">Senandika</span>
          <span className="text-[10px] uppercase tracking-[0.35em] text-ivory/60">
            Studio
          </span>
        </div>
        <p className="text-xs uppercase tracking-[0.3em]">
          © {new Date().getFullYear()} — Dirangkai dengan kasih di Indonesia
        </p>
        <Link
          to="/login"
          className="text-xs uppercase tracking-[0.3em] text-ivory/70 transition hover:text-gilded"
        >
          Masuk Studio
        </Link>
      </div>
    </footer>
  );
}
