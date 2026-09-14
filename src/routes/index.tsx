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
  Quote,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import heroImg from "@/assets/landing-hero.jpg";
import craftImg from "@/assets/landing-craft.jpg";
import { fetchTemplateThumbnailMap } from "@/lib/template-thumbnails";

const THUMB_CACHE_KEY = "tpl-thumb-map-v1";

function useTemplateThumbnails() {
  const [map, setMap] = useState<Record<string, string>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = sessionStorage.getItem(THUMB_CACHE_KEY);
      return raw ? (JSON.parse(raw) as Record<string, string>) : {};
    } catch {
      return {};
    }
  });
  useEffect(() => {
    let alive = true;
    fetchTemplateThumbnailMap()
      .then((m) => {
        if (!alive) return;
        setMap(m);
        try {
          sessionStorage.setItem(THUMB_CACHE_KEY, JSON.stringify(m));
        } catch {
          /* ignore */
        }
      })
      .catch(() => {
        /* silent — fallback to gradient */
      });
    return () => {
      alive = false;
    };
  }, []);
  return map;
}

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
/* Lovedy building blocks                                              */
/* ------------------------------------------------------------------ */

/** Botanical sprig — vector version of the branch beneath the wordmark. */
function Sprig({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  const leaves = [14, 24, 34, 44, 54, 64, 74, 84, 94];
  return (
    <svg
      viewBox="0 0 108 20"
      aria-hidden
      focusable="false"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path
        d="M2 13.4C22 11 44 9.4 66 8.6c14-.5 26-.7 40-.6v1.9c-14-.1-26 .1-40 .6-22 .8-44 2.4-64 4.8Z"
        fill="currentColor"
      />
      {leaves.map((x, i) => {
        const up = i % 2 === 0;
        const y = up ? 12.4 - x * 0.045 - 3.4 : 12.4 - x * 0.045 + 3.2;
        return (
          <ellipse
            key={x}
            cx={x}
            cy={y}
            rx="5.1"
            ry="2.5"
            fill="currentColor"
            transform={`rotate(${up ? -34 : 30} ${x} ${y})`}
          />
        );
      })}
    </svg>
  );
}

/** Pinyon Script eyebrow — the label that sits above every Lovedy heading. */
function Eyebrow({ children, tone = "navy" }: { children: ReactNode; tone?: "navy" | "light" }) {
  return (
    <p
      className={`font-script text-[28px] leading-none md:text-[34px] ${
        tone === "light" ? "text-lv-pale" : "text-lv-navy"
      }`}
    >
      {children}
    </p>
  );
}

function SectionHead({
  eyebrow,
  title,
  align = "center",
  tone = "navy",
  className = "",
}: {
  eyebrow: string;
  title: ReactNode;
  align?: "center" | "left";
  tone?: "navy" | "light";
  className?: string;
}) {
  return (
    <div className={`${align === "center" ? "text-center" : "text-left"} ${className}`}>
      <Reveal>
        <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      </Reveal>
      <Reveal delay={80}>
        <h2
          className={`mt-2 font-display text-[2rem] font-bold leading-[1.18] md:text-[3.5rem] ${
            tone === "light" ? "text-white" : "text-lv-navy"
          }`}
        >
          {title}
        </h2>
      </Reveal>
    </div>
  );
}

type BtnTone = "solid" | "pale" | "outline";

function Btn({
  children,
  tone = "solid",
  className = "",
}: {
  children: ReactNode;
  tone?: BtnTone;
  className?: string;
}) {
  const tones: Record<BtnTone, string> = {
    solid: "bg-lv-peri-deep text-white hover:bg-lv-navy",
    pale: "bg-lv-pale text-lv-navy hover:bg-white",
    outline: "border border-lv-peri text-lv-navy hover:border-lv-navy hover:bg-lv-navy hover:text-white",
  };
  return (
    <span
      className={`inline-flex items-center gap-2 px-8 py-3.5 font-display text-[15px] font-bold transition-colors duration-300 ${tones[tone]} ${className}`}
    >
      {children}
    </span>
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
    <div className="min-h-dvh bg-lv-paper font-body text-lv-ink antialiased">
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
    ["Katalog", "/katalog"],
    ["Kontak", "#kontak"],
  ];
  const socials: [string, ReactNode, string][] = [
    ["Instagram", <Instagram className="h-4 w-4" key="ig" />, "https://instagram.com"],
    ["Twitter", <Twitter className="h-4 w-4" key="tw" />, "https://twitter.com"],
    ["Facebook", <Facebook className="h-4 w-4" key="fb" />, "https://facebook.com"],
  ];
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-white/92 shadow-[0_1px_0_var(--lv-line)] backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* Row 1 — save-the-date · wordmark · socials */}
        <div className="grid grid-cols-2 items-center gap-4 py-4 md:grid-cols-3">
          <div className="hidden items-center gap-3 md:flex">
            <Heart className="h-6 w-6 text-lv-peri" strokeWidth={1.4} />
            <span className="leading-tight">
              <span className="block text-[13px] text-lv-ink">Save The Date</span>
              <span className="block font-display text-[17px] font-bold italic text-lv-navy">14 Desember 2026</span>
            </span>
          </div>

          <Link to="/" className="flex flex-col items-start md:items-center">
            <span className="font-script text-[30px] leading-none text-lv-navy md:text-[34px]">Senandika</span>
            <Sprig className="mt-1 h-[14px] w-[106px] text-lv-peri" />
          </Link>

          <div className="flex items-center justify-end gap-3">
            <div className="hidden items-center gap-2 lg:flex">
              {socials.map(([label, icon, href]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-lv-line text-lv-navy transition-colors hover:border-lv-navy hover:bg-lv-navy hover:text-white"
                >
                  {icon}
                </a>
              ))}
            </div>
            <a href="#kontak">
              <Btn tone="solid" className="px-6 py-2.5 text-[14px]">
                Konsultasi
              </Btn>
            </a>
          </div>
        </div>

        {/* Row 2 — hairline + centred Volkhov menu */}
        <div className="border-t border-lv-line">
          <nav className="flex items-center justify-center gap-6 overflow-x-auto py-3 md:gap-14">
            {links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="lv-nav-link shrink-0 font-display text-[16px] text-lv-navy transition-colors hover:text-lv-peri-deep md:text-[19px]"
              >
                {label}
              </a>
            ))}
            <Link
              to="/login"
              className="lv-nav-link hidden shrink-0 font-display text-[19px] text-lv-muted transition-colors hover:text-lv-navy sm:block"
            >
              Masuk Studio
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* photograph + the design's white veil over a periwinkle tint */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <img src={heroImg} alt="" width={1920} height={1200} className="lv-kenburns h-full w-full object-cover" />
        <div className="lv-band-soft absolute inset-0 opacity-45 mix-blend-multiply" />
        <div className="lv-veil-light absolute inset-0" />
      </div>

      <div className="mx-auto flex min-h-[86vh] max-w-7xl flex-col justify-center px-6 pb-20 pt-52 md:px-10 md:pt-56">
        <div className="max-w-2xl">
          <p className="lp-rise font-display text-[20px] text-lv-navy md:text-[28px]" style={{ animationDelay: "0ms" }}>
            Undangan Pernikahan Digital
          </p>
          <h1
            className="lp-rise mt-3 font-display text-[3rem] leading-[1.02] text-lv-navy md:text-[5rem] lg:text-[6.25rem]"
            style={{ animationDelay: "90ms" }}
          >
            Senandika
          </h1>
          <div className="lp-rise mt-6 flex items-center gap-4" style={{ animationDelay: "150ms" }}>
            <Sprig className="h-[16px] w-[106px] text-lv-peri" />
            <span className="font-display text-[17px] font-bold italic text-lv-navy">Est. 2024 · Indonesia</span>
          </div>
          <p
            className="lp-rise mt-7 max-w-lg text-[17px] leading-[1.85] text-lv-ink"
            style={{ animationDelay: "220ms" }}
          >
            Tim kami merangkai setiap detail — sampul, ayat favorit, galeri, hingga RSVP — menjadi undangan hidup yang
            siap Anda bagikan. Anda cukup datang dan bercerita.
          </p>
          <div className="lp-rise mt-10 flex flex-wrap items-center gap-4" style={{ animationDelay: "300ms" }}>
            <a href="#kontak">
              <Btn tone="solid">
                Jadwalkan Konsultasi
                <ArrowRight className="h-4 w-4" />
              </Btn>
            </a>
            <Link to="/u/$slug" params={{ slug: "rama-sinta" }}>
              <Btn tone="outline">
                Lihat Contoh
                <ArrowRight className="h-4 w-4" />
              </Btn>
            </Link>
          </div>
        </div>

        <div className="mt-16 flex items-center gap-4">
          <span className="lp-scrollhint text-lv-peri-deep">
            <ArrowDown className="h-5 w-5" />
          </span>
          <span className="text-[13px] text-lv-muted">
            <span className="font-semibold text-lv-navy">120+ pasangan</span> telah dirangkai bersama kami
          </span>
        </div>
      </div>
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
    <div className="overflow-hidden border-y border-lv-line bg-lv-mist py-5">
      <div className="lp-marquee flex w-max items-center whitespace-nowrap">
        {row.map((label, i) => (
          <span key={i} className="flex items-center font-display text-[15px] italic text-lv-navy">
            <span className="px-7">{label}</span>
            <span aria-hidden className="text-lv-peri">
              ❦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Philosophy() {
  return (
    <section id="filosofi" className="scroll-mt-40 bg-lv-paper py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <SectionHead
          eyebrow="Filosofi"
          title={
            <>
              Bukan sekadar kartu — <em className="font-normal italic">sebuah pembuka kisah.</em>
            </>
          }
        />
        <Reveal delay={160}>
          <p className="mx-auto mt-8 max-w-xl text-center text-[17px] leading-[1.9] text-lv-ink">
            Kami percaya undangan adalah napas pertama dari sebuah perayaan. Itu sebabnya kami duduk bersama Anda,
            memilih setiap detail, dan mengerjakannya seperti merangkai bunga — sehelai demi sehelai, dengan tenang dan
            teliti.
          </p>
        </Reveal>
        <Reveal delay={220}>
          <div className="lv-rule mt-12">
            <Sprig className="h-[16px] w-[80px] text-lv-peri" />
          </div>
        </Reveal>
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
    <section id="proses" className="lv-band scroll-mt-40 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-14 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
            <SectionHead
              align="left"
              tone="light"
              eyebrow="Cara Kerja"
              title={
                <>
                  Empat langkah,
                  <br />
                  <em className="font-normal italic">tanpa repot.</em>
                </>
              }
            />
            <Reveal delay={160}>
              <p className="mt-7 max-w-md text-[17px] leading-[1.9] text-white/85">
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
                className="grid grid-cols-[auto_1fr] gap-x-7 gap-y-2 border-t border-white/25 py-7 first:border-t-0 first:pt-0"
              >
                <span className="font-display text-[2rem] font-bold italic text-lv-pale">{s.n}</span>
                <div>
                  <h3 className="font-display text-[1.5rem] text-white">{s.title}</h3>
                  <p className="mt-2.5 text-[16px] leading-[1.85] text-white/85">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
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
    <section className="overflow-hidden bg-lv-paper py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 md:grid-cols-2 md:gap-20">
        <div>
          <SectionHead
            align="left"
            eyebrow="Undangan Hidup"
            title={
              <>
                Bukan kartu statis — <em className="font-normal italic">pengalaman yang bergerak.</em>
              </>
            }
          />
          <Reveal delay={160}>
            <p className="mt-7 max-w-md text-[17px] leading-[1.9] text-lv-ink">
              Setiap undangan kami hidup di tangan tamu: animasi pembuka yang lembut, musik latar, hitung mundur menuju
              hari-H, dan RSVP yang langsung tercatat.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-x-8 gap-y-8 sm:grid-cols-2">
            {features.map((f, i) => (
              <Reveal as="div" key={f.title} delay={200 + i * 80} className="flex gap-4">
                <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-lv-pale text-lv-navy">
                  {f.icon}
                </span>
                <div>
                  <h3 className="font-display text-[20px] text-lv-navy">{f.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-[1.8] text-lv-muted">{f.body}</p>
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
              className="lv-band-soft lp-breathe absolute left-1/2 top-1/2 -z-10 h-[112%] w-[112%] -translate-x-1/2 -translate-y-1/2 rounded-[999px] opacity-30 blur-3xl"
            />
            <div className="relative mx-auto w-[270px] rounded-[2.6rem] border-[10px] border-lv-navy bg-lv-navy shadow-2xl shadow-lv-navy/25">
              <div className="absolute left-1/2 top-2 z-10 h-1.5 w-16 -translate-x-1/2 rounded-full bg-white/30" />
              <div className="overflow-hidden rounded-[1.9rem] bg-white">
                <div className="lv-band relative px-6 pb-8 pt-12 text-center text-white">
                  <p className="font-script text-[24px] leading-none text-lv-pale">The Wedding Of</p>
                  <p className="mt-4 font-display text-[2.6rem] leading-tight">
                    Rama
                    <span className="my-1 block text-[1.25rem] text-lv-pale">&amp;</span>
                    Sinta
                  </p>
                  <div className="mx-auto mt-4 h-px w-16 bg-white/50" />
                  <p className="mt-4 font-display text-[13px] font-bold italic">14 · 12 · 2026</p>
                </div>
                <div className="grid grid-cols-4 gap-2 px-4 py-5">
                  {[
                    ["12", "Hari"],
                    ["08", "Jam"],
                    ["24", "Mnt"],
                    ["11", "Dtk"],
                  ].map(([n, l]) => (
                    <div key={l} className="rounded-[10px] bg-lv-mist py-2 text-center">
                      <div className="font-display text-[20px] font-bold text-lv-navy">{n}</div>
                      <div className="font-display text-[9px] italic text-lv-muted">{l}</div>
                    </div>
                  ))}
                </div>
                <div className="mx-4 mb-3 border border-lv-line p-3">
                  <p className="font-display text-[11px] italic text-lv-muted">Konfirmasi Kehadiran</p>
                  <div className="mt-2 flex gap-2">
                    <span className="flex-1 bg-lv-peri-deep py-1.5 text-center font-display text-[11px] font-bold text-white">
                      Hadir
                    </span>
                    <span className="flex-1 border border-lv-line py-1.5 text-center font-display text-[11px] text-lv-muted">
                      Berhalangan
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1.5 px-4 pb-5">
                  <img src={heroImg} alt="" className="aspect-square w-full object-cover" />
                  <div className="aspect-square bg-lv-pale" />
                  <div className="aspect-square bg-lv-lilac" />
                </div>
              </div>
            </div>
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
      tone: "from-lv-mist to-white",
      dark: false,
    },
    {
      slug: "senandika",
      name: "Senandika",
      tag: "Modern · Sinematik",
      desc: "Membawa ayat favorit dan video prewedding sebagai pembuka.",
      tone: "from-lv-peri to-lv-sky",
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
  const thumbs = useTemplateThumbnails();
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
    <section id="galeri" className="scroll-mt-40 bg-lv-mist py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHead
          eyebrow="Koleksi"
          title={
            <>
              Beberapa karakter, <em className="font-normal italic">tak terhingga cerita.</em>
            </>
          }
        />
        <Reveal delay={140}>
          <p className="mx-auto mt-6 max-w-xl text-center text-[17px] leading-[1.9] text-lv-ink">
            Setiap template adalah kanvas — siap diberi nyawa oleh kisah Anda. Klik untuk melihat contoh hidup.
          </p>
        </Reveal>
        <Reveal delay={180} className="mt-8 text-center">
          <Link to="/katalog">
            <Btn tone="pale">
              Lihat Seluruh Katalog
              <ArrowRight className="h-4 w-4" />
            </Btn>
          </Link>
        </Reveal>
        <div className="mt-14 grid gap-7 md:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal as="div" key={c.slug} delay={i * 100}>
              <button
                type="button"
                onClick={() => {
                  setPreviewDevice("desktop");
                  setPreviewSlug(c.slug);
                }}
                className="group block w-full overflow-hidden border border-lv-line bg-white text-left transition duration-300 hover:-translate-y-1 hover:border-lv-peri hover:shadow-[0_28px_60px_-38px_var(--lv-navy)]"
              >
                <div
                  className={`relative flex aspect-[4/5] flex-col items-center justify-center bg-gradient-to-br ${c.tone} p-10 text-center`}
                >
                  {thumbs[c.slug] && (
                    <>
                      <img
                        src={thumbs[c.slug]}
                        alt={`Thumbnail template ${c.name}`}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10"
                      />
                    </>
                  )}
                  <p
                    className={`relative font-display text-[14px] italic ${
                      thumbs[c.slug] || c.dark ? "text-white/90" : "text-lv-muted"
                    }`}
                  >
                    {c.tag}
                  </p>
                  <h3
                    className={`relative mt-5 font-script text-[3rem] leading-none ${
                      thumbs[c.slug] || c.dark ? "text-white drop-shadow-md" : "text-lv-navy"
                    }`}
                  >
                    {c.name}
                  </h3>
                  <Sprig
                    className={`relative mt-4 h-[14px] w-[90px] ${
                      thumbs[c.slug] || c.dark ? "text-white/80" : "text-lv-peri"
                    }`}
                  />
                  <p
                    className={`relative mt-5 max-w-[15rem] text-[15px] leading-[1.8] ${
                      thumbs[c.slug] || c.dark ? "text-white/90" : "text-lv-muted"
                    }`}
                  >
                    {c.desc}
                  </p>
                  <span
                    className={`relative mt-7 inline-flex items-center gap-1.5 font-display text-[14px] font-bold ${
                      thumbs[c.slug] || c.dark ? "text-white" : "text-lv-navy"
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
          className="fixed inset-0 z-50 flex flex-col bg-lv-ink/80 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewSlug(null);
          }}
        >
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 text-white">
            <div className="min-w-0">
              <p className="font-display text-[12px] italic text-white/70">Pratinjau Template</p>
              <h2 className="truncate font-display text-[19px]">{previewCard.name}</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex overflow-hidden border border-white/25 text-[12px]">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`px-3 py-1.5 font-display ${
                    previewDevice === "mobile" ? "bg-white text-lv-navy" : "text-white/85 hover:bg-white/10"
                  }`}
                >
                  Mobile
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`px-3 py-1.5 font-display ${
                    previewDevice === "desktop" ? "bg-white text-lv-navy" : "text-white/85 hover:bg-white/10"
                  }`}
                >
                  Desktop
                </button>
              </div>
              <a
                href={`/preview/${previewCard.slug}`}
                target="_blank"
                rel="noreferrer"
                className="border border-white/25 px-3 py-1.5 font-display text-[12px] text-white hover:bg-white/10"
              >
                Tab baru
              </a>
              <button
                type="button"
                onClick={() => setPreviewSlug(null)}
                aria-label="Tutup pratinjau"
                className="border border-white/25 px-3 py-1.5 font-display text-[12px] text-white hover:bg-white/10"
              >
                Tutup
              </button>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center overflow-auto p-4">
            <div
              className={`overflow-hidden bg-white shadow-2xl transition-all ${
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
    ["120+", "Pasangan"],
    ["100%", "Tim Kami"],
    ["24 jam", "Pendampingan"],
  ];
  return (
    <section className="bg-lv-paper py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 md:grid-cols-2 md:gap-20">
        <Reveal className="relative">
          <img
            src={craftImg}
            alt="Undangan pernikahan terbuka dengan segel lilin di atas kain linen"
            width={1280}
            height={960}
            loading="lazy"
            className="w-full object-cover shadow-[0_40px_80px_-52px_var(--lv-navy)]"
          />
          <div
            aria-hidden
            className="lv-band-soft pointer-events-none absolute -bottom-5 -right-5 -z-10 h-44 w-44 opacity-50 blur-2xl"
          />
        </Reveal>
        <div>
          <SectionHead
            align="left"
            eyebrow="Karya"
            title={
              <>
                Setiap undangan, <em className="font-normal italic">sebuah pengabdian.</em>
              </>
            }
          />
          <Reveal delay={160}>
            <p className="mt-7 text-[17px] leading-[1.9] text-lv-ink">
              Kami memperlakukan undangan Anda seperti surat tulisan tangan — disusun perlahan, diperiksa berulang, dan
              diserahkan dengan kehangatan. Tidak ada yang dititipkan ke mesin semata.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <dl className="mt-11 grid grid-cols-3 gap-4">
              {stats.map(([v, l]) => (
                <div key={l} className="lv-count px-3 py-6 text-center">
                  <dt className="font-display text-[1.75rem] font-bold leading-none text-lv-navy md:text-[2.25rem]">
                    {v}
                  </dt>
                  <dd className="mt-3 font-display text-[14px] italic text-lv-muted">{l}</dd>
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
    <section className="bg-lv-mist py-24 md:py-32">
      <Reveal as="div" className="mx-auto max-w-3xl px-6 text-center">
        <Quote className="mx-auto h-9 w-9 text-lv-peri" />
        <blockquote className="mt-7 font-display text-[1.4rem] leading-[1.55] text-lv-navy md:text-[1.85rem]">
          “Kami hanya bertemu, bercerita, lalu undangannya datang lebih indah dari yang kami bayangkan. Tamu kami bahkan
          bertanya siapa yang membuatnya.”
        </blockquote>
        <div className="lv-rule mt-9">
          <Sprig className="h-[14px] w-[70px] text-lv-peri" />
        </div>
        <figcaption className="mt-6 font-display text-[17px] font-bold italic text-lv-navy">
          Naya &amp; Arka — Pernikahan Mei 2025
        </figcaption>
      </Reveal>
    </section>
  );
}

function ClosingCTA() {
  const contacts: [string, string, string][] = [
    ["WhatsApp", "+62 812 3456 7890", "https://wa.me/6281234567890"],
    ["Surel", "halo@senandika.studio", "mailto:halo@senandika.studio"],
    ["Studio", "Kediri, Jawa Timur", "#kontak"],
  ];
  return (
    <section id="kontak" className="relative isolate scroll-mt-40 overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10">
        <img src={craftImg} alt="" width={1920} height={1280} loading="lazy" className="h-full w-full object-cover" />
        <div className="lv-band-soft absolute inset-0 opacity-40 mix-blend-multiply" />
        <div className="lv-veil-light-soft absolute inset-0" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <SectionHead
          eyebrow="Undangan"
          align="left"
          title={
            <>
              Mari rangkai undangan
              <br />
              <em className="font-normal italic">yang seindah hari Anda.</em>
            </>
          }
          className="max-w-2xl"
        />
        <Reveal delay={160}>
          <p className="mt-7 max-w-lg text-[17px] leading-[1.9] text-lv-ink">
            Jadwalkan pertemuan dengan tim kami. Kami sediakan waktu, secangkir teh, dan ruang untuk mendengar cerita
            Anda.
          </p>
        </Reveal>

        <Reveal delay={220}>
          <dl className="mt-12 grid max-w-2xl gap-x-10 gap-y-7 sm:grid-cols-3">
            {contacts.map(([label, value, href]) => (
              <div key={label} className="border-b border-lv-peri pb-3">
                <dt className="text-[13px] text-lv-ink">{label}</dt>
                <dd className="mt-1.5">
                  <a
                    href={href}
                    className="font-display text-[17px] font-bold italic text-lv-navy underline-offset-4 transition-colors hover:text-lv-peri-deep hover:underline"
                  >
                    {value}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={280} className="mt-12">
          <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer">
            <Btn tone="solid">
              Chat via WhatsApp
              <ArrowRight className="h-4 w-4" />
            </Btn>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  const socials: [string, ReactNode, string][] = [
    ["Instagram", <Instagram className="h-4 w-4" key="ig" />, "https://instagram.com"],
    ["Twitter", <Twitter className="h-4 w-4" key="tw" />, "https://twitter.com"],
    ["Facebook", <Facebook className="h-4 w-4" key="fb" />, "https://facebook.com"],
  ];
  return (
    <footer className="bg-lv-paper py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-7 px-6">
        <div className="flex flex-col items-center">
          <span className="font-script text-[34px] leading-none text-lv-navy">Senandika</span>
          <Sprig className="mt-1.5 h-[16px] w-[110px] text-lv-peri" />
        </div>

        <div className="flex items-center gap-3">
          {socials.map(([label, icon, href]) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="grid h-10 w-10 place-items-center rounded-full border border-lv-line text-lv-navy transition-colors hover:border-lv-navy hover:bg-lv-navy hover:text-white"
            >
              {icon}
            </a>
          ))}
        </div>

        <div className="h-px w-full max-w-3xl bg-lv-line" />

        <div className="flex w-full flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:gap-6 sm:text-left">
          <p className="text-[13px] text-lv-muted">
            © {new Date().getFullYear()} Senandika Studio — Dirangkai dengan kasih di Indonesia
          </p>
          <Link
            to="/login"
            className="font-display text-[15px] italic text-lv-navy transition-colors hover:text-lv-peri-deep"
          >
            Masuk Studio
          </Link>
        </div>
      </div>
    </footer>
  );
}
