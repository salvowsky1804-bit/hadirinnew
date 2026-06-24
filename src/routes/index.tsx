import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Studio Undangan — Undangan Pernikahan Digital" },
      {
        name: "description",
        content:
          "Studio undangan pernikahan digital yang dikerjakan langsung oleh tim kami — elegan, premium, dan dipersonalisasi untuk setiap pasangan.",
      },
      { property: "og:title", content: "Studio Undangan" },
      {
        property: "og:description",
        content: "Undangan pernikahan digital yang anggun dan dipersonalisasi.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-dvh bg-[#F7F3EC] px-6 py-20 text-[#2B2622]">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-[#C2A56B]">
          Studio Undangan
        </p>
        <h1 className="mt-6 font-serif text-5xl leading-tight md:text-6xl">
          Undangan yang dirancang tangan,
          <br /> dikerjakan oleh tim kami.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-[#6E655C]">
          Tahap 1 selesai — kerangka rute, layout dashboard, login palsu,
          peralihan peran, tipe data &amp; manifest, serta data dummy sudah
          tersedia. Landing penuh dibangun di tahap 2.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/login"
            className="rounded-md bg-[#6E2A36] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#581f29]"
          >
            Masuk Studio
          </Link>
          <Link
            to="/u/$slug"
            params={{ slug: "rama-sinta" }}
            className="rounded-md border border-[#2B2622] px-6 py-3 text-sm font-medium text-[#2B2622] transition hover:bg-[#2B2622] hover:text-[#F7F3EC]"
          >
            Lihat contoh undangan
          </Link>
        </div>
      </div>
    </main>
  );
}
