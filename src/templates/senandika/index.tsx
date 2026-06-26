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
  "https://images.unsplash.com/photo-1606490194859-07c18c9f0968?w=1400&q=70&auto=format&fit=crop";

function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (u.pathname.startsWith("/embed/")) return url;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.replace(/\D/g, "");
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
    return url;
  } catch {
    return null;
  }
}

export default function SenandikaTemplate({ data, guestName, projectId }: TemplateRenderProps) {
  const music = useRef<MusicHandle>(null);
  const verse = (data.custom.favoriteVerse as string | undefined) ?? "";
  const videoRaw = (data.custom.preweddingVideoUrl as string | undefined) ?? "";
  const videoEmbed = videoRaw ? toEmbedUrl(videoRaw) : null;
  const firstEvent = data.events[0];
  const targetIso = firstEvent
    ? `${firstEvent.date}T${firstEvent.startTime || "08:00"}:00`
    : new Date().toISOString();

  return (
    <div
      className="min-h-dvh bg-[#1a1612] text-[var(--ivory)]"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <OpeningGate
        theme="dark"
        coupleLabel={`${data.groom.nickName} & ${data.bride.nickName}`}
        guestName={guestName}
        onOpen={() => music.current?.play()}
        background={
          <img
            src={data.gallery[0]?.url ?? HERO_IMG}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        }
      />
      <MusicToggle ref={music} src={data.settings.musicUrl} theme="dark" />

      {/* HERO — editorial split */}
      <section className="relative isolate overflow-hidden">
        <img
          src={data.gallery[0]?.url ?? HERO_IMG}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-[#1a1612]" />
        <div className="relative mx-auto flex min-h-[100vh] max-w-2xl flex-col justify-end px-6 pb-20 pt-32">
          <p className="text-[10px] uppercase tracking-[0.5em] text-[var(--gilded)]">
            A Quiet Soliloquy · {firstEvent ? new Date(firstEvent.date).getFullYear() : ""}
          </p>
          <h1 className="mt-6 font-serif text-6xl leading-[0.95] italic md:text-7xl">
            {data.groom.nickName}
            <br />
            <span className="text-[var(--gilded)]">&amp;</span> {data.bride.nickName}
          </h1>
          <div className="mt-8 flex items-center gap-4 text-xs uppercase tracking-[0.35em] opacity-80">
            <span>{firstEvent ? formatDateID(firstEvent.date) : ""}</span>
            <span className="h-px flex-1 bg-[var(--gilded)]/50" />
            <span>{firstEvent?.venueName.split(",")[0]}</span>
          </div>
        </div>
      </section>

      {/* VERSE (custom field) */}
      {verse && (
        <section className="mx-auto max-w-2xl px-6 py-24 text-center">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--gilded)]">
              Verse
            </p>
            <blockquote className="mt-8 font-serif text-2xl leading-relaxed italic md:text-3xl">
              “{verse}”
            </blockquote>
          </Reveal>
        </section>
      )}

      {/* COUPLE */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <Reveal className="text-center">
          <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--gilded)]">
            The Couple
          </p>
          <h2 className="mt-4 font-serif text-4xl italic">Dua Cerita, Satu Suara</h2>
        </Reveal>
        <div className="mt-14 grid gap-12 md:grid-cols-2">
          {[data.groom, data.bride].map((p, i) => (
            <Reveal key={i} delay={i * 100}>
              {p.photo && (
                <img
                  src={p.photo}
                  alt={p.fullName}
                  loading="lazy"
                  className="aspect-[3/4] w-full rounded-sm object-cover grayscale-[15%]"
                />
              )}
              <p className="mt-6 text-[10px] uppercase tracking-[0.4em] text-[var(--gilded)]">
                {i === 0 ? "The Groom" : "The Bride"}
              </p>
              <h3 className="mt-3 font-serif text-3xl italic">{p.fullName}</h3>
              <p className="mt-3 text-sm leading-relaxed opacity-80">
                {i === 0 ? "Putra dari" : "Putri dari"} {p.fatherName} & {p.motherName}
              </p>
              {p.instagram && (
                <p className="mt-2 text-xs text-[var(--gilded)]">{p.instagram}</p>
              )}
            </Reveal>
          ))}
        </div>
      </section>

      {/* PREWEDDING VIDEO (custom field) */}
      {videoEmbed && (
        <section className="mx-auto max-w-4xl px-6 py-20">
          <Reveal className="text-center">
            <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--gilded)]">
              Cinematic
            </p>
            <h2 className="mt-4 font-serif text-4xl italic">Prewedding Film</h2>
          </Reveal>
          <Reveal className="mt-10 overflow-hidden rounded-sm ring-1 ring-[var(--gilded)]/30">
            <div className="aspect-video w-full">
              <iframe
                src={videoEmbed}
                title="Prewedding video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </Reveal>
        </section>
      )}

      {/* COUNTDOWN */}
      {firstEvent && (
        <section className="mx-auto max-w-2xl px-6 py-20 text-center">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--gilded)]">
              Counting Down
            </p>
            <h2 className="mt-4 font-serif text-4xl italic">Menuju Hari Itu</h2>
            <div className="mt-10">
              <Countdown targetIso={targetIso} theme="dark" />
            </div>
          </Reveal>
        </section>
      )}

      {/* EVENTS */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <Reveal className="text-center">
          <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--gilded)]">
            Itinerary
          </p>
          <h2 className="mt-4 font-serif text-4xl italic">Rangkaian Acara</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {data.events.map((ev, i) => (
            <Reveal key={ev.id} delay={i * 80}>
              <article className="h-full border border-[var(--gilded)]/25 bg-white/[0.03] p-6">
                <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--gilded)]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-serif text-2xl italic">{ev.name}</h3>
                <p className="mt-3 text-sm opacity-80">{formatDateID(ev.date)}</p>
                <p className="text-sm opacity-80">
                  {ev.startTime} – {ev.endTime} WIB
                </p>
                <div className="my-4 h-px w-10 bg-[var(--gilded)]/60" />
                <p className="font-serif text-lg">{ev.venueName}</p>
                <p className="text-xs opacity-70">{ev.address}</p>
                {ev.mapsUrl && (
                  <a
                    href={ev.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-block border border-[var(--gilded)] px-4 py-1.5 text-[11px] uppercase tracking-[0.3em] text-[var(--gilded)] hover:bg-[var(--gilded)] hover:text-[#1a1612]"
                  >
                    Open Map
                  </a>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* LOVE STORY */}
      {data.loveStory.length > 0 && (
        <section className="mx-auto max-w-2xl px-6 py-20">
          <Reveal className="text-center">
            <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--gilded)]">
              Chapters
            </p>
            <h2 className="mt-4 font-serif text-4xl italic">Kisah Kami</h2>
          </Reveal>
          <div className="mt-12 space-y-12">
            {data.loveStory.map((m, i) => (
              <Reveal key={m.id} delay={i * 60}>
                <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--gilded)]">
                  {formatDateID(m.date)}
                </p>
                <h3 className="mt-2 font-serif text-2xl italic">{m.title}</h3>
                <p className="mt-3 text-sm leading-relaxed opacity-80">{m.description}</p>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* GALLERY */}
      {data.gallery.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 py-20">
          <Reveal className="text-center">
            <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--gilded)]">
              Gallery
            </p>
            <h2 className="mt-4 font-serif text-4xl italic">Bingkai-bingkai</h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
            {data.gallery.map((g, i) => (
              <Reveal key={g.id} delay={i * 40}>
                <img
                  src={g.url}
                  alt={g.caption ?? ""}
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover grayscale-[15%] transition hover:grayscale-0"
                />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* GIFTS */}
      {data.gifts.length > 0 && (
        <section className="mx-auto max-w-2xl px-6 py-20">
          <Reveal className="text-center">
            <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--gilded)]">
              Wedding Gift
            </p>
            <h2 className="mt-4 font-serif text-4xl italic">Tanda Kasih</h2>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {data.gifts.map((g) => (
              <Reveal key={g.id}>
                <div className="border border-[var(--gilded)]/25 bg-white/[0.03] p-5 text-center">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--gilded)]">
                    {g.provider}
                  </p>
                  <p className="mt-3 font-serif text-xl">{g.accountNumber}</p>
                  <p className="text-sm opacity-80">a.n. {g.accountName}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* RSVP & WISHES */}
      <section className="mx-auto max-w-xl px-6 py-20">
        <Reveal className="text-center">
          <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--gilded)]">
            RSVP
          </p>
          <h2 className="mt-4 font-serif text-4xl italic">Konfirmasi Kehadiran</h2>
        </Reveal>
        <div className="mt-10">
          <RsvpForm projectId={projectId} guestName={guestName} theme="dark" />
        </div>

        <Reveal className="mt-20 text-center">
          <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--gilded)]">
            Wishes
          </p>
          <h2 className="mt-4 font-serif text-4xl italic">Ucapan & Doa</h2>
        </Reveal>
        <div className="mt-10">
          <WishesWall projectId={projectId} theme="dark" />
        </div>
      </section>

      <footer className="mx-auto max-w-2xl px-6 pb-20 pt-10 text-center">
        <Reveal>
          <p className="font-serif text-xl italic opacity-90">
            {data.settings.closing ??
              "Sebuah kehormatan apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan restu."}
          </p>
          <div className="mx-auto mt-10 h-px w-16 bg-[var(--gilded)]" />
          <p className="mt-8 font-serif text-3xl italic">
            {data.groom.nickName} & {data.bride.nickName}
          </p>
          <p className="mt-6 text-[10px] uppercase tracking-[0.4em] opacity-60">
            Crafted in Senandika
          </p>
        </Reveal>
      </footer>
    </div>
  );
}
