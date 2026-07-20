import { useEffect, useRef, useState } from "react";
import type { TemplateRenderProps } from "@/types/template";
import { MusicToggle, type MusicHandle } from "../_shared/MusicToggle";
import { Reveal } from "../_shared/Reveal";
import { Countdown } from "../_shared/Countdown";
import { RsvpForm } from "../_shared/RsvpForm";
import { WishesWall } from "../_shared/WishesWall";
import { formatDateID } from "../_shared/utils";
import heroArt from "@/assets/nuswantara-hero.jpg";
import pattern from "@/assets/nuswantara-pattern.jpg";

/**
 * Nuswantara — traditional Javanese cinematic invitation.
 * Cover replays the reference video: seigaiha pattern reveals the joglo,
 * the landscape and wayang fade in, then couple name and date settle.
 */
export default function NuswantaraTemplate({
  data,
  guestName,
  projectId,
}: TemplateRenderProps) {
  const music = useRef<MusicHandle>(null);
  const [opened, setOpened] = useState(false);
  const firstEvent = data.events[0];
  const targetIso = firstEvent
    ? `${firstEvent.date}T${firstEvent.startTime || "08:00"}:00`
    : new Date().toISOString();

  const quote =
    (data.custom?.quote as string | undefined) ??
    "Kalih manah ingkang tumemen, sami sesarengan nggayuh gesang ingkang mulya.";
  const quoteSource =
    (data.custom?.quoteSource as string | undefined) ?? "— Piwulang Jawi";
  const filosofi = data.custom?.filosofi as string | undefined;
  const dresscode = data.custom?.dresscode as string | undefined;

  useEffect(() => {
    if (!opened) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [opened]);

  const dateStr = firstEvent
    ? formatDateID(firstEvent.date).replace(/\s+/g, " . ")
    : "";

  return (
    <div
      className="min-h-dvh text-[#3a2b23]"
      style={
        {
          "--ivory": "#F5EDE1",
          "--charcoal": "#3a2b23",
          "--bordeaux": "#8f4a3a",
          "--gilded": "#b96a4a",
          backgroundColor: "#F7EFE3",
          backgroundImage: `url(${pattern})`,
          backgroundSize: "360px 360px",
          fontFamily:
            "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif",
        } as React.CSSProperties
      }
    >
      <style>{`
        .nus-serif { font-family: 'Cormorant Garamond', ui-serif, Georgia, serif; }
        @keyframes nus-rise { from { transform: translateY(40px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        @keyframes nus-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes nus-kenburns { from { transform: scale(1.06) } to { transform: scale(1.0) } }
        .nus-gate-art { animation: nus-kenburns 12s ease-out both; }
        .nus-gate-title { animation: nus-fade 1400ms ease-out 700ms both; }
        .nus-gate-date  { animation: nus-fade 1400ms ease-out 1400ms both; }
        .nus-gate-btn   { animation: nus-fade 1400ms ease-out 2000ms both; }
      `}</style>

      {/* CINEMATIC COVER GATE */}
      {!opened && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Pembuka undangan"
          className="fixed inset-0 z-50 overflow-hidden bg-[#F7EFE3]"
        >
          <div className="relative mx-auto h-full max-w-md">
            <img
              src={heroArt}
              alt=""
              className="nus-gate-art absolute inset-0 h-full w-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(247,239,227,0.10) 0%, rgba(247,239,227,0.35) 40%, rgba(247,239,227,0.55) 65%, rgba(247,239,227,0.85) 100%)",
              }}
            />
            <div className="relative flex h-full flex-col items-center justify-center px-8 text-center">
              <div className="mt-[38%]" />
              <p className="nus-gate-title text-[11px] uppercase tracking-[0.45em] text-[#8f4a3a]">
                The Wedding Of
              </p>
              <h1 className="nus-serif nus-gate-title mt-3 text-5xl italic leading-none text-[#8f4a3a] md:text-6xl">
                {data.groom.nickName}
                <span className="mx-2 text-[#b96a4a] not-italic">&amp;</span>
                {data.bride.nickName}
              </h1>
              <p className="nus-gate-date mt-4 text-sm tracking-[0.35em] text-[#3a2b23]">
                {dateStr}
              </p>

              <div className="flex-1" />
              <div className="nus-gate-btn mb-6 flex flex-col items-center">
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#3a2b23]/70">
                  Kepada Yth.
                </p>
                <p className="nus-serif mt-1 text-xl italic">
                  {guestName ?? "Bapak / Ibu / Saudara / i"}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setOpened(true);
                    music.current?.play();
                  }}
                  className="mt-6 rounded-full bg-[#8f4a3a] px-8 py-3 text-[11px] font-medium uppercase tracking-[0.35em] text-[#F7EFE3] shadow-lg transition hover:bg-[#7a3f31]"
                >
                  ✦ Buka Undangan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <MusicToggle ref={music} src={data.settings.musicUrl} theme="light" />

      {/* HERO STILL */}
      <section className="relative isolate overflow-hidden">
        <div className="relative mx-auto max-w-md">
          <img
            src={heroArt}
            alt="Ilustrasi joglo Jawa"
            className="h-auto w-full"
            loading="eager"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
            style={{
              background:
                "linear-gradient(180deg, rgba(247,239,227,0) 0%, #F7EFE3 100%)",
            }}
          />
        </div>
        <div className="mx-auto -mt-16 max-w-md px-8 text-center">
          <p className="text-[11px] uppercase tracking-[0.45em] text-[#8f4a3a]">
            The Wedding Of
          </p>
          <h2 className="nus-serif mt-3 text-5xl italic leading-none text-[#8f4a3a]">
            {data.groom.nickName}
            <span className="mx-2 text-[#b96a4a] not-italic">&amp;</span>
            {data.bride.nickName}
          </h2>
          <p className="mt-4 text-sm tracking-[0.35em] text-[#3a2b23]">
            {dateStr}
          </p>
        </div>
      </section>

      {/* QUOTE */}
      <section className="mx-auto max-w-md px-8 py-20 text-center">
        <Reveal>
          <JavaOrnament className="mx-auto h-8 w-24 text-[#b96a4a]" />
          <p className="nus-serif mt-6 text-2xl italic leading-relaxed text-[#3a2b23]">
            “{quote}”
          </p>
          <p className="mt-3 text-xs uppercase tracking-[0.3em] text-[#8f4a3a]">
            {quoteSource}
          </p>
          {filosofi && (
            <>
              <div className="mx-auto mt-10 h-px w-16 bg-[#b96a4a]/60" />
              <p className="mt-8 whitespace-pre-line text-sm leading-relaxed text-[#3a2b23]/85">
                {filosofi}
              </p>
            </>
          )}
          <p className="mt-8 text-sm leading-relaxed text-[#3a2b23]/85">
            {data.settings.greeting ??
              "Assalamu'alaikum Warahmatullahi Wabarakatuh. Kanthi ngraosaken kabegjan, kula sabrayat ngaturi rawuh Panjenengan wonten ing pahargyan pawiwahan putra-putri kula."}
          </p>
        </Reveal>
      </section>

      {/* COUPLE */}
      <section className="mx-auto max-w-md px-8 py-16">
        <Reveal className="text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#8f4a3a]">
            Mempelai
          </p>
          <h2 className="nus-serif mt-3 text-4xl italic text-[#8f4a3a]">
            Calon Pengantin
          </h2>
          <JavaOrnament className="mx-auto mt-4 h-6 w-20 text-[#b96a4a]" />
        </Reveal>

        <div className="mt-12 space-y-14">
          {[data.bride, data.groom].map((p, i) => (
            <Reveal key={i} className="text-center">
              <div className="relative mx-auto h-44 w-44">
                <div className="absolute -inset-3 rounded-full border border-dashed border-[#b96a4a]/50" />
                {p.photo ? (
                  <img
                    src={p.photo}
                    alt={p.fullName}
                    loading="lazy"
                    className="relative h-44 w-44 rounded-full object-cover ring-1 ring-[#b96a4a]/60"
                  />
                ) : (
                  <div className="relative h-44 w-44 rounded-full bg-[#8f4a3a]/10 ring-1 ring-[#b96a4a]/50" />
                )}
              </div>
              <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-[#8f4a3a]">
                {i === 0 ? "The Bride" : "The Groom"}
              </p>
              <h3 className="nus-serif mt-2 text-4xl italic text-[#3a2b23]">
                {p.fullName}
              </h3>
              <p className="mt-3 text-xs uppercase tracking-[0.25em] text-[#b96a4a]">
                {i === 0 ? "Putri dari" : "Putra dari"}
              </p>
              <p className="mt-1 text-sm text-[#3a2b23]/80">
                {p.fatherName}
                <span className="mx-1 text-[#b96a4a]">&amp;</span>
                {p.motherName}
              </p>
              {p.instagram && (
                <a
                  href={`https://instagram.com/${p.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-xs tracking-wide text-[#8f4a3a] underline decoration-dotted underline-offset-4"
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
        <section className="mx-auto max-w-md px-8 py-16 text-center">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#8f4a3a]">
              Menghitung Hari
            </p>
            <h2 className="nus-serif mt-3 text-4xl italic text-[#8f4a3a]">
              Menuju Hari Bahagia
            </h2>
            <div className="mt-8">
              <Countdown targetIso={targetIso} theme="light" />
            </div>
          </Reveal>
        </section>
      )}

      {/* EVENTS */}
      <section className="mx-auto max-w-md px-8 py-16">
        <Reveal className="text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#8f4a3a]">
            Save the Date
          </p>
          <h2 className="nus-serif mt-3 text-4xl italic text-[#8f4a3a]">
            Rangkaian Acara
          </h2>
          <JavaOrnament className="mx-auto mt-4 h-6 w-20 text-[#b96a4a]" />
        </Reveal>
        <div className="mt-10 space-y-6">
          {data.events.map((ev) => (
            <Reveal key={ev.id}>
              <article className="relative overflow-hidden rounded-lg border border-[#b96a4a]/25 bg-[#FBF4E7]/85 p-7 text-center">
                <h3 className="nus-serif text-3xl italic text-[#8f4a3a]">
                  {ev.name}
                </h3>
                <div className="mx-auto my-3 h-px w-10 bg-[#b96a4a]/60" />
                <p className="text-sm text-[#3a2b23]">
                  {formatDateID(ev.date)}
                </p>
                <p className="text-sm text-[#3a2b23]/70">
                  {ev.startTime} – {ev.endTime} WIB
                </p>
                <p className="nus-serif mt-4 text-xl text-[#3a2b23]">
                  {ev.venueName}
                </p>
                <p className="mt-1 text-xs text-[#3a2b23]/70">{ev.address}</p>
                {ev.mapsUrl && (
                  <a
                    href={ev.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-block rounded-full border border-[#8f4a3a] px-5 py-1.5 text-[11px] uppercase tracking-[0.3em] text-[#8f4a3a] transition hover:bg-[#8f4a3a] hover:text-[#F7EFE3]"
                  >
                    Lihat Peta
                  </a>
                )}
              </article>
            </Reveal>
          ))}
          {dresscode && (
            <Reveal>
              <div className="rounded-lg border border-dashed border-[#b96a4a]/50 bg-[#FBF4E7]/70 p-5 text-center">
                <p className="text-[11px] uppercase tracking-[0.35em] text-[#8f4a3a]">
                  Dresscode
                </p>
                <p className="nus-serif mt-2 text-2xl italic text-[#3a2b23]">
                  {dresscode}
                </p>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* LOVE STORY */}
      {data.loveStory.length > 0 && (
        <section className="mx-auto max-w-md px-8 py-16">
          <Reveal className="text-center">
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#8f4a3a]">
              Our Story
            </p>
            <h2 className="nus-serif mt-3 text-4xl italic text-[#8f4a3a]">
              Kisah Kami
            </h2>
          </Reveal>
          <ol className="relative mt-10 border-l border-[#b96a4a]/40 pl-6">
            {data.loveStory.map((m) => (
              <Reveal as="li" key={m.id} className="mb-8 last:mb-0">
                <span className="absolute -left-[7px] mt-1.5 block h-3 w-3 rounded-full bg-[#b96a4a]" />
                <p className="text-[11px] uppercase tracking-[0.3em] text-[#8f4a3a]">
                  {formatDateID(m.date)}
                </p>
                <h3 className="nus-serif mt-1 text-2xl italic text-[#3a2b23]">
                  {m.title}
                </h3>
                <p className="mt-1 text-sm text-[#3a2b23]/80">
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
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#8f4a3a]">
              Moments
            </p>
            <h2 className="nus-serif mt-3 text-4xl italic text-[#8f4a3a]">
              Galeri
            </h2>
            <JavaOrnament className="mx-auto mt-4 h-6 w-20 text-[#b96a4a]" />
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {data.gallery.map((g, i) => (
              <Reveal key={g.id}>
                <img
                  src={g.url}
                  alt={g.caption ?? ""}
                  loading="lazy"
                  className={`h-full w-full object-cover aspect-[3/4] ${
                    i % 3 === 0
                      ? "rounded-tl-[3rem] rounded-br-[3rem]"
                      : "rounded-md"
                  }`}
                />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* GIFTS */}
      {data.gifts.length > 0 && (
        <section className="mx-auto max-w-md px-8 py-16">
          <Reveal className="text-center">
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#8f4a3a]">
              Wedding Gift
            </p>
            <h2 className="nus-serif mt-3 text-4xl italic text-[#8f4a3a]">
              Tanda Kasih
            </h2>
            <p className="mt-3 text-sm text-[#3a2b23]/70">
              Doa terbaik adalah hadiah utama. Bagi yang berkenan:
            </p>
          </Reveal>
          <div className="mt-8 space-y-3">
            {data.gifts.map((g) => (
              <Reveal key={g.id}>
                <div className="rounded-md border border-[#b96a4a]/25 bg-[#FBF4E7]/85 p-5 text-center">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-[#8f4a3a]">
                    {g.provider}
                  </p>
                  <p className="nus-serif mt-2 text-2xl text-[#3a2b23]">
                    {g.accountNumber}
                  </p>
                  <p className="text-sm text-[#3a2b23]/80">
                    a.n. {g.accountName}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* RSVP & WISHES */}
      <section className="mx-auto max-w-md px-8 py-16">
        <Reveal className="text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#8f4a3a]">
            RSVP
          </p>
          <h2 className="nus-serif mt-3 text-4xl italic text-[#8f4a3a]">
            Konfirmasi Kehadiran
          </h2>
        </Reveal>
        <div className="mt-8">
          <RsvpForm projectId={projectId} guestName={guestName} theme="light" />
        </div>

        <Reveal className="mt-16 text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#8f4a3a]">
            Ucapan & Doa
          </p>
          <h2 className="nus-serif mt-3 text-4xl italic text-[#8f4a3a]">
            Untuk Pengantin
          </h2>
        </Reveal>
        <div className="mt-8">
          <WishesWall projectId={projectId} theme="light" />
        </div>
      </section>

      {/* CLOSING */}
      <footer className="relative mx-auto max-w-md px-8 pb-20 pt-10 text-center">
        <Reveal>
          <JavaOrnament className="mx-auto h-8 w-24 text-[#b96a4a]" />
          <p className="nus-serif mt-6 text-xl italic text-[#3a2b23]">
            {data.settings.closing ??
              "Sugeng rawuh, matur nuwun awit rawuh saha pangestunipun."}
          </p>
          <div className="mx-auto mt-8 h-px w-16 bg-[#b96a4a]/60" />
          <p className="nus-serif mt-8 text-4xl italic text-[#8f4a3a]">
            {data.groom.nickName}
            <span className="mx-2 text-[#b96a4a] not-italic">&amp;</span>
            {data.bride.nickName}
          </p>
          <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-[#3a2b23]/60">
            Dibuat dengan ❀ oleh Studio
          </p>
        </Reveal>
      </footer>
    </div>
  );
}

/* Javanese-style ornament (inline SVG) */
function JavaOrnament({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <path
        d="M2 12 H45 M75 12 H118"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M45 12 C50 4, 55 4, 60 12 C65 20, 70 20, 75 12"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      <circle cx="60" cy="12" r="2" fill="currentColor" />
      <circle cx="6" cy="12" r="1.4" fill="currentColor" />
      <circle cx="114" cy="12" r="1.4" fill="currentColor" />
    </svg>
  );
}