import { useEffect, useRef, useState, type ReactNode } from "react";
import { CalendarDays, ChevronDown, MapPin } from "lucide-react";
import heroImage from "@/assets/aurelia-royal-hero.jpg";
import portraitImage from "@/assets/aurelia-royal-portrait.jpg";
import detailImage from "@/assets/aurelia-royal-detail.jpg";
import { usePublicGuestQr } from "@/lib/public-invitation";
import type { TemplateRenderProps } from "@/types/template";
import { Countdown } from "../_shared/Countdown";
import { MusicToggle, type MusicHandle } from "../_shared/MusicToggle";
import { Reveal } from "../_shared/Reveal";
import { RsvpForm } from "../_shared/RsvpForm";
import { WishesWall } from "../_shared/WishesWall";
import { formatDateID } from "../_shared/utils";

const defaults = {
  quote: "In every lifetime, I would still find my way to you.",
  storyTitle: "A Story Written in Time",
  dresscode: "Black Tie · Champagne · Ivory",
  rundown: "08.00 — Akad Nikah\n11.00 — Resepsi\n13.30 — Penutup",
};

function customText(data: TemplateRenderProps["data"], key: string, fallback: string) {
  const value = data.custom?.[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

function RoyalSection({ children, tone = "dark", className = "" }: { children: ReactNode; tone?: "dark" | "light"; className?: string }) {
  return (
    <section className={`relative flex min-h-[100svh] items-center overflow-hidden px-6 py-24 md:px-10 md:py-32 ${tone === "dark" ? "bg-[var(--aurelia-ink)] text-[var(--aurelia-ivory)]" : "bg-[var(--aurelia-ivory)] text-[var(--aurelia-ink)]"} ${className}`}>
      <div className="pointer-events-none absolute inset-x-6 top-6 h-px bg-current opacity-15 md:inset-x-10" />
      <div className="pointer-events-none absolute inset-y-6 left-6 w-px bg-current opacity-10 md:left-10" />
      <div className="pointer-events-none absolute inset-y-6 right-6 w-px bg-current opacity-10 md:right-10" />
      <div className="relative mx-auto w-full max-w-5xl">{children}</div>
    </section>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-[var(--aurelia-gold)]">{children}</p>;
}

function SectionHeading({ eyebrow, children, light = false }: { eyebrow: string; children: ReactNode; light?: boolean }) {
  return (
    <div className="text-center">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className={`mx-auto mt-5 max-w-3xl font-serif text-4xl font-light leading-tight md:text-6xl ${light ? "text-[var(--aurelia-ivory)]" : "text-[var(--aurelia-ink)]"}`}>{children}</h2>
      <span className="mx-auto mt-7 block h-px w-16 bg-[var(--aurelia-gold)]" />
    </div>
  );
}

export default function AureliaTemplate({ data, guestName, projectId }: TemplateRenderProps) {
  const music = useRef<MusicHandle>(null);
  const [opened, setOpened] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const firstEvent = data.events[0];
  const targetIso = firstEvent ? `${firstEvent.date}T${firstEvent.startTime || "08:00"}:00` : new Date().toISOString();
  const couple = `${data.groom.nickName} & ${data.bride.nickName}`;
  const monogram = customText(data, "monogram", `${data.groom.nickName.charAt(0)}${data.bride.nickName.charAt(0)}`).slice(0, 3);
  const quote = customText(data, "quote", defaults.quote);
  const quoteSource = customText(data, "quoteSource", "— Our vow");
  const storyTitle = customText(data, "storyTitle", defaults.storyTitle);
  const dresscode = customText(data, "dresscode", defaults.dresscode);
  const rundown = customText(data, "rundown", defaults.rundown).split("\n").filter(Boolean);
  const gallery = data.gallery.length ? data.gallery : [
    { id: "aurelia-hero", url: heroImage, caption: "A royal beginning" },
    { id: "aurelia-portrait", url: portraitImage, caption: "Together" },
    { id: "aurelia-detail", url: detailImage, caption: "The details" },
  ];

  useEffect(() => {
    if (opened) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [opened]);

  function openInvitation() {
    music.current?.play();
    setLeaving(true);
    window.setTimeout(() => setOpened(true), 850);
  }

  return (
    <div className="aurelia-theme min-h-dvh bg-[var(--aurelia-ink)] font-sans text-[var(--aurelia-ivory)]">
      {!opened ? (
        <div role="dialog" aria-modal="true" aria-label="Pembuka undangan" className={`fixed inset-0 z-[70] overflow-hidden bg-[var(--aurelia-ink)] transition-all duration-1000 ${leaving ? "pointer-events-none -translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}>
          <img src={heroImage} alt="" width={1280} height={1920} className="aurelia-zoom absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--aurelia-ink)]/20 via-[var(--aurelia-ink)]/35 to-[var(--aurelia-ink)]/95" />
          <div className="absolute inset-5 border border-[var(--aurelia-gold)]/35 md:inset-8" />
          <div className="relative flex h-full flex-col items-center justify-between px-8 py-14 text-center md:py-16">
            <div>
              <Eyebrow>The Wedding Celebration</Eyebrow>
              <p className="mt-4 font-serif text-lg italic text-[var(--aurelia-ivory)]/75">An invitation to remember</p>
            </div>
            <div className="aurelia-enter flex flex-col items-center">
              <div className="grid h-28 w-28 place-items-center rounded-full border border-[var(--aurelia-gold)]/55 bg-[var(--aurelia-ink)]/25 backdrop-blur-sm">
                <span className="font-serif text-5xl font-light">{monogram}</span>
              </div>
              <h1 className="mt-7 font-serif text-5xl font-light leading-none md:text-7xl">{couple}</h1>
              <p className="mt-5 text-xs uppercase tracking-[0.24em] text-[var(--aurelia-ivory)]/75">{firstEvent ? formatDateID(firstEvent.date) : "Our Wedding Day"}</p>
            </div>
            <div className="w-full max-w-sm">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--aurelia-ivory)]/60">Kepada Yth.</p>
              <p className="mt-2 font-serif text-xl">{guestName ?? "Bapak / Ibu / Saudara/i"}</p>
              <button type="button" onClick={openInvitation} className="mt-7 w-full border border-[var(--aurelia-gold)] bg-[var(--aurelia-gold)]/10 px-7 py-3.5 text-[10px] font-semibold uppercase tracking-[0.28em] transition hover:bg-[var(--aurelia-gold)] hover:text-[var(--aurelia-ink)]">Buka Undangan</button>
            </div>
          </div>
        </div>
      ) : null}
      <MusicToggle ref={music} src={data.settings.musicUrl} theme="dark" />

      <main>
        <section className="relative flex min-h-[100svh] items-end overflow-hidden px-6 py-16 md:px-12 md:py-20">
          <img src={heroImage} alt={`Pernikahan ${couple}`} width={1280} height={1920} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--aurelia-ink)] via-[var(--aurelia-ink)]/15 to-[var(--aurelia-ink)]/30" />
          <div className="relative mx-auto flex w-full max-w-5xl items-end justify-between gap-8">
            <Reveal>
              <Eyebrow>The Wedding Of</Eyebrow>
              <h1 className="mt-4 max-w-3xl font-serif text-6xl font-light leading-[0.9] md:text-9xl">{data.groom.nickName}<br /><span className="italic text-[var(--aurelia-gold)]">&amp;</span> {data.bride.nickName}</h1>
            </Reveal>
            <ChevronDown aria-hidden className="aurelia-bob mb-2 hidden h-6 w-6 text-[var(--aurelia-gold)] md:block" />
          </div>
        </section>

        <RoyalSection tone="light">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="mx-auto block font-serif text-6xl leading-none text-[var(--aurelia-gold)]">“</span>
            <blockquote className="font-serif text-3xl font-light italic leading-relaxed md:text-5xl">{quote}</blockquote>
            <p className="mt-8 text-[10px] uppercase tracking-[0.3em] text-[var(--aurelia-ink)]/55">{quoteSource}</p>
            <p className="mx-auto mt-14 max-w-xl text-sm leading-7 text-[var(--aurelia-ink)]/65">{data.settings.greeting ?? "Dengan rasa syukur dan bahagia, kami mengundang Anda menjadi bagian dari awal perjalanan baru kami."}</p>
          </Reveal>
        </RoyalSection>

        <RoyalSection className="!px-0">
          <div className="grid min-h-[72svh] md:grid-cols-[1.05fr_0.95fr]">
            <div className="relative min-h-[58svh] overflow-hidden">
              <img src={portraitImage} alt="Potret pasangan" loading="lazy" width={1280} height={1600} className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <Reveal className="flex items-center px-8 py-16 md:px-16">
              <div>
                <Eyebrow>Bride &amp; Groom</Eyebrow>
                {[data.bride, data.groom].map((person, index) => (
                  <div key={person.fullName || index} className="mt-10 border-t border-[var(--aurelia-ivory)]/15 pt-8 first:mt-8">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--aurelia-gold)]">{index === 0 ? "The Bride" : "The Groom"}</p>
                    <h2 className="mt-3 font-serif text-4xl font-light md:text-5xl">{person.fullName}</h2>
                    <p className="mt-3 text-sm leading-6 text-[var(--aurelia-ivory)]/60">{index === 0 ? "Putri dari" : "Putra dari"}<br />{person.fatherName} &amp; {person.motherName}</p>
                    {person.instagram ? <a href={`https://instagram.com/${person.instagram.replace(/^@/, "")}`} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs text-[var(--aurelia-gold)]">{person.instagram}</a> : null}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </RoyalSection>

        {data.loveStory.length ? (
          <RoyalSection tone="light">
            <SectionHeading eyebrow="Our Journey">{storyTitle}</SectionHeading>
            <div className="mt-16 grid gap-px bg-[var(--aurelia-ink)]/15 md:grid-cols-3">
              {data.loveStory.map((moment, index) => (
                <Reveal key={moment.id} delay={index * 80} className="bg-[var(--aurelia-ivory)] p-7 md:p-9">
                  <p className="font-serif text-5xl font-light text-[var(--aurelia-gold)]">0{index + 1}</p>
                  <p className="mt-8 text-[10px] uppercase tracking-[0.25em] text-[var(--aurelia-ink)]/50">{formatDateID(moment.date)}</p>
                  <h3 className="mt-3 font-serif text-3xl font-light">{moment.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[var(--aurelia-ink)]/65">{moment.description}</p>
                </Reveal>
              ))}
            </div>
          </RoyalSection>
        ) : null}

        {firstEvent ? (
          <RoyalSection>
            <Reveal className="text-center">
              <SectionHeading eyebrow="Save The Date" light>Until We Say I Do</SectionHeading>
              <p className="mt-8 font-serif text-xl italic text-[var(--aurelia-ivory)]/70">{formatDateID(firstEvent.date)}</p>
              <div className="mt-12"><Countdown targetIso={targetIso} theme="dark" /></div>
            </Reveal>
          </RoyalSection>
        ) : null}

        <RoyalSection tone="light">
          <SectionHeading eyebrow="The Celebration">Wedding Events</SectionHeading>
          <div className="mx-auto mt-16 max-w-3xl divide-y divide-[var(--aurelia-ink)]/15 border-y border-[var(--aurelia-ink)]/15">
            {data.events.map((event) => (
              <Reveal key={event.id} className="grid gap-7 py-9 md:grid-cols-[0.8fr_1.2fr] md:py-11">
                <div>
                  <CalendarDays aria-hidden className="h-5 w-5 text-[var(--aurelia-gold)]" />
                  <h3 className="mt-4 font-serif text-3xl font-light">{event.name}</h3>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[var(--aurelia-ink)]/55">{event.startTime} — {event.endTime} WIB</p>
                </div>
                <div className="md:border-l md:border-[var(--aurelia-ink)]/15 md:pl-10">
                  <p className="font-serif text-2xl">{formatDateID(event.date)}</p>
                  <p className="mt-4 text-sm font-semibold">{event.venueName}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--aurelia-ink)]/60">{event.address}</p>
                  {event.mapsUrl ? <a href={event.mapsUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 border-b border-[var(--aurelia-gold)] pb-1 text-[10px] font-semibold uppercase tracking-[0.2em]"><MapPin aria-hidden className="h-3.5 w-3.5" />Lihat Lokasi</a> : null}
                </div>
              </Reveal>
            ))}
          </div>
        </RoyalSection>

        <RoyalSection className="!px-0">
          <div className="grid md:grid-cols-2">
            <div className="relative min-h-[65svh]"><img src={detailImage} alt="Detail hari pernikahan" loading="lazy" width={1280} height={1600} className="absolute inset-0 h-full w-full object-cover" /></div>
            <Reveal className="flex items-center px-8 py-16 md:px-16">
              <div className="w-full">
                <Eyebrow>Wedding Day Guide</Eyebrow>
                <h2 className="mt-5 font-serif text-4xl font-light md:text-6xl">Details, thoughtfully arranged.</h2>
                <div className="mt-10 border-y border-[var(--aurelia-ivory)]/15 py-8">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--aurelia-gold)]">Dress Code</p>
                  <p className="mt-3 font-serif text-2xl">{dresscode}</p>
                  <div className="mt-6 flex gap-3" aria-label="Palet dress code"><span className="h-9 w-9 rounded-full bg-[var(--aurelia-ivory)]" /><span className="h-9 w-9 rounded-full bg-[var(--aurelia-champagne)]" /><span className="h-9 w-9 rounded-full bg-[var(--aurelia-taupe)]" /><span className="h-9 w-9 rounded-full border border-[var(--aurelia-ivory)]/20 bg-[var(--aurelia-ink-soft)]" /></div>
                </div>
                <ol className="mt-7 space-y-4">{rundown.map((item, index) => <li key={`${item}-${index}`} className="flex items-start gap-4 text-sm text-[var(--aurelia-ivory)]/75"><span className="mt-2 h-px w-8 shrink-0 bg-[var(--aurelia-gold)]" />{item}</li>)}</ol>
              </div>
            </Reveal>
          </div>
        </RoyalSection>

        {gallery.length ? (
          <RoyalSection tone="light">
            <SectionHeading eyebrow="Frames of Us">A Study in Love</SectionHeading>
            <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {gallery.slice(0, 6).map((photo, index) => (
                <Reveal key={photo.id} delay={index * 60} className={index === 0 ? "col-span-2 row-span-2" : ""}>
                  <img src={photo.url} alt={photo.caption ?? `Momen ${index + 1}`} loading="lazy" width={index === 0 ? 1280 : 800} height={index === 0 ? 1600 : 1000} className={`h-full w-full object-cover ${index === 0 ? "min-h-[430px]" : "aspect-[4/5]"}`} />
                </Reveal>
              ))}
            </div>
          </RoyalSection>
        ) : null}

        {data.gifts.length ? (
          <RoyalSection>
            <SectionHeading eyebrow="Wedding Gift" light>A Gesture of Love</SectionHeading>
            <p className="mx-auto mt-7 max-w-lg text-center text-sm leading-7 text-[var(--aurelia-ivory)]/60">Kehadiran dan doa Anda adalah hadiah terbaik. Bila berkenan, tanda kasih dapat disampaikan melalui rekening berikut.</p>
            <div className="mx-auto mt-10 grid max-w-2xl gap-4 md:grid-cols-2">{data.gifts.map((gift) => <Reveal key={gift.id} className="border border-[var(--aurelia-gold)]/30 p-7 text-center"><Eyebrow>{gift.provider}</Eyebrow><p className="mt-4 font-serif text-2xl">{gift.accountNumber}</p><p className="mt-2 text-xs text-[var(--aurelia-ivory)]/55">a.n. {gift.accountName}</p></Reveal>)}</div>
          </RoyalSection>
        ) : null}

        {guestName && projectId ? <GuestPass projectId={projectId} guestName={guestName} /> : null}

        <RoyalSection tone="light">
          <div className="grid gap-16 md:grid-cols-2 md:gap-12">
            <Reveal><Eyebrow>RSVP</Eyebrow><h2 className="mt-4 font-serif text-4xl font-light">Konfirmasi Kehadiran</h2><div className="mt-8"><RsvpForm projectId={projectId} guestName={guestName} theme="light" /></div></Reveal>
            <Reveal delay={100}><Eyebrow>Kind Words</Eyebrow><h2 className="mt-4 font-serif text-4xl font-light">Ucapan &amp; Doa</h2><div className="mt-8 max-h-[520px] overflow-y-auto pr-2"><WishesWall projectId={projectId} theme="light" /></div></Reveal>
          </div>
        </RoyalSection>

        <footer className="relative flex min-h-[78svh] items-end overflow-hidden px-6 py-16 text-center">
          <img src={heroImage} alt="" loading="lazy" width={1280} height={1920} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[var(--aurelia-ink)]/65" />
          <Reveal className="relative mx-auto max-w-2xl">
            <p className="text-sm leading-7 text-[var(--aurelia-ivory)]/75">{data.settings.closing ?? "Terima kasih telah menjadi bagian dari hari yang akan selalu kami kenang."}</p>
            <p className="mt-8 font-serif text-5xl font-light md:text-7xl">{couple}</p>
            <span className="mx-auto mt-8 block h-px w-16 bg-[var(--aurelia-gold)]" />
            <p className="mt-6 text-[10px] uppercase tracking-[0.3em]">With love, always</p>
          </Reveal>
        </footer>
      </main>
    </div>
  );
}

function GuestPass({ projectId, guestName }: { projectId: string; guestName: string }) {
  const qrUrl = usePublicGuestQr(projectId, guestName);
  if (!qrUrl) return null;
  return (
    <RoyalSection>
      <Reveal className="mx-auto max-w-lg text-center">
        <SectionHeading eyebrow="Private Entry" light>Your Digital Invitation</SectionHeading>
        <p className="mt-6 text-sm text-[var(--aurelia-ivory)]/60">Tunjukkan kode ini kepada tim penerima tamu.</p>
        <div className="mx-auto mt-9 max-w-xs bg-[var(--aurelia-ivory)] p-5 text-[var(--aurelia-ink)]"><img src={qrUrl} alt={`QR undangan ${guestName}`} loading="lazy" width={260} height={260} className="mx-auto aspect-square w-full object-contain" /><p className="mt-4 font-serif text-xl">{guestName}</p></div>
      </Reveal>
    </RoyalSection>
  );
}
