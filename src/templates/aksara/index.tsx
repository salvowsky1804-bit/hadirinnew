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
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=70&auto=format&fit=crop";

export default function AksaraTemplate({ data, guestName, projectId }: TemplateRenderProps) {
  const music = useRef<MusicHandle>(null);
  const firstEvent = data.events[0];
  const targetIso = firstEvent
    ? `${firstEvent.date}T${firstEvent.startTime || "08:00"}:00`
    : new Date().toISOString();

  return (
    <div
      className="min-h-dvh bg-[var(--ivory)] text-[var(--charcoal)]"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <OpeningGate
        theme="light"
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
      <MusicToggle ref={music} src={data.settings.musicUrl} theme="light" />

      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <img
          src={data.gallery[0]?.url ?? HERO_IMG}
          alt="Pasangan pengantin"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--ivory)]/30 via-[var(--ivory)]/60 to-[var(--ivory)]" />
        <div className="relative mx-auto flex min-h-[92vh] max-w-md flex-col items-center justify-center px-6 py-24 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--bordeaux)]">
            The Wedding of
          </p>
          <h1 className="mt-6 font-serif text-5xl italic md:text-6xl">
            {data.groom.nickName}
            <span className="mx-3 text-[var(--gilded)]">&amp;</span>
            {data.bride.nickName}
          </h1>
          <div className="mt-6 h-px w-16 bg-[var(--gilded)]" />
          <p className="mt-6 text-sm tracking-wide">
            {firstEvent ? formatDateID(firstEvent.date) : ""}
          </p>
        </div>
      </section>

      {/* GREETING */}
      <section className="mx-auto max-w-md px-6 py-16 text-center">
        <Reveal>
          <p className="font-serif text-2xl italic">
            بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
          <p className="mt-6 text-sm leading-relaxed opacity-80">
            {data.settings.greeting ??
              "Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan."}
          </p>
        </Reveal>
      </section>

      {/* COUPLE */}
      <section className="mx-auto max-w-md px-6 py-16">
        <Reveal className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--bordeaux)]">
            Mempelai
          </p>
          <h2 className="mt-3 font-serif text-3xl italic">Calon Pengantin</h2>
        </Reveal>
        <div className="mt-10 space-y-12">
          {[data.bride, data.groom].map((p, i) => (
            <Reveal key={i} className="text-center">
              {p.photo && (
                <img
                  src={p.photo}
                  alt={p.fullName}
                  loading="lazy"
                  className="mx-auto h-40 w-40 rounded-full object-cover ring-1 ring-[var(--gilded)]/40"
                />
              )}
              <h3 className="mt-5 font-serif text-3xl italic">{p.fullName}</h3>
              <p className="mt-2 text-sm opacity-70">
                {i === 0 ? "Putri dari" : "Putra dari"}
              </p>
              <p className="text-sm">
                {p.fatherName} & {p.motherName}
              </p>
              {p.instagram && (
                <p className="mt-2 text-xs tracking-wide text-[var(--bordeaux)]">
                  {p.instagram}
                </p>
              )}
            </Reveal>
          ))}
        </div>
      </section>

      {/* COUNTDOWN */}
      {firstEvent && (
        <section className="mx-auto max-w-md px-6 py-16 text-center">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--bordeaux)]">
              Menghitung Hari
            </p>
            <h2 className="mt-3 font-serif text-3xl italic">
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
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--bordeaux)]">
            Save the Date
          </p>
          <h2 className="mt-3 font-serif text-3xl italic">Rangkaian Acara</h2>
        </Reveal>
        <div className="mt-10 space-y-6">
          {data.events.map((ev) => (
            <Reveal key={ev.id}>
              <article className="rounded-lg border border-[var(--bordeaux)]/15 bg-white/60 p-6 text-center">
                <h3 className="font-serif text-2xl italic text-[var(--bordeaux)]">
                  {ev.name}
                </h3>
                <p className="mt-3 text-sm">{formatDateID(ev.date)}</p>
                <p className="text-sm opacity-80">
                  {ev.startTime} – {ev.endTime} WIB
                </p>
                <div className="my-4 h-px w-12 bg-[var(--gilded)] mx-auto" />
                <p className="font-serif text-lg">{ev.venueName}</p>
                <p className="text-xs opacity-70">{ev.address}</p>
                {ev.mapsUrl && (
                  <a
                    href={ev.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-block rounded-full border border-[var(--bordeaux)] px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] text-[var(--bordeaux)] hover:bg-[var(--bordeaux)] hover:text-[var(--ivory)]"
                  >
                    Lihat Peta
                  </a>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* LOVE STORY */}
      {data.loveStory.length > 0 && (
        <section className="mx-auto max-w-md px-6 py-16">
          <Reveal className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--bordeaux)]">
              Our Story
            </p>
            <h2 className="mt-3 font-serif text-3xl italic">Kisah Kami</h2>
          </Reveal>
          <ol className="relative mt-10 border-l border-[var(--gilded)]/40 pl-6">
            {data.loveStory.map((m) => (
              <Reveal as="li" key={m.id} className="mb-8 last:mb-0">
                <span className="absolute -left-[7px] mt-1.5 block h-3 w-3 rounded-full bg-[var(--gilded)]" />
                <p className="text-xs uppercase tracking-[0.25em] text-[var(--bordeaux)]">
                  {formatDateID(m.date)}
                </p>
                <h3 className="mt-1 font-serif text-xl italic">{m.title}</h3>
                <p className="mt-1 text-sm opacity-80">{m.description}</p>
              </Reveal>
            ))}
          </ol>
        </section>
      )}

      {/* GALLERY */}
      {data.gallery.length > 0 && (
        <section className="mx-auto max-w-lg px-6 py-16">
          <Reveal className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--bordeaux)]">
              Moments
            </p>
            <h2 className="mt-3 font-serif text-3xl italic">Galeri</h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {data.gallery.map((g) => (
              <Reveal key={g.id}>
                <img
                  src={g.url}
                  alt={g.caption ?? ""}
                  loading="lazy"
                  className="aspect-[3/4] h-full w-full rounded-md object-cover"
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
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--bordeaux)]">
              Wedding Gift
            </p>
            <h2 className="mt-3 font-serif text-3xl italic">Tanda Kasih</h2>
            <p className="mt-3 text-sm opacity-70">
              Doa terbaik adalah hadiah utama. Bagi yang berkenan, dapat melalui:
            </p>
          </Reveal>
          <div className="mt-8 space-y-3">
            {data.gifts.map((g) => (
              <Reveal key={g.id}>
                <div className="rounded-md border border-[var(--bordeaux)]/15 bg-white/70 p-4 text-center">
                  <p className="text-xs uppercase tracking-[0.25em] text-[var(--bordeaux)]">
                    {g.provider}
                  </p>
                  <p className="mt-2 font-serif text-xl">{g.accountNumber}</p>
                  <p className="text-sm opacity-80">a.n. {g.accountName}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* RSVP & WISHES */}
      <section className="mx-auto max-w-md px-6 py-16">
        <Reveal className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--bordeaux)]">
            RSVP
          </p>
          <h2 className="mt-3 font-serif text-3xl italic">Konfirmasi Kehadiran</h2>
        </Reveal>
        <div className="mt-8">
          <RsvpForm projectId={projectId} guestName={guestName} theme="light" />
        </div>

        <Reveal className="mt-16 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--bordeaux)]">
            Ucapan & Doa
          </p>
          <h2 className="mt-3 font-serif text-3xl italic">Untuk Pengantin</h2>
        </Reveal>
        <div className="mt-8">
          <WishesWall projectId={projectId} theme="light" />
        </div>
      </section>

      {/* CLOSING */}
      <footer className="mx-auto max-w-md px-6 pb-20 pt-10 text-center">
        <Reveal>
          <p className="font-serif text-xl italic">
            {data.settings.closing ??
              "Merupakan suatu kehormatan apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu."}
          </p>
          <div className="mx-auto mt-8 h-px w-16 bg-[var(--gilded)]" />
          <p className="mt-8 font-serif text-3xl italic">
            {data.groom.nickName} & {data.bride.nickName}
          </p>
          <p className="mt-6 text-[11px] uppercase tracking-[0.3em] opacity-60">
            Dibuat dengan ❀ oleh Studio
          </p>
        </Reveal>
      </footer>
    </div>
  );
}
