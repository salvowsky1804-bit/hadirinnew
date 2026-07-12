import { useRef } from "react";
import type { TemplateRenderProps } from "@/types/template";
import { OpeningGate } from "../_shared/OpeningGate";
import { MusicToggle, type MusicHandle } from "../_shared/MusicToggle";
import { Reveal } from "../_shared/Reveal";
import { Countdown } from "../_shared/Countdown";
import { RsvpForm } from "../_shared/RsvpForm";
import { WishesWall } from "../_shared/WishesWall";
import { formatDateID } from "../_shared/utils";

const HERO_IMG =
  "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=1400&q=70&auto=format&fit=crop";

/**
 * Botanika — Garden botanical direction.
 * Palette: cream ivory, deep sage, warm terracotta, soft moss.
 * Typography: Cormorant Garamond (serif display) + Inter (body).
 * Shared components (Countdown, RSVP, Wishes, Gate, Music) are re-themed by
 * overriding the token vars they read (--ivory, --charcoal, --bordeaux, --gilded)
 * on this template's root scope.
 */
export default function BotanikaTemplate({
  data,
  guestName,
  projectId,
}: TemplateRenderProps) {
  const music = useRef<MusicHandle>(null);
  const firstEvent = data.events[0];
  const targetIso = firstEvent
    ? `${firstEvent.date}T${firstEvent.startTime || "08:00"}:00`
    : new Date().toISOString();

  const quote =
    (data.custom?.quote as string | undefined) ??
    "Dan di antara tanda-tanda-Nya, Dia menciptakan pasangan bagimu — agar kamu cenderung dan merasa tenteram kepadanya.";
  const quoteSource =
    (data.custom?.quoteSource as string | undefined) ?? "— QS Ar-Rum: 21";
  const dresscode = data.custom?.dresscode as string | undefined;

  return (
    <div
      className="min-h-dvh text-[color:var(--charcoal)]"
      style={
        {
          // Scoped palette override so shared components inherit the botanical look.
          "--ivory": "#F3EEE3",
          "--charcoal": "#2E3B2F",
          "--bordeaux": "#4E6A4E", // deep sage
          "--gilded": "#B96A4A", // warm terracotta
          "--moss": "#7A8F6B",
          background:
            "linear-gradient(180deg, #F5F1E6 0%, #EFE8D8 100%)",
          fontFamily:
            "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif",
        } as React.CSSProperties
      }
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');
        .botanika-serif { font-family: 'Cormorant Garamond', ui-serif, Georgia, serif; }
      `}</style>

      <OpeningGate
        theme="light"
        coupleLabel={`${data.groom.nickName} & ${data.bride.nickName}`}
        guestName={guestName}
        onOpen={() => music.current?.play()}
        background={
          <div className="relative h-full w-full">
            <img
              src={data.gallery[0]?.url ?? HERO_IMG}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <BotanicalCorners />
          </div>
        }
      />
      <MusicToggle ref={music} src={data.settings.musicUrl} theme="light" />

      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <img
          src={data.gallery[0]?.url ?? HERO_IMG}
          alt="Pasangan pengantin"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(243,238,227,0.20) 0%, rgba(243,238,227,0.65) 55%, rgba(243,238,227,1) 100%)",
          }}
        />
        <div className="relative mx-auto flex min-h-[94vh] max-w-md flex-col items-center justify-center px-6 py-24 text-center">
          <BotanicalSprig className="h-10 w-24 text-[var(--moss)]" />
          <p className="mt-4 text-[11px] uppercase tracking-[0.45em] text-[var(--bordeaux)]">
            The Wedding Of
          </p>
          <h1 className="botanika-serif mt-6 text-6xl italic leading-none md:text-7xl text-[var(--charcoal)]">
            {data.groom.nickName}
            <span className="mx-2 text-[var(--gilded)] not-italic">&amp;</span>
            {data.bride.nickName}
          </h1>
          <div className="mt-6 flex items-center gap-3">
            <span className="h-px w-10 bg-[var(--gilded)]/60" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-[var(--moss)]">
              Bersemi
            </span>
            <span className="h-px w-10 bg-[var(--gilded)]/60" />
          </div>
          <p className="botanika-serif mt-6 text-xl italic">
            {firstEvent ? formatDateID(firstEvent.date) : ""}
          </p>
        </div>
      </section>

      {/* QUOTE / GREETING */}
      <section className="relative mx-auto max-w-md px-6 py-20 text-center">
        <Reveal>
          <BotanicalSprig className="mx-auto h-8 w-20 text-[var(--moss)]" />
          <p className="botanika-serif mt-6 text-2xl italic leading-relaxed text-[var(--charcoal)]">
            “{quote}”
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-[var(--bordeaux)]">
            {quoteSource}
          </p>
          <div className="mx-auto mt-10 h-px w-16 bg-[var(--gilded)]/50" />
          <p className="mt-8 text-sm leading-relaxed text-[var(--charcoal)]/80">
            {data.settings.greeting ??
              "Assalamu'alaikum Warahmatullahi Wabarakatuh. Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami."}
          </p>
        </Reveal>
      </section>

      {/* COUPLE */}
      <section className="relative mx-auto max-w-md px-6 py-16">
        <Reveal className="text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--bordeaux)]">
            Mempelai
          </p>
          <h2 className="botanika-serif mt-3 text-4xl italic text-[var(--charcoal)]">
            Calon Pengantin
          </h2>
          <BotanicalSprig className="mx-auto mt-4 h-6 w-16 text-[var(--moss)]" />
        </Reveal>

        <div className="mt-12 space-y-14">
          {[data.bride, data.groom].map((p, i) => (
            <Reveal key={i} className="text-center">
              <div className="relative mx-auto h-44 w-44">
                <div className="absolute inset-0 rounded-full ring-1 ring-[var(--gilded)]/50" />
                <div className="absolute -inset-3 rounded-full border border-dashed border-[var(--moss)]/40" />
                {p.photo ? (
                  <img
                    src={p.photo}
                    alt={p.fullName}
                    loading="lazy"
                    className="relative h-44 w-44 rounded-full object-cover"
                  />
                ) : (
                  <div className="relative h-44 w-44 rounded-full bg-[var(--bordeaux)]/10" />
                )}
              </div>
              <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-[var(--bordeaux)]">
                {i === 0 ? "The Bride" : "The Groom"}
              </p>
              <h3 className="botanika-serif mt-2 text-4xl italic text-[var(--charcoal)]">
                {p.fullName}
              </h3>
              <p className="mt-3 text-xs uppercase tracking-[0.25em] text-[var(--moss)]">
                {i === 0 ? "Putri dari" : "Putra dari"}
              </p>
              <p className="mt-1 text-sm text-[var(--charcoal)]/80">
                {p.fatherName} <span className="mx-1 text-[var(--gilded)]">&amp;</span>{" "}
                {p.motherName}
              </p>
              {p.instagram && (
                <a
                  href={`https://instagram.com/${p.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-xs tracking-wide text-[var(--bordeaux)] underline decoration-dotted underline-offset-4"
                >
                  {p.instagram}
                </a>
              )}
            </Reveal>
          ))}
        </div>
      </section>

      {/* COUNTDOWN */}
      {firstEvent && (
        <section className="mx-auto max-w-md px-6 py-16 text-center">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--bordeaux)]">
              Menghitung Hari
            </p>
            <h2 className="botanika-serif mt-3 text-4xl italic text-[var(--charcoal)]">
              Menuju Hari Bahagia
            </h2>
            <div className="mt-8">
              <Countdown targetIso={targetIso} theme="light" />
            </div>
          </Reveal>
        </section>
      )}

      {/* EVENTS */}
      <section className="mx-auto max-w-md px-6 py-16">
        <Reveal className="text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--bordeaux)]">
            Save the Date
          </p>
          <h2 className="botanika-serif mt-3 text-4xl italic text-[var(--charcoal)]">
            Rangkaian Acara
          </h2>
          <BotanicalSprig className="mx-auto mt-4 h-6 w-16 text-[var(--moss)]" />
        </Reveal>
        <div className="mt-10 space-y-6">
          {data.events.map((ev) => (
            <Reveal key={ev.id}>
              <article className="relative overflow-hidden rounded-lg border border-[var(--moss)]/25 bg-[#FBF8F0]/80 p-7 text-center shadow-[0_1px_0_rgba(0,0,0,0.03)]">
                <span className="pointer-events-none absolute -left-4 -top-4 h-14 w-14 rounded-full bg-[var(--moss)]/10" />
                <span className="pointer-events-none absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-[var(--gilded)]/10" />
                <h3 className="botanika-serif text-3xl italic text-[var(--bordeaux)]">
                  {ev.name}
                </h3>
                <div className="mx-auto my-3 h-px w-10 bg-[var(--gilded)]/60" />
                <p className="text-sm text-[var(--charcoal)]">
                  {formatDateID(ev.date)}
                </p>
                <p className="text-sm text-[var(--charcoal)]/70">
                  {ev.startTime} – {ev.endTime} WIB
                </p>
                <p className="botanika-serif mt-4 text-xl text-[var(--charcoal)]">
                  {ev.venueName}
                </p>
                <p className="mt-1 text-xs text-[var(--charcoal)]/70">
                  {ev.address}
                </p>
                {ev.mapsUrl && (
                  <a
                    href={ev.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-block rounded-full border border-[var(--bordeaux)] px-5 py-1.5 text-[11px] uppercase tracking-[0.3em] text-[var(--bordeaux)] transition hover:bg-[var(--bordeaux)] hover:text-[var(--ivory)]"
                  >
                    Lihat Peta
                  </a>
                )}
              </article>
            </Reveal>
          ))}
          {dresscode && (
            <Reveal>
              <div className="rounded-lg border border-dashed border-[var(--gilded)]/50 bg-[#FBF8F0]/60 p-5 text-center">
                <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--bordeaux)]">
                  Dresscode
                </p>
                <p className="botanika-serif mt-2 text-2xl italic text-[var(--charcoal)]">
                  {dresscode}
                </p>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* LOVE STORY */}
      {data.loveStory.length > 0 && (
        <section className="mx-auto max-w-md px-6 py-16">
          <Reveal className="text-center">
            <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--bordeaux)]">
              Our Story
            </p>
            <h2 className="botanika-serif mt-3 text-4xl italic text-[var(--charcoal)]">
              Kisah Kami
            </h2>
          </Reveal>
          <ol className="relative mt-10 border-l border-[var(--moss)]/40 pl-6">
            {data.loveStory.map((m) => (
              <Reveal as="li" key={m.id} className="mb-8 last:mb-0">
                <span className="absolute -left-[7px] mt-1.5 block h-3 w-3 rounded-full bg-[var(--gilded)]" />
                <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--bordeaux)]">
                  {formatDateID(m.date)}
                </p>
                <h3 className="botanika-serif mt-1 text-2xl italic text-[var(--charcoal)]">
                  {m.title}
                </h3>
                <p className="mt-1 text-sm text-[var(--charcoal)]/80">
                  {m.description}
                </p>
              </Reveal>
            ))}
          </ol>
        </section>
      )}

      {/* GALLERY */}
      {data.gallery.length > 0 && (
        <section className="mx-auto max-w-lg px-6 py-16">
          <Reveal className="text-center">
            <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--bordeaux)]">
              Moments
            </p>
            <h2 className="botanika-serif mt-3 text-4xl italic text-[var(--charcoal)]">
              Galeri
            </h2>
            <BotanicalSprig className="mx-auto mt-4 h-6 w-16 text-[var(--moss)]" />
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {data.gallery.map((g, i) => (
              <Reveal key={g.id}>
                <img
                  src={g.url}
                  alt={g.caption ?? ""}
                  loading="lazy"
                  className={`h-full w-full object-cover ${
                    i % 3 === 0 ? "aspect-[3/4] rounded-tl-[3rem] rounded-br-[3rem]" : "aspect-[3/4] rounded-md"
                  }`}
                />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* GIFTS */}
      {data.gifts.length > 0 && (
        <section className="mx-auto max-w-md px-6 py-16">
          <Reveal className="text-center">
            <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--bordeaux)]">
              Wedding Gift
            </p>
            <h2 className="botanika-serif mt-3 text-4xl italic text-[var(--charcoal)]">
              Tanda Kasih
            </h2>
            <p className="mt-3 text-sm text-[var(--charcoal)]/70">
              Doa terbaik adalah hadiah utama. Bagi yang berkenan:
            </p>
          </Reveal>
          <div className="mt-8 space-y-3">
            {data.gifts.map((g) => (
              <Reveal key={g.id}>
                <div className="rounded-md border border-[var(--moss)]/25 bg-[#FBF8F0]/80 p-5 text-center">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--bordeaux)]">
                    {g.provider}
                  </p>
                  <p className="botanika-serif mt-2 text-2xl text-[var(--charcoal)]">
                    {g.accountNumber}
                  </p>
                  <p className="text-sm text-[var(--charcoal)]/80">
                    a.n. {g.accountName}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* RSVP & WISHES */}
      <section className="mx-auto max-w-md px-6 py-16">
        <Reveal className="text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--bordeaux)]">
            RSVP
          </p>
          <h2 className="botanika-serif mt-3 text-4xl italic text-[var(--charcoal)]">
            Konfirmasi Kehadiran
          </h2>
        </Reveal>
        <div className="mt-8">
          <RsvpForm projectId={projectId} guestName={guestName} theme="light" />
        </div>

        <Reveal className="mt-16 text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--bordeaux)]">
            Ucapan & Doa
          </p>
          <h2 className="botanika-serif mt-3 text-4xl italic text-[var(--charcoal)]">
            Untuk Pengantin
          </h2>
        </Reveal>
        <div className="mt-8">
          <WishesWall projectId={projectId} theme="light" />
        </div>
      </section>

      {/* CLOSING */}
      <footer className="relative mx-auto max-w-md px-6 pb-20 pt-10 text-center">
        <Reveal>
          <BotanicalSprig className="mx-auto h-8 w-20 text-[var(--moss)]" />
          <p className="botanika-serif mt-6 text-xl italic text-[var(--charcoal)]">
            {data.settings.closing ??
              "Merupakan suatu kehormatan apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu."}
          </p>
          <div className="mx-auto mt-8 h-px w-16 bg-[var(--gilded)]/60" />
          <p className="botanika-serif mt-8 text-4xl italic text-[var(--charcoal)]">
            {data.groom.nickName}
            <span className="mx-2 text-[var(--gilded)] not-italic">&amp;</span>
            {data.bride.nickName}
          </p>
          <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-[var(--charcoal)]/60">
            Dibuat dengan ❀ oleh Studio
          </p>
        </Reveal>
      </footer>
    </div>
  );
}

