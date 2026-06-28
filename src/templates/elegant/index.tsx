import { useEffect, useRef, useState } from "react";
import type { TemplateRenderProps } from "@/types/template";
import { MusicToggle, type MusicHandle } from "../_shared/MusicToggle";
import { Reveal } from "../_shared/Reveal";
import { Countdown } from "../_shared/Countdown";
import { RsvpForm } from "../_shared/RsvpForm";
import { WishesWall } from "../_shared/WishesWall";
import { formatDateID } from "../_shared/utils";
import { AmbientParticles } from "./AmbientParticles";
import { SectionShell } from "./SectionShell";

const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=70&auto=format&fit=crop";

export default function ElegantTemplate({ data, guestName, projectId }: TemplateRenderProps) {
  const music = useRef<MusicHandle>(null);
  const [opened, setOpened] = useState(false);
  const [closing, setClosing] = useState(false);

  const firstEvent = data.events[0];
  const targetIso = firstEvent
    ? `${firstEvent.date}T${firstEvent.startTime || "08:00"}:00`
    : new Date().toISOString();

  const heroImg = data.gallery[0]?.url ?? FALLBACK_HERO;
  const subtitle = (data.custom.heroSubtitle as string | undefined) ?? "The Wedding of";
  const quote = (data.custom.quote as string | undefined) ?? "";
  const quoteSource = (data.custom.quoteSource as string | undefined) ?? "";

  useEffect(() => {
    if (opened) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [opened]);

  function handleOpen() {
    music.current?.play();
    setClosing(true);
    window.setTimeout(() => setOpened(true), 900);
  }

  return (
    <div
      className="min-h-dvh bg-[var(--onyx)] text-[var(--cream)]"
      style={{ fontFamily: "var(--font-serif)" }}
    >
      {/* ============ COVER GATE ============ */}
      {!opened && (
        <Cover
          guestName={guestName}
          subtitle={subtitle}
          coupleLabel={`${data.groom.nickName} & ${data.bride.nickName}`}
          heroImg={heroImg}
          closing={closing}
          onOpen={handleOpen}
        />
      )}

      {opened && (
        <MusicToggle ref={music} src={data.settings.musicUrl} theme="dark" />
      )}

      {/* ============ OPENING ============ */}
      <SectionShell
        bgImage={heroImg}
        particles={6}
        ornaments
        className="min-h-[90vh] flex items-center justify-center text-center"
      >
        <Reveal className="mx-auto max-w-xl">
          <p className="font-sans text-[10px] uppercase elegant-track-3 text-[var(--gold)]">
            Assalamu&apos;alaikum Wr. Wb.
          </p>
          <h2
            className="mt-6 font-serif text-4xl italic md:text-5xl elegant-shimmer-gold"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            {data.groom.nickName} &amp; {data.bride.nickName}
          </h2>
          <p className="mx-auto mt-8 max-w-md font-serif text-base leading-relaxed text-[var(--cream)]/85 md:text-lg">
            {data.settings.greeting ??
              "Dengan memohon rahmat dan ridho Tuhan Yang Maha Esa, kami bermaksud menyelenggarakan acara pernikahan putra-putri kami."}
          </p>
          <div className="mt-10 flex justify-center">
            <span className="elegant-scroll-line" aria-hidden />
          </div>
        </Reveal>
      </SectionShell>

      {/* ============ QUOTE ============ */}
      {quote && (
        <SectionShell bgImage={heroImg} particles={4} className="py-20">
          <Reveal className="mx-auto max-w-xl text-center">
            <p
              className="font-serif text-2xl italic leading-relaxed text-[var(--cream)] md:text-3xl"
              style={{ fontFamily: '"Cormorant", "Cormorant Garamond", serif' }}
            >
              &ldquo;{quote}&rdquo;
            </p>
            {quoteSource && (
              <p className="mt-6 font-sans text-[10px] uppercase elegant-track-3 text-[var(--gold)]">
                — {quoteSource}
              </p>
            )}
          </Reveal>
        </SectionShell>
      )}

      {/* ============ COUPLE ============ */}
      <Person
        role="GROOM"
        scriptInitial={data.groom.nickName.charAt(0)}
        scriptRest={data.groom.nickName.slice(1)}
        fullName={data.groom.fullName}
        relation="Putra dari"
        parents={`Bapak ${data.groom.fatherName}\n& Ibu ${data.groom.motherName}`}
        photo={data.groom.photo}
        bgImage={heroImg}
        instagram={data.groom.instagram}
      />
      <Person
        role="BRIDE"
        scriptInitial={data.bride.nickName.charAt(0)}
        scriptRest={data.bride.nickName.slice(1)}
        fullName={data.bride.fullName}
        relation="Putri dari"
        parents={`Bapak ${data.bride.fatherName}\n& Ibu ${data.bride.motherName}`}
        photo={data.bride.photo}
        bgImage={heroImg}
        instagram={data.bride.instagram}
      />

      {/* ============ COUNTDOWN ============ */}
      {firstEvent && (
        <SectionShell bgImage={heroImg} sideLabel="MOMENT" particles={4} className="text-center">
          <Reveal>
            <p className="font-sans text-[10px] uppercase elegant-track-3 text-[var(--gold)]">
              Counting Down
            </p>
            <h2
              className="mt-4 font-serif text-4xl italic md:text-5xl"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Menuju Hari Bahagia
            </h2>
            <div className="mx-auto mt-6 h-px w-16 bg-[var(--gold)]" />
            <div className="mt-10">
              <Countdown targetIso={targetIso} theme="dark" />
            </div>
          </Reveal>
        </SectionShell>
      )}

      {/* ============ EVENTS ============ */}
      <SectionShell bgImage={heroImg} sideLabel="EVENT" ornaments particles={4}>
        <Reveal className="text-center">
          <p className="font-sans text-[10px] uppercase elegant-track-3 text-[var(--gold)]">
            Save the Date
          </p>
          <h2
            className="mt-4 font-serif text-4xl italic md:text-5xl"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Rangkaian Acara
          </h2>
          <div className="elegant-divider-floral mt-6 text-[var(--gold)]">
            <span className="block h-1.5 w-1.5 rotate-45 bg-[var(--gold)]" />
          </div>
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-3xl gap-6 md:grid-cols-2">
          {data.events.map((ev) => (
            <Reveal key={ev.id}>
              <article className="group relative h-full border border-[var(--gold)]/30 bg-[var(--onyx-soft)]/40 p-8 text-center backdrop-blur-sm transition hover:border-[var(--gold)]/70">
                <div className="absolute -top-px left-1/2 h-px w-12 -translate-x-1/2 bg-[var(--gold)]" />
                <h3
                  className="font-serif text-2xl italic text-[var(--cream)] md:text-3xl"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  {ev.name}
                </h3>
                <p className="mt-4 font-sans text-[10px] uppercase elegant-track-2 text-[var(--gold)]">
                  {formatDateID(ev.date)}
                </p>
                <p className="mt-1 font-serif text-base">
                  {ev.startTime} – {ev.endTime} WIB
                </p>
                <div className="mx-auto my-5 h-px w-10 bg-[var(--gold)]/50" />
                <p className="font-serif text-lg italic">{ev.venueName}</p>
                <p className="mt-1 text-xs text-[var(--cream)]/70">{ev.address}</p>
                {ev.mapsUrl && (
                  <a
                    href={ev.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-block border border-[var(--gold)]/60 px-5 py-2 font-sans text-[10px] uppercase elegant-track-3 text-[var(--cream)] transition hover:bg-[var(--gold)] hover:text-[var(--onyx)]"
                  >
                    Lihat Lokasi
                  </a>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </SectionShell>

      {/* ============ STORY ============ */}
      {data.loveStory.length > 0 && (
        <section className="px-6 py-24">
          <Reveal className="text-center">
            <p className="font-sans text-[10px] uppercase elegant-track-3 text-[var(--gold)]">
              Our Journey
            </p>
            <h2
              className="mt-4 font-serif text-4xl italic md:text-5xl"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Kisah Kami
            </h2>
          </Reveal>
          <ol className="relative mx-auto mt-12 max-w-2xl border-l border-[var(--gold)]/40 pl-8">
            {data.loveStory.map((m) => (
              <Reveal as="li" key={m.id} className="mb-10 last:mb-0">
                <span className="absolute -left-[7px] mt-2 block h-3 w-3 rotate-45 bg-[var(--gold)]" />
                <p className="font-sans text-[10px] uppercase elegant-track-2 text-[var(--gold)]">
                  {formatDateID(m.date)}
                </p>
                <h3
                  className="mt-1 font-serif text-2xl italic"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  {m.title}
                </h3>
                <p className="mt-2 font-serif text-[var(--cream)]/80">{m.description}</p>
              </Reveal>
            ))}
          </ol>
        </section>
      )}

      {/* ============ GALLERY ============ */}
      {data.gallery.length > 0 && (
        <section className="px-6 py-24">
          <Reveal className="text-center">
            <p className="font-sans text-[10px] uppercase elegant-track-3 text-[var(--gold)]">
              Moments
            </p>
            <h2
              className="mt-4 font-serif text-4xl italic md:text-5xl"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Galeri
            </h2>
          </Reveal>
          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-3">
            {data.gallery.map((g, i) => (
              <Reveal key={g.id} delay={i * 60}>
                <div className="group relative overflow-hidden">
                  <img
                    src={g.url}
                    alt={g.caption ?? ""}
                    loading="lazy"
                    className="aspect-[3/4] h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--onyx)]/70 via-transparent to-transparent opacity-60 transition group-hover:opacity-30" />
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ============ GIFTS ============ */}
      {data.gifts.length > 0 && (
        <SectionShell bgImage={heroImg} sideLabel="LOVE" particles={3}>
          <Reveal className="mx-auto max-w-xl text-center">
            <p className="font-sans text-[10px] uppercase elegant-track-3 text-[var(--gold)]">
              Wedding Gift
            </p>
            <h2
              className="mt-4 font-serif text-4xl italic md:text-5xl"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Tanda Kasih
            </h2>
            <p className="mt-4 font-serif text-[var(--cream)]/75">
              Doa restu adalah hadiah terindah. Bila berkenan, dapat melalui rekening berikut.
            </p>
          </Reveal>
          <div className="mx-auto mt-10 grid max-w-2xl gap-4 md:grid-cols-2">
            {data.gifts.map((g) => (
              <Reveal key={g.id}>
                <div className="border border-[var(--gold)]/30 bg-[var(--onyx-soft)]/40 p-6 text-center">
                  <p className="font-sans text-[10px] uppercase elegant-track-3 text-[var(--gold)]">
                    {g.provider}
                  </p>
                  <p className="mt-3 font-serif text-2xl tracking-wider">
                    {g.accountNumber}
                  </p>
                  <p className="mt-1 font-serif italic text-[var(--cream)]/80">
                    a.n. {g.accountName}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </SectionShell>
      )}

      {/* ============ RSVP & WISHES ============ */}
      <SectionShell bgImage={heroImg} sideLabel="RSVP" ornaments particles={5}>
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
          <Reveal>
            <p className="font-sans text-[10px] uppercase elegant-track-3 text-[var(--gold)]">
              RSVP
            </p>
            <h2
              className="mt-3 font-serif text-3xl italic md:text-4xl"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Konfirmasi Kehadiran
            </h2>
            <div className="mt-6">
              <RsvpForm projectId={projectId} guestName={guestName} theme="dark" />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p className="font-sans text-[10px] uppercase elegant-track-3 text-[var(--gold)]">
              Ucapan &amp; Doa
            </p>
            <h2
              className="mt-3 font-serif text-3xl italic md:text-4xl"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Dari Para Tamu
            </h2>
            <div className="mt-6 max-h-[460px] overflow-y-auto pr-2">
              <WishesWall projectId={projectId} theme="dark" />
            </div>
          </Reveal>
        </div>
      </SectionShell>

      {/* ============ FOOTER ============ */}
      <footer className="relative overflow-hidden px-6 pb-16 pt-24 text-center">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(circle_at_50%_70%,oklch(0.78_0.10_80/0.30),transparent_60%)]" />
        <Reveal>
          <p className="mx-auto max-w-xl font-serif text-lg italic text-[var(--cream)]/85 md:text-xl">
            {data.settings.closing ??
              "Merupakan kehormatan apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu."}
          </p>
          <div className="mx-auto mt-10 h-px w-16 bg-[var(--gold)]" />
          <h3
            className="mt-10 font-serif text-4xl italic md:text-5xl elegant-shimmer-gold"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            {data.groom.nickName} &amp; {data.bride.nickName}
          </h3>
          <p className="mt-8 font-sans text-[10px] uppercase elegant-track-3 text-[var(--cream)]/60">
            Crafted with care
          </p>
        </Reveal>
      </footer>
    </div>
  );
}

/* ---------- Cover gate ---------- */
interface CoverProps {
  guestName?: string;
  subtitle: string;
  coupleLabel: string;
  heroImg: string;
  closing: boolean;
  onOpen: () => void;
}

function Cover({ guestName, subtitle, coupleLabel, heroImg, closing, onOpen }: CoverProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pembuka undangan"
      className={`fixed inset-0 z-[60] overflow-hidden bg-[var(--onyx)] transition-transform duration-[1000ms] ease-[cubic-bezier(0.77,0,0.175,1)] ${
        closing ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <img
        src={heroImg}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover object-[50%_25%] elegant-ken-burns"
      />
      <div className="absolute inset-x-0 top-[55%] bottom-0 bg-gradient-to-b from-transparent via-[var(--onyx)]/85 to-[var(--onyx)]" />
      <AmbientParticles count={14} />

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-end px-6 pb-12 text-center text-[var(--cream)]">
        <div className="elegant-fade-up flex w-full max-w-sm flex-col items-center">
          <div className="flex items-center justify-center gap-3 text-[var(--cream)]/90">
            <span className="block h-px w-10 bg-gradient-to-r from-transparent to-[var(--cream)]/60" />
            <span className="block h-1 w-1 rotate-45 bg-[var(--cream)]/70" />
            <p className="font-sans text-[12px] font-semibold uppercase elegant-track-3 elegant-shimmer-gold">
              {subtitle}
            </p>
            <span className="block h-1 w-1 rotate-45 bg-[var(--cream)]/70" />
            <span className="block h-px w-10 bg-gradient-to-l from-transparent to-[var(--cream)]/60" />
          </div>

          <h1
            className="mt-3 leading-[1.05] tracking-[-0.02em] text-[var(--cream)] drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)]"
            style={{
              fontFamily: '"Playfair Display", "Cormorant Garamond", serif',
              fontWeight: 500,
              fontSize: "clamp(64px, 16vw, 128px)",
            }}
          >
            {coupleLabel}
          </h1>

          <div className="mt-8 flex flex-col items-center">
            <p className="font-serif text-base text-[var(--cream)]/95 md:text-lg">
              Kepada Yth.
            </p>
            <p className="mt-2 font-serif text-xl text-[var(--cream)] md:text-2xl">
              {guestName ?? "Bapak / Ibu / Saudara/i"}
            </p>
            <p className="mt-3 px-4 font-sans text-[10px] italic text-[var(--cream)]/65">
              Mohon maaf apabila terdapat kesalahan penulisan nama atau gelar.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpen}
            className="group elegant-glow mt-10 inline-flex items-center justify-center border border-[var(--cream)]/70 px-9 py-3.5 font-sans text-[11px] uppercase elegant-track-3 text-[var(--cream)] transition-all duration-500 hover:bg-[var(--cream)] hover:text-[var(--onyx)]"
          >
            Buka Undangan
            <span className="ml-3 transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Person card with vertical side text ---------- */
interface PersonProps {
  role: "GROOM" | "BRIDE";
  scriptInitial: string;
  scriptRest: string;
  fullName: string;
  relation: string;
  parents: string;
  photo?: string;
  bgImage: string;
  instagram?: string;
}

function Person({
  role,
  scriptInitial,
  scriptRest,
  fullName,
  relation,
  parents,
  photo,
  bgImage,
  instagram,
}: PersonProps) {
  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-24">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgImage})`,
          filter: "blur(8px)",
          transform: "scale(1.1)",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-[var(--onyx)]/80" />
      <AmbientParticles count={8} />

      <VerticalSideText text={role} side="left" />
      <VerticalSideText text={role} side="right" />

      <Reveal className="relative z-10 flex flex-col items-center">
        <div className="elegant-float relative h-[310px] w-[230px] shadow-2xl shadow-black/60 ring-1 ring-[var(--cream)]/10 md:h-[350px] md:w-[260px]">
          {photo ? (
            <img src={photo} alt={fullName} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center bg-[var(--onyx-soft)] font-serif text-6xl italic text-[var(--cream)]/30">
              {scriptInitial}
            </div>
          )}
          <h3
            className="elegant-shimmer-gold absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap pb-2 font-serif text-5xl italic leading-[1.15] drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] md:-bottom-10 md:text-6xl"
            style={{ fontFamily: '"Cormorant", "Cormorant Garamond", serif' }}
          >
            {scriptInitial}
            {scriptRest}
          </h3>
        </div>

        <div className="mt-20 max-w-xs text-center text-[var(--cream)]">
          <p className="font-serif text-lg">{fullName}</p>
          <p className="mt-5 font-serif italic text-[var(--cream)]/80">{relation}</p>
          <p className="mt-1 whitespace-pre-line font-serif leading-relaxed">
            {parents}
          </p>
          {instagram && (
            <a
              href={`https://instagram.com/${instagram.replace(/^@/, "")}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block font-sans text-[10px] uppercase elegant-track-2 text-[var(--gold)] hover:text-[var(--cream)]"
            >
              @{instagram.replace(/^@/, "")}
            </a>
          )}
        </div>
      </Reveal>
    </section>
  );
}

function VerticalSideText({ text, side }: { text: string; side: "left" | "right" }) {
  return (
    <div
      className={`pointer-events-none absolute top-1/2 z-10 -translate-y-1/2 select-none ${
        side === "left" ? "left-3" : "right-3"
      }`}
      aria-hidden
    >
      <div
        className="flex items-center gap-3 text-[var(--cream)]/70"
        style={{
          writingMode: "vertical-rl",
          transform: side === "left" ? "rotate(180deg)" : "none",
        }}
      >
        <span
          className="text-xl italic"
          style={{ fontFamily: '"Cormorant", "Cormorant Garamond", serif' }}
        >
          The
        </span>
        <span className="font-serif text-xs uppercase elegant-track-3">{text}</span>
      </div>
    </div>
  );
}