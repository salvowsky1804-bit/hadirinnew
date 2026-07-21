import { useEffect, useMemo, useRef, useState } from "react";
import type { TemplateRenderProps } from "@/types/template";
import { MusicToggle, type MusicHandle } from "../_shared/MusicToggle";
import { Reveal } from "../_shared/Reveal";
import { Countdown } from "../_shared/Countdown";
import { RsvpForm } from "../_shared/RsvpForm";
import { WishesWall } from "../_shared/WishesWall";
import { formatDateID, formatDateShort } from "../_shared/utils";

/**
 * Voyage — boarding-pass wedding invitation.
 * Two-ticket cinematic layout: navy body + cream ticket panels with
 * perforated edges, postmark stamps, airplane motifs and a destination
 * dress-code palette.
 */
export default function VoyageTemplate({
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

  const tagline =
    (data.custom?.tagline as string | undefined) ??
    "A DESTINATION TO REMEMBER";
  const flightCode =
    (data.custom?.flightCode as string | undefined) ?? "AR 2106";
  const flightClass =
    (data.custom?.flightClass as string | undefined) ?? "FIRST CLASS";
  const destination =
    (data.custom?.destination as string | undefined) ??
    (firstEvent?.address ?? "DESTINATION").toUpperCase();
  const boardingNote =
    (data.custom?.boardingNote as string | undefined) ?? "BOARDING FOR LOVE";
  const dresscode = data.custom?.dresscode as string | undefined;
  const palette = (
    (data.custom?.dresscodePalette as string | undefined) ??
    "IVORY,CREAM,TAUPE,NAVY,BLACK"
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  useEffect(() => {
    if (!opened) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [opened]);

  const eventDate = firstEvent ? new Date(firstEvent.date) : new Date();
  const dateFlight = firstEvent
    ? `${String(eventDate.getDate()).padStart(2, "0")}.${String(
        eventDate.getMonth() + 1,
      ).padStart(2, "0")}.${eventDate.getFullYear()}`
    : "00.00.0000";
  const dateStamp = firstEvent
    ? `${String(eventDate.getDate()).padStart(2, "0")} ${new Date(firstEvent.date)
        .toLocaleString("en-US", { month: "short" })
        .toUpperCase()} ${eventDate.getFullYear()}`
    : "";

  const calendar = useMemo(() => buildMonthGrid(eventDate), [firstEvent?.date]);

  return (
    <div
      className="min-h-dvh"
      style={
        {
          "--navy": "#0f1b3d",
          "--navy-2": "#152447",
          "--cream": "#f5ede1",
          "--cream-2": "#efe4d1",
          "--taupe": "#b5a68a",
          "--ink": "#1a1a1a",
          "--red": "#c53030",
          backgroundColor: "#0b1533",
          color: "var(--cream)",
          fontFamily:
            "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif",
        } as React.CSSProperties
      }
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Great+Vibes&display=swap');
        .v-serif { font-family: 'Playfair Display', 'Cormorant Garamond', ui-serif, Georgia, serif; }
        .v-script { font-family: 'Great Vibes', 'Cormorant Garamond', cursive; }
        .v-mono { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: 0.08em; }
        .v-ticket {
          background: var(--cream);
          color: var(--ink);
          --n: 14px;
          -webkit-mask:
            radial-gradient(var(--n) at var(--n) 50%, transparent 98%, #000) calc(-1*var(--n)) 0/100% 100%,
            radial-gradient(var(--n) at calc(100% - var(--n)) 50%, transparent 98%, #000) var(--n) 0/100% 100%;
                  mask:
            radial-gradient(var(--n) at var(--n) 50%, transparent 98%, #000) calc(-1*var(--n)) 0/100% 100%,
            radial-gradient(var(--n) at calc(100% - var(--n)) 50%, transparent 98%, #000) var(--n) 0/100% 100%;
          -webkit-mask-composite: source-in;
                  mask-composite: intersect;
        }
        .v-perf-y {
          background-image: radial-gradient(circle, var(--navy) 1.2px, transparent 1.6px);
          background-size: 1px 10px;
          background-repeat: repeat-y;
        }
        .v-plane-path {
          stroke-dasharray: 3 5;
        }
        @keyframes v-fade-up { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: none } }
        @keyframes v-fade { from { opacity: 0 } to { opacity: 1 } }
        .v-gate-1 { animation: v-fade-up 900ms ease-out 200ms both; }
        .v-gate-2 { animation: v-fade-up 900ms ease-out 700ms both; }
        .v-gate-3 { animation: v-fade-up 900ms ease-out 1200ms both; }
        .v-gate-4 { animation: v-fade 900ms ease-out 1800ms both; }
      `}</style>

      {/* COVER GATE */}
      {!opened && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Pembuka undangan"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--navy)] p-6"
        >
          <div className="relative w-full max-w-sm">
            <div className="v-ticket v-gate-1 relative rounded-md p-8 text-center">
              <p className="v-mono text-[10px] tracking-[0.4em] text-[var(--ink)]/80">
                WEDDING INVITATION
              </p>
              <div className="mx-auto mt-4 h-px w-16 bg-[var(--ink)]/40" />
              <Plane className="mx-auto mt-6 h-5 w-5 text-[var(--ink)]/80" />
              <h1 className="v-serif mt-6 text-4xl leading-tight text-[var(--ink)]">
                {data.bride.nickName}
                <span className="v-script mx-2 text-3xl text-[var(--ink)]/80">
                  and
                </span>
                {data.groom.nickName}
              </h1>
              <p className="v-gate-2 mt-6 v-mono text-[10px] tracking-[0.3em] text-[var(--ink)]/70">
                {tagline}
              </p>
              <div className="v-gate-3 mt-8 rounded-sm border border-dashed border-[var(--ink)]/40 p-4">
                <p className="v-mono text-[9px] uppercase tracking-[0.3em] text-[var(--ink)]/60">
                  Kepada Yth.
                </p>
                <p className="v-serif mt-1 text-lg italic text-[var(--ink)]">
                  {guestName ?? "Bapak / Ibu / Saudara / i"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpened(true);
                  music.current?.play();
                }}
                className="v-gate-4 v-mono mt-6 inline-flex items-center gap-2 rounded-sm bg-[var(--navy)] px-6 py-3 text-[10px] tracking-[0.35em] text-[var(--cream)] transition hover:bg-[var(--navy-2)]"
              >
                <Plane className="h-3 w-3" /> BOARD NOW
              </button>
            </div>
          </div>
        </div>
      )}

      <MusicToggle ref={music} src={data.settings.musicUrl} theme="dark" />

      {/* HEADER TAGLINE */}
      <section className="mx-auto max-w-md px-6 pt-14 text-center">
        <p className="v-script text-3xl text-[var(--cream)]/90">AreOne</p>
        <h2 className="v-script mt-1 text-5xl leading-none text-[var(--cream)]">
          Wedding
        </h2>
        <h2 className="v-serif mt-1 text-5xl italic leading-none text-[var(--cream)]">
          Invitation
        </h2>
        <div className="mx-auto mt-4 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-[var(--cream)]/50" />
          <Plane className="h-3 w-3 text-[var(--cream)]/70" />
          <span className="h-px w-10 bg-[var(--cream)]/50" />
        </div>
        <p className="v-mono mt-3 text-[10px] tracking-[0.35em] text-[var(--cream)]/70">
          {tagline}
        </p>
      </section>

      {/* TICKET 1 — HERO */}
      <section className="mx-auto mt-10 max-w-md px-6">
        <Reveal>
          <article className="v-ticket relative rounded-md p-6 pb-8">
            <header className="text-center">
              <p className="v-mono text-[10px] tracking-[0.4em] text-[var(--ink)]/80">
                WEDDING TICKET
              </p>
              <div className="mt-2 border-t border-dashed border-[var(--ink)]/40" />
            </header>

            <div className="mt-4 flex items-start gap-3">
              <div className="v-mono flex flex-col items-center text-[9px] tracking-[0.3em] text-[var(--ink)]/70">
                <span className="rotate-180 [writing-mode:vertical-rl]">
                  ▸ DEPARTURE
                </span>
              </div>
              <div className="flex-1 text-center">
                <Globe className="mx-auto h-14 w-14 text-[var(--ink)]/70" />
                <h3 className="v-serif mt-3 text-3xl tracking-[0.15em] text-[var(--ink)]">
                  {data.bride.nickName.toUpperCase()}
                </h3>
                <p className="v-script my-1 text-2xl text-[var(--ink)]/70">
                  and
                </p>
                <h3 className="v-serif text-3xl tracking-[0.15em] text-[var(--ink)]">
                  {data.groom.nickName.toUpperCase()}
                </h3>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <InfoBox
                label="FLIGHT & DATE"
                value={`${flightCode}\n${dateFlight}`}
              />
              <InfoBox label="CLASS" value={flightClass} />
              <InfoBox
                label="DESTINATION"
                value={destination}
              />
              <InfoBox
                label="WEDDING LOCATION"
                value={(firstEvent?.venueName ?? "").toUpperCase()}
              />
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <Stamp
                lines={[
                  `${data.bride.nickName.toUpperCase()} & ${data.groom.nickName.toUpperCase()}`,
                  dateStamp,
                ]}
              />
              <div className="text-right">
                <p className="v-script text-3xl text-[var(--ink)]/80 leading-none">
                  Are
                </p>
                <p className="v-script text-3xl text-[var(--ink)]/80 leading-none">
                  One
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-dashed border-[var(--ink)]/40" />
            <p className="v-mono mt-3 text-center text-[10px] tracking-[0.4em] text-[var(--ink)]/80">
              {boardingNote}
            </p>
          </article>
        </Reveal>
      </section>

      {/* GREETING */}
      <section className="mx-auto max-w-md px-8 py-16 text-center">
        <Reveal>
          <h2 className="v-serif text-3xl leading-tight tracking-wide text-[var(--cream)]">
            DEAR FRIENDS<br />AND FAMILY
          </h2>
          <div className="mx-auto mt-4 h-px w-10 bg-[var(--cream)]/40" />
          <p className="mt-5 text-sm leading-relaxed text-[var(--cream)]/85">
            {data.settings.greeting ??
              "We are thrilled to invite you to join us as we embark on the greatest adventure of our lives. Your love and support mean the world to us, and we can't wait to celebrate together in a place close to our hearts."}
          </p>
        </Reveal>
      </section>

      {/* HERO PHOTO */}
      {(data.bride.photo || data.groom.photo || data.gallery[0]) && (
        <section className="mx-auto max-w-md px-8">
          <Reveal>
            <div className="overflow-hidden rounded-md ring-1 ring-[var(--cream)]/20">
              <img
                src={
                  data.gallery[0]?.url ??
                  data.bride.photo ??
                  data.groom.photo ??
                  ""
                }
                alt=""
                loading="lazy"
                className="h-64 w-full object-cover grayscale"
              />
            </div>
          </Reveal>
        </section>
      )}

      {/* COUPLE */}
      <section className="mx-auto max-w-md px-8 py-16">
        <div className="space-y-12">
          {[data.bride, data.groom].map((p, i) => (
            <Reveal key={i} className="text-center">
              <p className="v-mono text-[10px] tracking-[0.35em] text-[var(--cream)]/70">
                {i === 0 ? "THE BRIDE" : "THE GROOM"}
              </p>
              {p.photo && (
                <img
                  src={p.photo}
                  alt={p.fullName}
                  loading="lazy"
                  className="mx-auto mt-5 h-40 w-40 rounded-full object-cover ring-1 ring-[var(--cream)]/30"
                />
              )}
              <h3 className="v-serif mt-5 text-3xl italic text-[var(--cream)]">
                {p.fullName}
              </h3>
              <p className="mt-3 text-xs uppercase tracking-[0.3em] text-[var(--cream)]/70">
                {i === 0 ? "Putri dari" : "Putra dari"}
              </p>
              <p className="mt-1 text-sm text-[var(--cream)]/85">
                {p.fatherName} &amp; {p.motherName}
              </p>
              {p.instagram && (
                <a
                  href={`https://instagram.com/${p.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-xs tracking-wide text-[var(--cream)]/80 underline decoration-dotted underline-offset-4"
                >
                  {p.instagram}
                </a>
              )}
            </Reveal>
          ))}
        </div>
      </section>

      {/* WAITING + CALENDAR */}
      <section className="mx-auto max-w-md px-6 py-8">
        <Reveal className="text-center">
          <h2 className="v-serif text-3xl tracking-wide text-[var(--cream)]">
            WE ARE WAITING<br />FOR YOU
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[var(--cream)]/85">
            Pack your bags and join us for a weekend filled with love, laughter
            and unforgettable memories.
          </p>
        </Reveal>

        <Reveal>
          <article className="v-ticket relative mt-8 rounded-md p-6">
            <p className="v-serif text-center text-2xl tracking-[0.35em] text-[var(--ink)]">
              {new Date(eventDate).toLocaleString("en-US", { month: "long" }).toUpperCase()} {eventDate.getFullYear()}
            </p>
            <div className="mx-auto mt-2 h-px w-12 bg-[var(--ink)]/40" />
            <table className="mx-auto mt-4 w-full text-center text-xs text-[var(--ink)]/85">
              <thead>
                <tr className="v-mono text-[10px] tracking-[0.25em] text-[var(--ink)]/70">
                  {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                    <th key={i} className="py-1 font-normal">
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {calendar.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => {
                      const isDay = firstEvent && cell === eventDate.getDate();
                      return (
                        <td key={ci} className="py-1.5">
                          {cell ? (
                            isDay ? (
                              <span className="relative inline-flex h-7 w-7 items-center justify-center">
                                <HeartIcon className="absolute inset-0 h-7 w-7 text-[var(--red)]" />
                                <span className="relative text-[var(--cream)]">
                                  {cell}
                                </span>
                              </span>
                            ) : (
                              <span>{cell}</span>
                            )
                          ) : (
                            ""
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 border-t border-dashed border-[var(--ink)]/40" />
            <p className="v-mono mt-3 text-center text-[10px] tracking-[0.3em] text-[var(--ink)]/70">
              SAVE THE DATE
            </p>
            <p className="v-serif mt-1 text-center text-2xl text-[var(--ink)]">
              {dateFlight} <HeartIcon className="ml-1 inline h-4 w-4 text-[var(--red)]" />
            </p>
          </article>
        </Reveal>
      </section>

      {/* COUNTDOWN */}
      {firstEvent && (
        <section className="mx-auto max-w-md px-6 py-10 text-center">
          <Reveal>
            <p className="v-mono text-[10px] tracking-[0.4em] text-[var(--cream)]/70">
              COUNTDOWN TO DEPARTURE
            </p>
            <div className="mt-6">
              <Countdown targetIso={targetIso} theme="dark" />
            </div>
          </Reveal>
        </section>
      )}

      {/* TICKET 2 — VENUE & TIMELINE */}
      <section className="mx-auto max-w-md px-6 py-10">
        {firstEvent && (
          <Reveal>
            <article className="v-ticket relative rounded-md p-6">
              <header className="flex items-start justify-between">
                <div className="flex-1 text-center">
                  <h3 className="v-serif text-2xl tracking-[0.35em] text-[var(--ink)]">
                    VENUE
                  </h3>
                  <div className="mx-auto mt-2 h-px w-12 bg-[var(--ink)]/40" />
                  <p className="v-serif mt-4 text-lg text-[var(--ink)]">
                    {firstEvent.venueName}
                  </p>
                  <p className="mt-1 text-xs text-[var(--ink)]/75">
                    {firstEvent.address}
                  </p>
                  {firstEvent.mapsUrl && (
                    <a
                      href={firstEvent.mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="v-mono mt-4 inline-block rounded-sm bg-[var(--navy)] px-5 py-2 text-[10px] tracking-[0.3em] text-[var(--cream)]"
                    >
                      HOW TO GET THERE
                    </a>
                  )}
                </div>
                <Stamp
                  small
                  lines={[destination.split(",")[0] || "DESTINATION"]}
                />
              </header>

              {data.gallery[1] && (
                <img
                  src={data.gallery[1].url}
                  alt=""
                  loading="lazy"
                  className="mt-5 h-40 w-full rounded-sm object-cover"
                />
              )}
            </article>
          </Reveal>
        )}

        {/* TIMELINE */}
        <Reveal>
          <article className="v-ticket mt-6 rounded-md p-6">
            <h3 className="v-serif text-center text-2xl tracking-[0.3em] text-[var(--ink)]">
              TIMELINE
            </h3>
            <div className="mx-auto mt-2 h-px w-12 bg-[var(--ink)]/40" />
            <ul className="mt-5 space-y-3">
              {data.events.map((ev) => (
                <li
                  key={ev.id}
                  className="flex items-center justify-between border-b border-dashed border-[var(--ink)]/20 pb-2 text-sm text-[var(--ink)]/90 last:border-b-0"
                >
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full border border-[var(--ink)]/60" />
                    {ev.name}
                  </span>
                  <span className="v-mono text-xs tracking-widest text-[var(--ink)]/80">
                    {ev.startTime}
                  </span>
                </li>
              ))}
            </ul>
            <PlanePath className="mt-6 h-10 w-full text-[var(--ink)]/40" />
          </article>
        </Reveal>

        {/* DRESS CODE */}
        {(dresscode || palette.length > 0) && (
          <Reveal>
            <article className="v-ticket mt-6 rounded-md p-6 text-center">
              <h3 className="v-serif text-2xl tracking-[0.3em] text-[var(--ink)]">
                DRESS CODE
              </h3>
              <div className="mx-auto mt-2 h-px w-12 bg-[var(--ink)]/40" />
              {dresscode && (
                <p className="mt-4 text-sm text-[var(--ink)]/85">{dresscode}</p>
              )}
              {palette.length > 0 && (
                <>
                  <p className="v-mono mt-4 text-[10px] tracking-[0.3em] text-[var(--ink)]/70">
                    OUR COLOR PALETTE FOR THE DAY:
                  </p>
                  <div className="mt-4 flex items-end justify-center gap-4">
                    {palette.map((name) => (
                      <div key={name} className="flex flex-col items-center">
                        <span
                          className="h-10 w-10 rounded-full ring-1 ring-[var(--ink)]/20"
                          style={{ background: swatch(name) }}
                        />
                        <span className="v-mono mt-2 text-[9px] tracking-[0.25em] text-[var(--ink)]/75">
                          {name}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </article>
          </Reveal>
        )}
      </section>

      {/* LOVE STORY */}
      {data.loveStory.length > 0 && (
        <section className="mx-auto max-w-md px-8 py-14">
          <Reveal className="text-center">
            <p className="v-mono text-[10px] tracking-[0.4em] text-[var(--cream)]/70">
              OUR JOURNEY
            </p>
            <h2 className="v-serif mt-3 text-3xl italic text-[var(--cream)]">
              Kisah Kami
            </h2>
          </Reveal>
          <ol className="relative mt-8 border-l border-dashed border-[var(--cream)]/40 pl-6">
            {data.loveStory.map((m) => (
              <Reveal as="li" key={m.id} className="mb-8 last:mb-0">
                <span className="absolute -left-[7px] mt-1.5 block h-3 w-3 rounded-full bg-[var(--cream)]" />
                <p className="v-mono text-[10px] tracking-[0.3em] text-[var(--cream)]/70">
                  {formatDateShort(m.date)}
                </p>
                <h3 className="v-serif mt-1 text-xl italic text-[var(--cream)]">
                  {m.title}
                </h3>
                <p className="mt-1 text-sm text-[var(--cream)]/85">
                  {m.description}
                </p>
              </Reveal>
            ))}
          </ol>
        </section>
      )}

      {/* GALLERY */}
      {data.gallery.length > 0 && (
        <section className="mx-auto max-w-lg px-6 py-14">
          <Reveal className="text-center">
            <p className="v-mono text-[10px] tracking-[0.4em] text-[var(--cream)]/70">
              MEMORIES
            </p>
            <h2 className="v-serif mt-3 text-3xl italic text-[var(--cream)]">
              Galeri
            </h2>
          </Reveal>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {data.gallery.map((g) => (
              <Reveal key={g.id}>
                <img
                  src={g.url}
                  alt={g.caption ?? ""}
                  loading="lazy"
                  className="aspect-[3/4] h-full w-full rounded-sm object-cover ring-1 ring-[var(--cream)]/15"
                />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* GIFTS */}
      {data.gifts.length > 0 && (
        <section className="mx-auto max-w-md px-6 py-14">
          <Reveal className="text-center">
            <p className="v-mono text-[10px] tracking-[0.4em] text-[var(--cream)]/70">
              WEDDING GIFT
            </p>
            <h2 className="v-serif mt-3 text-3xl italic text-[var(--cream)]">
              Tanda Kasih
            </h2>
          </Reveal>
          <div className="mt-6 space-y-3">
            {data.gifts.map((g) => (
              <Reveal key={g.id}>
                <div className="v-ticket rounded-md p-5 text-center">
                  <p className="v-mono text-[10px] tracking-[0.3em] text-[var(--ink)]/70">
                    {g.provider}
                  </p>
                  <p className="v-serif mt-2 text-2xl text-[var(--ink)]">
                    {g.accountNumber}
                  </p>
                  <p className="text-sm text-[var(--ink)]/80">
                    a.n. {g.accountName}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* RSVP & WISHES */}
      <section className="mx-auto max-w-md px-6 py-14">
        <Reveal className="text-center">
          <p className="v-mono text-[10px] tracking-[0.4em] text-[var(--cream)]/70">
            RSVP
          </p>
          <h2 className="v-serif mt-3 text-3xl italic text-[var(--cream)]">
            Confirm Your Seat
          </h2>
        </Reveal>
        <div className="mt-6 rounded-md bg-[var(--navy-2)]/60 p-5 ring-1 ring-[var(--cream)]/10">
          <RsvpForm projectId={projectId} guestName={guestName} theme="dark" />
        </div>

        <Reveal className="mt-14 text-center">
          <p className="v-mono text-[10px] tracking-[0.4em] text-[var(--cream)]/70">
            WISHES
          </p>
          <h2 className="v-serif mt-3 text-3xl italic text-[var(--cream)]">
            Untuk Pengantin
          </h2>
        </Reveal>
        <div className="mt-6">
          <WishesWall projectId={projectId} theme="dark" />
        </div>
      </section>

      {/* CLOSING */}
      <footer className="mx-auto max-w-md px-6 pb-16 pt-6 text-center">
        <Reveal>
          <div className="mx-auto flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[var(--cream)]/40" />
            <Plane className="h-3 w-3 text-[var(--cream)]/70" />
            <span className="h-px w-10 bg-[var(--cream)]/40" />
          </div>
          <p className="v-serif mt-6 text-xl italic text-[var(--cream)]">
            {data.settings.closing ??
              "Thank you for being part of our journey. See you at the destination."}
          </p>
          <p className="v-script mt-6 text-5xl leading-none text-[var(--cream)]">
            {data.bride.nickName} &amp; {data.groom.nickName}
          </p>
          <p className="v-mono mt-6 text-[10px] tracking-[0.35em] text-[var(--cream)]/60">
            {formatDateID(firstEvent?.date ?? "")}
          </p>
        </Reveal>
      </footer>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-[var(--ink)]/25 p-3">
      <p className="v-mono text-[9px] tracking-[0.25em] text-[var(--ink)]/60">
        {label}
      </p>
      <p className="v-mono mt-1 whitespace-pre-line text-[11px] tracking-[0.15em] text-[var(--ink)]">
        {value || "—"}
      </p>
    </div>
  );
}

function Stamp({ lines, small }: { lines: string[]; small?: boolean }) {
  return (
    <div
      className={`relative ${small ? "h-16 w-16" : "h-20 w-20"} shrink-0 rounded-full border-2 border-dashed border-[var(--ink)]/60 p-1`}
      style={{ transform: "rotate(-8deg)" }}
    >
      <div className="flex h-full w-full flex-col items-center justify-center rounded-full border border-[var(--ink)]/60 text-center">
        <Plane className="h-3 w-3 text-[var(--ink)]/70" />
        {lines.map((l, i) => (
          <span
            key={i}
            className="v-mono px-1 text-[7px] leading-tight tracking-[0.15em] text-[var(--ink)]/80"
          >
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

function Plane({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
    </svg>
  );
}

function Globe({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
      <circle cx="32" cy="32" r="26" />
      <ellipse cx="32" cy="32" rx="26" ry="10" />
      <ellipse cx="32" cy="32" rx="10" ry="26" />
      <path d="M6 32h52M32 6v52" />
      <path d="M14 18c8 4 28 4 36 0M14 46c8-4 28-4 36 0" />
    </svg>
  );
}

function PlanePath({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 40" className={className} fill="none" aria-hidden>
      <path
        d="M5 30 C 80 5, 180 5, 260 22"
        stroke="currentColor"
        strokeWidth="1"
        className="v-plane-path"
      />
      <g transform="translate(258 20) rotate(20)" fill="currentColor">
        <path d="M0 0 L14 4 L2 6 L0 12 L-2 6 L-14 4 Z" />
      </g>
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 21s-7-4.35-9.5-8.5C.9 9.6 2.5 6 6 6c2 0 3.5 1.2 4 2.5C10.5 7.2 12 6 14 6c3.5 0 5.1 3.6 3.5 6.5C19 16.65 12 21 12 21z" />
    </svg>
  );
}

function swatch(name: string): string {
  const map: Record<string, string> = {
    ivory: "#f5ede1",
    cream: "#e6d7bd",
    taupe: "#b5a68a",
    beige: "#d9c7ad",
    navy: "#0f1b3d",
    black: "#111111",
    white: "#ffffff",
    sage: "#a8b89a",
    dust: "#c8b8a8",
    rose: "#d7a5a0",
    gold: "#c9a84c",
  };
  const key = name.trim().toLowerCase();
  return map[key] ?? "#cccccc";
}

function buildMonthGrid(d: Date): (number | null)[][] {
  const year = d.getFullYear();
  const month = d.getMonth();
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Monday-first
  const startDow = (first.getDay() + 6) % 7;
  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);
  while (cells.length % 7 !== 0) cells.push(null);
  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}