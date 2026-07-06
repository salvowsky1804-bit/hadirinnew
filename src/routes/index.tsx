import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { ReactNode, ElementType, Ref } from "react";
import {
  ArrowRight,
  ArrowDown,
  Check,
  Calendar,
  MapPin,
  Heart,
  Image as ImageIcon,
  Sparkles,
  Quote,
} from "lucide-react";
import heroImg from "@/assets/landing-hero.jpg";
import craftImg from "@/assets/landing-craft.jpg";
import leafImg from "@/assets/leaf.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Senandika Studio — Undangan Pernikahan Digital" },
      {
        name: "description",
        content:
          "Studio undangan pernikahan digital yang dirangkai langsung oleh tim kami — elegan, hidup, dan dipersonalisasi untuk setiap pasangan.",
      },
      { property: "og:title", content: "Senandika Studio" },
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

/* ------------------------------------------------------------------ */
/* Motion helpers — IntersectionObserver + scroll, reduced-motion safe */
/* ------------------------------------------------------------------ */

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "header" | "footer" | "article";
};

function Reveal({ children, delay = 0, y = 26, className = "", as = "div" }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const Comp = as as ElementType;
  return (
    <Comp
      ref={ref as Ref<HTMLElement>}
      style={{
        transition: "opacity 800ms ease-out, transform 800ms ease-out",
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : `translateY(${y}px)`,
      }}
      className={className}
    >
      {children}
    </Comp>
  );
}

function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > threshold);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [threshold]);
  return scrolled;
}

function useParallax(strength = 26) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
        setOffset(Math.max(-1, Math.min(1, progress)) * -strength);
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, [strength]);
  return { ref, offset };
}

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