/* --- Botanical ornaments (inline SVG so no assets needed) --- */

function BotanicalSprig({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <path
        d="M2 20 C 30 20, 40 8, 60 20 C 80 32, 90 20, 118 20"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <g fill="currentColor" opacity="0.85">
        <ellipse cx="20" cy="15" rx="5" ry="2" transform="rotate(-25 20 15)" />
        <ellipse cx="40" cy="12" rx="4" ry="1.6" transform="rotate(-15 40 12)" />
        <ellipse cx="60" cy="9" rx="3" ry="1.4" />
        <ellipse cx="80" cy="12" rx="4" ry="1.6" transform="rotate(15 80 12)" />
        <ellipse cx="100" cy="15" rx="5" ry="2" transform="rotate(25 100 15)" />
        <ellipse cx="30" cy="26" rx="4" ry="1.6" transform="rotate(20 30 26)" />
        <ellipse cx="90" cy="26" rx="4" ry="1.6" transform="rotate(-20 90 26)" />
      </g>
      <circle cx="60" cy="20" r="1.6" fill="currentColor" />
    </svg>
  );
}

function BotanicalCorners() {
  return (
    <>
      <svg
        viewBox="0 0 200 200"
        className="pointer-events-none absolute -left-4 -top-4 h-40 w-40 text-[#7A8F6B]/70"
        aria-hidden
      >
        <path
          d="M10 120 C 20 60, 60 20, 120 10"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
        />
        <g fill="currentColor" opacity="0.9">
          <ellipse cx="30" cy="90" rx="10" ry="4" transform="rotate(-45 30 90)" />
          <ellipse cx="55" cy="60" rx="9" ry="3.5" transform="rotate(-30 55 60)" />
          <ellipse cx="85" cy="35" rx="8" ry="3" transform="rotate(-15 85 35)" />
        </g>
      </svg>
      <svg
        viewBox="0 0 200 200"
        className="pointer-events-none absolute -bottom-6 -right-6 h-44 w-44 text-[#B96A4A]/70"
        aria-hidden
      >
        <path
          d="M190 80 C 180 140, 140 180, 80 190"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
        />
        <g fill="currentColor" opacity="0.9">
          <ellipse cx="170" cy="110" rx="10" ry="4" transform="rotate(45 170 110)" />
          <ellipse cx="145" cy="140" rx="9" ry="3.5" transform="rotate(30 145 140)" />
          <ellipse cx="115" cy="165" rx="8" ry="3" transform="rotate(15 115 165)" />
        </g>
      </svg>
    </>
  );
}
