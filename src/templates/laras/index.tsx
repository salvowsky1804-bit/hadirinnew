import { useRef } from "react";
import type { TemplateRenderProps } from "@/types/template";
import { Countdown } from "../_shared/Countdown";
import { MusicToggle, type MusicHandle } from "../_shared/MusicToggle";
import { OpeningGate } from "../_shared/OpeningGate";
import { Reveal } from "../_shared/Reveal";
import { RsvpForm } from "../_shared/RsvpForm";
import { WishesWall } from "../_shared/WishesWall";
import { formatDateID } from "../_shared/utils";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1400&q=75&auto=format&fit=crop";

function SectionTitle({ label, title }: { label: string; title: string }) {
  return (
    <div className="text-center">
      <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-sage">
        {label}
      </p>
      <h2 className="mt-3 font-serif text-4xl font-light text-charcoal md:text-5xl">
        {title}
      </h2>
      <span className="mx-auto mt-5 block h-px w-10 bg-gilded" />
    </div>
  );
}

export default function LarasTemplate({
  data,
  guestName,
  projectId,
}: TemplateRenderProps) {
  const music = useRef<MusicHandle>(null);
  const firstEvent = data.events[0];
  const targetIso = firstEvent
    ? `${firstEvent.date}T${firstEvent.startTime || "08:00"}:00`
    : new Date().toISOString();
  const heroImage = data.gallery[0]?.url ?? data.bride.photo ?? data.groom.photo ?? FALLBACK_IMAGE;
  const quote =
    (data.custom?.quote as string | undefined) ??
    "Di antara banyaknya langkah, kami memilih untuk berjalan pulang bersama.";

  return (
    <div className="min-h-dvh bg-ivory font-sans text-charcoal">
      <OpeningGate
        theme="light"
        coupleLabel={`${data.groom.nickName} & ${data.bride.nickName}`}
        guestName={guestName}
        onOpen={() => music.current?.play()}
        background={
          <img
            src={heroImage}
            alt=""
            className="h-full w-full object-cover"
          />
        }
      />
      <MusicToggle ref={music} src={data.settings.musicUrl} theme="light" />

      <main className="overflow-hidden">
        <section className="relative flex min-h-[92svh] items-end">
          <img
            src={heroImage}
            alt={`Pernikahan ${data.groom.nickName} dan ${data.bride.nickName}`}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent" />
          <div className="relative mx-auto w-full max-w-3xl px-6 pb-16 text-ivory md:px-10 md:pb-20">
            <Reveal>
              <p className="text-[10px] font-medium uppercase tracking-[0.3em]">
                The Wedding Of
              </p>
              <h1 className="mt-4 max-w-2xl font-serif text-6xl font-light leading-none md:text-8xl">
                {data.groom.nickName} <span className="italic">&amp;</span>{" "}
                {data.bride.nickName}
              </h1>
              <p className="mt-6 border-l border-ivory/50 pl-4 text-sm uppercase tracking-[0.18em]">
                {firstEvent ? formatDateID(firstEvent.date) : "Hari Bahagia Kami"}
              </p>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto flex min-h-[70svh] max-w-2xl items-center px-6 py-20 text-center">
          <Reveal>
            <p className="font-serif text-3xl font-light italic leading-relaxed md:text-4xl">
              “{quote}”
            </p>
            <span className="mx-auto mt-8 block h-px w-10 bg-gilded" />
            <p className="mx-auto mt-8 max-w-lg text-sm leading-7 text-charcoal/70">
              {data.settings.greeting ??
                "Dengan penuh rasa syukur, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan menjadi bagian dari hari bahagia kami."}
            </p>
          </Reveal>
        </section>

        <section className="bg-cream px-6 py-20 md:py-28">
          <div className="mx-auto max-w-3xl">
            <SectionTitle label="Bride & Groom" title="Kami yang Berbahagia" />
            <div className="mt-14 grid gap-14 md:grid-cols-2 md:gap-8">
              {[data.bride, data.groom].map((person, index) => (
                <Reveal key={`${person.fullName}-${index}`} className="text-center">
                  <div className="mx-auto aspect-[4/5] max-w-xs overflow-hidden rounded-sm bg-sage/10">
                    {person.photo ? (
                      <img
                        src={person.photo}
                        alt={person.fullName}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <p className="mt-7 text-[10px] uppercase tracking-[0.25em] text-sage">
                    {index === 0 ? "The Bride" : "The Groom"}
                  </p>
                  <h3 className="mt-2 font-serif text-3xl font-light">{person.fullName}</h3>
                  <p className="mt-3 text-sm leading-6 text-charcoal/65">
                    {index === 0 ? "Putri dari" : "Putra dari"}
                    <br />
                    {person.fatherName} &amp; {person.motherName}
                  </p>
                  {person.instagram ? (
                    <a
                      href={`https://instagram.com/${person.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-block text-xs text-sage underline underline-offset-4"
                    >
                      {person.instagram}
                    </a>
                  ) : null}
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {firstEvent ? (
          <section className="mx-auto max-w-3xl px-6 py-20 text-center md:py-28">
            <Reveal>
              <SectionTitle label="Save the Date" title="Menuju Hari Bahagia" />
              <div className="mt-10">
                <Countdown targetIso={targetIso} theme="light" />
              </div>
            </Reveal>
          </section>
        ) : null}

        <section className="bg-charcoal px-6 py-20 text-ivory md:py-28">
          <div className="mx-auto max-w-3xl">
            <SectionTitle label="Wedding Day" title="Rangkaian Acara" />
            <div className="mt-12 divide-y divide-ivory/20 border-y border-ivory/20">
              {data.events.map((event) => (
                <Reveal key={event.id}>
                  <article className="grid gap-5 py-9 md:grid-cols-[0.8fr_1.2fr] md:gap-10">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-gilded">
                        {formatDateID(event.date)}
                      </p>
                      <h3 className="mt-2 font-serif text-3xl font-light">{event.name}</h3>
                      <p className="mt-2 text-sm text-ivory/65">
                        {event.startTime} – {event.endTime} WIB
                      </p>
                    </div>
                    <div>
                      <p className="font-serif text-2xl">{event.venueName}</p>
                      <p className="mt-2 text-sm leading-6 text-ivory/65">{event.address}</p>
                      {event.mapsUrl ? (
                        <a
                          href={event.mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-5 inline-block border-b border-gilded pb-1 text-xs uppercase tracking-[0.2em] text-gilded"
                        >
                          Lihat Lokasi
                        </a>
                      ) : null}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {data.loveStory.length > 0 ? (
          <section className="mx-auto max-w-3xl px-6 py-20 md:py-28">
            <SectionTitle label="Our Story" title="Cerita Kami" />
            <div className="mx-auto mt-12 max-w-xl border-l border-sage/35 pl-7">
              {data.loveStory.map((moment) => (
                <Reveal key={moment.id} className="relative pb-10 last:pb-0">
                  <span className="absolute -left-[31px] top-1 h-2 w-2 rounded-full bg-sage" />
                  <p className="text-[10px] uppercase tracking-[0.22em] text-sage">
                    {formatDateID(moment.date)}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl">{moment.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-charcoal/65">{moment.description}</p>
                </Reveal>
              ))}
            </div>
          </section>
        ) : null}

        {data.gallery.length > 0 ? (
          <section className="bg-cream px-4 py-20 md:px-6 md:py-28">
            <div className="mx-auto max-w-4xl">
              <SectionTitle label="Captured Moments" title="Galeri" />
              <div className="mt-12 grid grid-cols-2 gap-2 md:grid-cols-3">
                {data.gallery.map((photo, index) => (
                  <Reveal key={photo.id} className={index === 0 ? "col-span-2 md:row-span-2" : ""}>
                    <img
                      src={photo.url}
                      alt={photo.caption ?? `Momen pernikahan ${index + 1}`}
                      loading="lazy"
                      className={`w-full object-cover ${index === 0 ? "aspect-[4/3] h-full" : "aspect-square"}`}
                    />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {data.gifts.length > 0 ? (
          <section className="mx-auto max-w-2xl px-6 py-20 text-center md:py-28">
            <SectionTitle label="Wedding Gift" title="Tanda Kasih" />
            <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-charcoal/65">
              Kehadiran dan doa restu Anda adalah hadiah terbaik bagi kami.
            </p>
            <div className="mt-10 divide-y divide-charcoal/15 border-y border-charcoal/15">
              {data.gifts.map((gift) => (
                <Reveal key={gift.id} className="py-6">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-sage">{gift.provider}</p>
                  <p className="mt-2 font-serif text-2xl">{gift.accountNumber}</p>
                  <p className="mt-1 text-xs text-charcoal/60">a.n. {gift.accountName}</p>
                </Reveal>
              ))}
            </div>
          </section>
        ) : null}

        <section className="bg-cream px-6 py-20 md:py-28">
          <div className="mx-auto max-w-xl">
            <SectionTitle label="RSVP" title="Konfirmasi Kehadiran" />
            <div className="mt-10">
              <RsvpForm projectId={projectId} guestName={guestName} theme="light" />
            </div>
            <div className="mt-20">
              <SectionTitle label="Kind Words" title="Ucapan & Doa" />
              <div className="mt-10">
                <WishesWall projectId={projectId} theme="light" />
              </div>
            </div>
          </div>
        </section>

        <footer className="mx-auto flex min-h-[60svh] max-w-2xl items-center px-6 py-20 text-center">
          <Reveal>
            <p className="text-sm leading-7 text-charcoal/65">
              {data.settings.closing ??
                "Merupakan kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu."}
            </p>
            <p className="mt-10 font-serif text-5xl font-light md:text-6xl">
              {data.groom.nickName} <span className="italic text-sage">&amp;</span>{" "}
              {data.bride.nickName}
            </p>
            <p className="mt-8 text-[10px] uppercase tracking-[0.28em] text-charcoal/45">
              Terima Kasih
            </p>
          </Reveal>
        </footer>
      </main>
    </div>
  );
}