function Wave({ fill, className = "" }: { fill: string; className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none ${className}`}>
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="block h-[56px] w-full md:h-[88px]">
        <path d="M0,52 C320,4 760,96 1080,52 C1248,28 1360,40 1440,36 L1440,90 L0,90 Z" fill={fill} />
      </svg>
    </div>
  );
}

type ChipTone = "ivory" | "cream" | "sage" | "bordeaux" | "gilded";

function Chip({
  icon,
  label,
  sub,
  tone = "ivory",
  className = "",
  float = "lp-float",
}: {
  icon: ReactNode;
  label: string;
  sub?: string;
  tone?: ChipTone;
  className?: string;
  float?: string;
}) {
  const tones: Record<ChipTone, string> = {
    ivory: "bg-white/95 text-charcoal ring-charcoal/10",
    cream: "bg-cream text-charcoal ring-charcoal/10",
    sage: "bg-sage text-white ring-white/25",
    bordeaux: "bg-bordeaux text-ivory ring-white/15",
    gilded: "bg-gilded text-charcoal ring-white/30",
  };
  return (
    <div className={`${className} ${float}`}>
      <div
        className={`flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 shadow-xl shadow-charcoal/15 ring-1 backdrop-blur-sm ${tones[tone]}`}
      >
        <span className="shrink-0">{icon}</span>
        <span className="leading-tight">
          <span className="block text-[11px] font-semibold tracking-wide">{label}</span>
          {sub ? <span className="block text-[10px] font-normal opacity-75">{sub}</span> : null}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function Index() {
  // Smooth in-page anchor scrolling (disabled under reduced motion).
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = document.documentElement;
    const prev = el.style.scrollBehavior;
    el.style.scrollBehavior = reduced ? "auto" : "smooth";
    return () => {
      el.style.scrollBehavior = prev;
    };
  }, []);

  return (
    <div className="min-h-dvh bg-ivory font-sans text-charcoal antialiased">
      <SiteNav />
      <Hero />
      <TrustMarquee />
      <Philosophy />
      <Process />
      <LivePreview />
      <Showcase />
      <Craft />
      <Testimonial />
      <ClosingCTA />
      <Footer />
    </div>
  );
}

function SiteNav() {
  const scrolled = useScrolled(24);
  const links: [string, string][] = [
    ["Filosofi", "#filosofi"],
    ["Proses", "#proses"],
    ["Galeri", "#galeri"],
    ["Kontak", "#kontak"],
  ];
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-ivory/85 shadow-[0_1px_0_rgba(43,38,34,0.07)] backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-serif text-2xl italic text-bordeaux">Senandika</span>
          <span className="text-[10px] uppercase tracking-[0.35em] text-stone">Studio</span>
        </Link>
        <div className="hidden items-center gap-9 text-xs uppercase tracking-[0.22em] text-stone md:flex">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="transition-colors hover:text-bordeaux">
              {label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden rounded-full border border-bordeaux/30 px-5 py-2 text-xs uppercase tracking-[0.22em] text-bordeaux transition hover:bg-bordeaux hover:text-ivory sm:inline-block"
          >
            Masuk Studio
          </Link>
          <a
            href="#kontak"
            className="rounded-full bg-bordeaux px-5 py-2 text-xs uppercase tracking-[0.22em] text-ivory shadow-sm transition hover:bg-charcoal"
          >
            Konsultasi
          </a>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ivory pt-28 md:pt-32">
      {/* ambient tints + ornament */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="lp-breathe absolute -top-24 right-[-10%] h-[460px] w-[460px] rounded-full bg-gilded/15 blur-3xl" />
        <div className="absolute bottom-10 left-[-12%] h-[380px] w-[380px] rounded-full bg-sage/15 blur-3xl" />
        <img
          src={leafImg}
          alt=""
          width={420}
          height={420}
          className="absolute -left-16 top-28 w-64 -rotate-12 opacity-20"
        />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2 md:gap-8 md:px-10">
        {/* LEFT — copy */}
        <div className="relative z-10 text-center md:text-left">
          <p
            className="lp-rise inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.4em] text-stone"
            style={{ animationDelay: "0ms" }}
          >
            <Sparkles className="h-3.5 w-3.5 text-gilded" /> Studio Undangan Digital · Est. 2024
          </p>
          <h1
            className="lp-rise mt-6 font-serif text-[2.75rem] font-light leading-[1.03] text-charcoal md:text-6xl lg:text-[4.4rem]"
            style={{ animationDelay: "90ms" }}
          >
            Undangan digital
            <br className="hidden md:block" /> yang seindah <em className="italic text-bordeaux">hari bahagia</em> Anda.
          </h1>
          <p
            className="lp-rise mx-auto mt-6 max-w-md text-base leading-relaxed text-stone md:mx-0 md:text-lg"
            style={{ animationDelay: "180ms" }}
          >
            Tim kami merangkai setiap detail — sampul, ayat favorit, galeri, hingga RSVP — menjadi undangan hidup yang
            siap Anda bagikan. Anda cukup datang dan bercerita.
          </p>
          <div
            className="lp-rise mt-9 flex flex-wrap items-center justify-center gap-3.5 md:justify-start"
            style={{ animationDelay: "270ms" }}
          >
            <a
              href="#kontak"
              className="group inline-flex items-center gap-2 rounded-full bg-bordeaux px-7 py-3.5 text-xs uppercase tracking-[0.25em] text-ivory shadow-lg shadow-bordeaux/20 transition hover:bg-charcoal"
            >
              Jadwalkan Konsultasi
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </a>
            <Link
              to="/u/$slug"
              params={{ slug: "rama-sinta" }}
              className="group inline-flex items-center gap-2 rounded-full border border-charcoal/20 px-7 py-3.5 text-xs uppercase tracking-[0.25em] text-charcoal transition hover:border-bordeaux hover:text-bordeaux"
            >
              Lihat Contoh
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div
            className="lp-rise mt-8 flex items-center justify-center gap-3 md:justify-start"
            style={{ animationDelay: "360ms" }}
          >
            <div className="flex -space-x-2">
              {["#9CA891", "#C2A56B", "#6E2A36"].map((c) => (
                <span key={c} className="h-7 w-7 rounded-full ring-2 ring-ivory" style={{ background: c }} />
              ))}
            </div>
            <p className="text-xs text-stone">
              <span className="font-semibold text-charcoal">120+ pasangan</span> telah dirangkai bersama kami
            </p>
          </div>
        </div>

        {/* RIGHT — arched photo + drifting chips */}
        <div className="relative z-10 mx-auto w-full max-w-md">
          <div className="lp-rise relative" style={{ animationDelay: "200ms" }}>
            <div className="relative mx-auto aspect-[3/4] w-[78%] overflow-hidden rounded-t-[999px] rounded-b-[2rem] shadow-2xl shadow-bordeaux/20 ring-1 ring-charcoal/10">
              <img
                src={heroImg}
                alt="Pasangan pengantin berpegangan tangan memegang setangkai peony putih"
                width={900}
                height={1200}
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 rounded-t-[999px] rounded-b-[2rem] ring-1 ring-inset ring-gilded/30" />
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-3 -z-10 aspect-[3/4] w-[78%] -translate-x-1/2 rounded-t-[999px] rounded-b-[2rem] border border-gilded/40"
            />

            <Chip
              className="absolute -left-3 top-10 md:-left-9"
              float="lp-float"
              tone="sage"
              icon={<Check className="h-4 w-4" strokeWidth={2.5} />}
              label="RSVP · Hadir"
              sub="Konfirmasi diterima"
            />
            <Chip
              className="absolute -right-3 top-1/3 md:-right-10"
              float="lp-float-rev"
              tone="bordeaux"
              icon={<Calendar className="h-4 w-4" />}
              label="12 Hari Lagi"
              sub="14 · 12 · 2026"
            />
            <Chip
              className="absolute -left-2 bottom-20 md:-left-12"
              float="lp-float-slow"
              tone="ivory"
              icon={
                <span className="lp-eq text-bordeaux">
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
              }
              label="Sedang Diputar"
              sub="Lagu pilihan"
            />
            <Chip
              className="absolute -right-2 bottom-8 md:-right-8"
              float="lp-float"
              tone="gilded"
              icon={<Heart className="h-4 w-4" fill="currentColor" />}
              label="Rama & Sinta"
              sub="Save the date"
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-12 flex justify-center pb-2">
        <span className="lp-scrollhint text-stone/70">
          <ArrowDown className="h-5 w-5" />
        </span>
      </div>

      <Wave fill="var(--cream)" className="mt-2" />
    </section>
  );
}

function TrustMarquee() {
  const items = [
    "Dirangkai oleh Tim Kami",
    "Tanpa Repot Login",
    "Template Premium",
    "RSVP & Buku Tamu",
    "Galeri Prewedding",
    "Pendampingan Penuh",
    "Musik Latar",
  ];
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-charcoal/10 bg-cream py-5">
      <div className="lp-marquee flex w-max items-center whitespace-nowrap">
        {row.map((label, i) => (
          <span key={i} className="flex items-center text-[11px] uppercase tracking-[0.35em] text-stone">
            <span className="px-7">{label}</span>
            <span aria-hidden className="text-gilded">
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Philosophy() {
  return (
    <section id="filosofi" className="relative scroll-mt-28 overflow-hidden bg-ivory pt-24 md:pt-32">
      <img
        src={leafImg}
        alt=""
        width={420}
        height={420}
        loading="lazy"
        className="pointer-events-none absolute -bottom-10 -right-16 w-72 rotate-180 opacity-20"
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.45em] text-gilded">Filosofi Kami</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-6 font-serif text-4xl leading-tight text-charcoal md:text-5xl">
            Bukan sekadar kartu — <span className="italic text-bordeaux">sebuah pembuka kisah.</span>
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="mx-auto mt-7 max-w-xl text-base leading-loose text-stone">
            Kami percaya undangan adalah napas pertama dari sebuah perayaan. Itu sebabnya kami duduk bersama Anda,
            memilih setiap detail, dan mengerjakannya seperti merangkai bunga — sehelai demi sehelai, dengan tenang dan
            teliti.
          </p>
        </Reveal>
      </div>
      <div className="h-20 md:h-28" />
      <Wave fill="var(--charcoal)" />
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
    <section id="proses" className="relative scroll-mt-28 bg-charcoal pt-20 text-ivory md:pt-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <p className="text-[11px] uppercase tracking-[0.45em] text-gilded">Cara Kerja</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-6 font-serif text-4xl leading-tight md:text-5xl">
                Empat langkah,
                <br />
                <span className="italic text-gilded">tanpa repot.</span>
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-md text-sm leading-loose text-ivory/70">
                Anda hanya datang, bercerita, dan menyetujui. Sisanya biar kami. Tidak ada akun yang perlu dibuat, tidak
                ada formulir yang perlu diisi.
              </p>
            </Reveal>
          </div>
          <ol className="md:col-span-7 md:pl-8">
            {steps.map((s, i) => (
              <Reveal
                as="li"
                key={s.n}
                delay={i * 90}
                className="grid grid-cols-[auto_1fr] gap-x-7 gap-y-2 border-t border-ivory/15 py-7 first:border-t-0 first:pt-0"
              >
                <span className="font-serif text-3xl italic text-gilded">{s.n}</span>
                <div>
                  <h3 className="font-serif text-2xl">{s.title}</h3>
                  <p className="mt-2.5 text-sm leading-loose text-ivory/70">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
      <div className="h-20 md:h-28" />
      <Wave fill="var(--ivory)" />
    </section>
  );
}

function LivePreview() {
  const { ref, offset } = useParallax(26);
  const features = [
    {
      icon: <Calendar className="h-5 w-5" />,
      title: "Hitung mundur",
      body: "Detik menuju hari-H, hidup dan berdenyut di layar tamu.",
    },
    {
      icon: <Check className="h-5 w-5" strokeWidth={2.5} />,
      title: "RSVP pintar",
      body: "Konfirmasi kehadiran langsung tercatat, tanpa repot pesan balasan.",
    },
    {
      icon: <ImageIcon className="h-5 w-5" />,
      title: "Galeri & cerita",
      body: "Momen prewedding dan kisah Anda dirangkai jadi alur yang indah.",
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Lokasi & rute",
      body: "Peta dan tombol arah agar tamu tak pernah tersesat.",
    },
  ];
  return (
    <section className="relative overflow-hidden bg-ivory py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 md:grid-cols-2 md:gap-20">
        <div>
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.45em] text-gilded">Undangan yang Hidup</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-charcoal md:text-5xl">
              Bukan kartu statis — <span className="italic text-bordeaux">pengalaman yang bergerak.</span>
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-md leading-loose text-stone">
              Setiap undangan kami hidup di tangan tamu: animasi pembuka yang lembut, musik latar, hitung mundur menuju
              hari-H, dan RSVP yang langsung tercatat.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {features.map((f, i) => (
              <Reveal as="div" key={f.title} delay={200 + i * 80} className="flex gap-3.5">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-bordeaux/10 text-bordeaux">
                  {f.icon}
                </span>
                <div>
                  <h3 className="font-serif text-lg text-charcoal">{f.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-stone">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* phone mockup */}
        <Reveal className="relative mx-auto">
          <div ref={ref} style={{ transform: `translateY(${offset}px)` }} className="relative will-change-transform">
            <div
              aria-hidden
              className="lp-breathe absolute left-1/2 top-1/2 -z-10 h-[115%] w-[115%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gilded/15 blur-3xl"
            />
            <div className="relative mx-auto w-[270px] rounded-[2.6rem] border-[10px] border-charcoal bg-charcoal shadow-2xl shadow-charcoal/30">
              <div className="absolute left-1/2 top-2 z-10 h-1.5 w-16 -translate-x-1/2 rounded-full bg-ivory/30" />
              <div className="overflow-hidden rounded-[1.9rem] bg-ivory">
                <div className="relative h-72 bg-gradient-to-b from-bordeaux to-charcoal px-6 pt-12 text-center text-ivory">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-gilded">The Wedding Of</p>
                  <p className="mt-5 font-serif text-5xl italic leading-tight">
                    Rama
                    <span className="my-1 block text-2xl not-italic text-gilded">&amp;</span>
                    Sinta
                  </p>
                  <div className="mx-auto mt-4 h-px w-16 bg-gilded/60" />
                  <p className="mt-4 text-[11px] uppercase tracking-[0.3em] text-ivory/80">14 · 12 · 2026</p>
                </div>
                <div className="grid grid-cols-4 gap-2 px-4 py-5">
                  {[
                    ["12", "Hari"],
                    ["08", "Jam"],
                    ["24", "Mnt"],
                    ["11", "Dtk"],
                  ].map(([n, l]) => (
                    <div key={l} className="rounded-xl bg-cream py-2 text-center">
                      <div className="font-serif text-xl text-bordeaux">{n}</div>
                      <div className="text-[8px] uppercase tracking-widest text-stone">{l}</div>
                    </div>
                  ))}
                </div>
                <div className="mx-4 mb-3 rounded-xl border border-charcoal/10 p-3">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-stone">Konfirmasi Kehadiran</p>
                  <div className="mt-2 flex gap-2">
                    <span className="flex-1 rounded-lg bg-bordeaux py-1.5 text-center text-[10px] font-semibold text-ivory">
                      Hadir
                    </span>
                    <span className="flex-1 rounded-lg border border-charcoal/15 py-1.5 text-center text-[10px] text-stone">
                      Berhalangan
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1.5 px-4 pb-5">
                  <img src={heroImg} alt="" className="aspect-square w-full rounded-md object-cover" />
                  <div className="aspect-square rounded-md bg-sage/40" />
                  <div className="aspect-square rounded-md bg-gilded/40" />
                </div>
              </div>
            </div>

            <Chip
              className="absolute -left-6 top-16 hidden sm:block"
              float="lp-float"
              tone="sage"
              icon={<Check className="h-4 w-4" strokeWidth={2.5} />}
              label="RSVP terkirim"
              sub="Sinta + 1"
            />
            <Chip
              className="absolute -right-6 top-1/2 hidden sm:block"
              float="lp-float-rev"
              tone="gilded"
              icon={<Heart className="h-4 w-4" fill="currentColor" />}
              label="248 ucapan"
              sub="Buku tamu"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Showcase() {
  const cards = [
    {
      slug: "aksara",
      name: "Aksara",
      tag: "Klasik · Minimal",
      desc: "Untuk pasangan yang mencintai keheningan dan ruang putih.",
      tone: "from-cream to-ivory",
      dark: false,
    },
    {
      slug: "senandika",
      name: "Senandika",
      tag: "Modern · Sinematik",
      desc: "Membawa ayat favorit dan video prewedding sebagai pembuka.",
      tone: "from-bordeaux to-charcoal",
      dark: true,
    },
    {
      slug: "elegant",
      name: "Elegant",
      tag: "Mewah · Onyx",
      desc: "Nuansa gelap berkilau emas dengan partikel dan animasi halus.",
      tone: "from-[#1b1714] to-[#2B2622]",
      dark: true,
    },
  ];
  const [previewSlug, setPreviewSlug] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("desktop");
  useEffect(() => {
    if (!previewSlug) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewSlug(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [previewSlug]);
  const previewCard = cards.find((c) => c.slug === previewSlug);
  return (
    <section id="galeri" className="scroll-mt-28 bg-ivory py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="text-[11px] uppercase tracking-[0.45em] text-gilded">Koleksi Template</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-4 max-w-xl font-serif text-4xl leading-tight text-charcoal md:text-5xl">
                Beberapa karakter, <span className="italic text-bordeaux">tak terhingga cerita.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <p className="max-w-xs text-sm text-stone">
              Setiap template adalah kanvas — siap diberi nyawa oleh kisah Anda. Klik untuk melihat contoh hidup.
            </p>
          </Reveal>
        </div>
        <div className="mt-14 grid gap-7 md:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal as="div" key={c.slug} delay={i * 100}>
              <button
                type="button"
                onClick={() => {
                  setPreviewDevice("desktop");
                  setPreviewSlug(c.slug);
                }}
                className="group block w-full overflow-hidden rounded-2xl border border-charcoal/10 text-left transition duration-300 hover:-translate-y-1 hover:border-gilded/50 hover:shadow-2xl hover:shadow-bordeaux/10"
              >
                <div
                  className={`relative flex aspect-[4/5] flex-col items-center justify-center bg-gradient-to-br ${c.tone} p-10 text-center`}
                >
                  <p className={`text-[10px] uppercase tracking-[0.45em] ${c.dark ? "text-gilded" : "text-stone"}`}>
                    {c.tag}
                  </p>
                  <h3 className={`mt-5 font-serif text-5xl italic ${c.dark ? "text-ivory" : "text-bordeaux"}`}>
                    {c.name}
                  </h3>
                  <p
                    className={`mt-6 max-w-[15rem] text-sm leading-relaxed ${c.dark ? "text-ivory/75" : "text-stone"}`}
                  >
                    {c.desc}
                  </p>
                  <span
                    className={`mt-7 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] ${
                      c.dark ? "text-gilded" : "text-bordeaux"
                    }`}
                  >
                    Lihat Contoh
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
      {previewCard && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Pratinjau template ${previewCard.name}`}
          className="fixed inset-0 z-50 flex flex-col bg-black/70 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewSlug(null);
          }}
        >
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 text-white">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-white/60">Pratinjau Template</p>
              <h2 className="truncate font-serif text-lg">{previewCard.name}</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex overflow-hidden rounded-md border border-white/20 text-xs">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`px-3 py-1.5 uppercase tracking-widest ${
                    previewDevice === "mobile" ? "bg-white text-black" : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  Mobile
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`px-3 py-1.5 uppercase tracking-widest ${
                    previewDevice === "desktop" ? "bg-white text-black" : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  Desktop
                </button>
              </div>
              <a
                href={`/preview/${previewCard.slug}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-white/20 px-3 py-1.5 text-xs uppercase tracking-widest text-white hover:bg-white/10"
              >
                Tab baru
              </a>
              <button
                type="button"
                onClick={() => setPreviewSlug(null)}
                aria-label="Tutup pratinjau"
                className="rounded-md border border-white/20 px-3 py-1.5 text-xs uppercase tracking-widest text-white hover:bg-white/10"
              >
                Tutup
              </button>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center overflow-auto p-4">
            <div
              className={`overflow-hidden rounded-lg bg-white shadow-2xl transition-all ${
                previewDevice === "mobile"
                  ? "h-[min(85vh,820px)] w-[390px] max-w-full"
                  : "h-[min(90vh,900px)] w-full max-w-6xl"
              }`}
            >
              <iframe
                key={previewCard.slug + previewDevice}
                title={`Pratinjau ${previewCard.name}`}
                src={`/preview/${previewCard.slug}`}
                className="h-full w-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Craft() {
  const stats: [string, string][] = [
    ["120+", "Pasangan Dirangkai"],
    ["100%", "Dikerjakan Tim Kami"],
    ["24 jam", "Pendampingan"],
  ];
  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 md:grid-cols-2 md:gap-20">
        <Reveal className="relative">
          <img
            src={craftImg}
            alt="Undangan pernikahan terbuka dengan segel lilin emas di atas kain linen"
            width={1280}
            height={960}
            loading="lazy"
            className="w-full rounded-2xl shadow-2xl shadow-bordeaux/10"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-4 -right-4 -z-10 h-40 w-40 rounded-2xl bg-gilded/25 blur-2xl"
          />
        </Reveal>
        <div>
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.45em] text-gilded">Karya</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-charcoal md:text-5xl">
              Setiap undangan, <span className="italic text-bordeaux">sebuah pengabdian.</span>
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 leading-loose text-stone">
              Kami memperlakukan undangan Anda seperti surat tulisan tangan — disusun perlahan, diperiksa berulang, dan
              diserahkan dengan kehangatan. Tidak ada yang dititipkan ke mesin semata.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-charcoal/15 pt-9">
              {stats.map(([v, l]) => (
                <div key={l}>
                  <dt className="font-serif text-3xl text-bordeaux md:text-4xl">{v}</dt>
                  <dd className="mt-2 text-[10px] uppercase tracking-[0.25em] text-stone">{l}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Testimonial() {
  return (
    <section className="relative bg-ivory pt-24 md:pt-32">
      <Reveal as="div" className="mx-auto max-w-3xl px-6 text-center">
        <Quote className="mx-auto h-10 w-10 text-gilded" />
        <blockquote className="mt-6 font-serif text-2xl leading-relaxed text-charcoal md:text-3xl">
          “Kami hanya bertemu, bercerita, lalu undangannya datang lebih indah dari yang kami bayangkan. Tamu kami bahkan
          bertanya siapa yang membuatnya.”
        </blockquote>
        <figcaption className="mt-9 text-[11px] uppercase tracking-[0.4em] text-stone">
          Naya &amp; Arka — Pernikahan Mei 2025
        </figcaption>
      </Reveal>
      <div className="h-20 md:h-28" />
      <Wave fill="var(--bordeaux)" />
    </section>
  );
}

function ClosingCTA() {
  return (
    <section
      id="kontak"
      className="relative isolate scroll-mt-28 overflow-hidden bg-bordeaux py-24 text-ivory md:py-32"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-15">
        <img
          src={leafImg}
          alt=""
          width={420}
          height={420}
          loading="lazy"
          className="absolute -left-10 top-10 w-72 -rotate-45"
        />
        <img
          src={leafImg}
          alt=""
          width={420}
          height={420}
          loading="lazy"
          className="absolute -right-10 bottom-10 w-72 rotate-[200deg]"
        />
      </div>
      <Reveal as="div" className="relative mx-auto max-w-3xl px-6 text-center">
        <p className="text-[11px] uppercase tracking-[0.45em] text-gilded">Mulai Perjalanan</p>
        <h2 className="mt-6 font-serif text-4xl leading-tight md:text-6xl">
          Mari rangkai undangan
          <br />
          <span className="italic text-gilded">yang seindah hari Anda.</span>
        </h2>
        <p className="mx-auto mt-7 max-w-lg text-ivory/80">
          Jadwalkan pertemuan dengan tim kami. Kami sediakan waktu, secangkir teh, dan ruang untuk mendengar cerita
          Anda.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3.5">
          <a
            href="https://wa.me/6281234567890"
            className="group inline-flex items-center gap-2 rounded-full bg-ivory px-8 py-3.5 text-xs uppercase tracking-[0.25em] text-bordeaux transition hover:bg-gilded hover:text-charcoal"
          >
            Chat via WhatsApp
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </a>
          <a
            href="mailto:halo@senandika.studio"
            className="rounded-full border border-ivory/50 px-8 py-3.5 text-xs uppercase tracking-[0.25em] text-ivory transition hover:bg-ivory hover:text-bordeaux"
          >
            halo@senandika.studio
          </a>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-charcoal py-14 text-ivory/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-2xl italic text-ivory">Senandika</span>
          <span className="text-[10px] uppercase tracking-[0.35em] text-ivory/60">Studio</span>
        </div>
        <p className="text-xs uppercase tracking-[0.3em]">
          © {new Date().getFullYear()} — Dirangkai dengan kasih di Indonesia
        </p>
        <Link to="/login" className="text-xs uppercase tracking-[0.3em] text-ivory/70 transition hover:text-gilded">
          Masuk Studio
        </Link>
      </div>
    </footer>
  );
}
