import type { TemplateRenderProps } from "@/types/template";

// Stub — desain penuh dibangun di tahap 4.
export default function SenandikaTemplate({ data, guestName }: TemplateRenderProps) {
  const verse = (data.custom.favoriteVerse as string | undefined) ?? "";
  return (
    <div className="min-h-screen bg-[#1a1612] p-8 text-[#F7F3EC]">
      <p className="text-sm uppercase tracking-widest text-[#C2A56B]">
        Template: Senandika (stub)
      </p>
      <h1 className="mt-4 font-serif text-4xl">
        {data.groom.nickName} &amp; {data.bride.nickName}
      </h1>
      {guestName && <p className="mt-2 text-[#C2A56B]">Kepada Yth. {guestName}</p>}
      {verse && <p className="mt-6 max-w-prose italic">{verse}</p>}
    </div>
  );
}
