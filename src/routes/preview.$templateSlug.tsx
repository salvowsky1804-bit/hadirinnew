import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useMemo } from "react";
import { getTemplate } from "@/lib/template-registry";
import { buildSampleInvitation } from "@/lib/sample-invitation";

export const Route = createFileRoute("/preview/$templateSlug")({
  head: ({ params }) => ({
    meta: [
      { title: `Preview Template ${params.templateSlug} — Studio` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TemplatePreviewPage,
});

function TemplatePreviewPage() {
  const { templateSlug } = Route.useParams();
  const entry = useMemo(() => getTemplate(templateSlug), [templateSlug]);

  const TemplateComponent = useMemo(
    () => (entry ? lazy(entry.load) : null),
    [entry],
  );

  const sampleData = useMemo(
    () => (entry ? buildSampleInvitation(entry.manifest) : null),
    [entry],
  );

  if (!entry || !TemplateComponent || !sampleData) {
    return (
      <main className="grid min-h-dvh place-items-center bg-[#F7F3EC] px-4 text-center text-[#2B2622]">
        <div>
          <h1 className="font-serif text-2xl">Template tidak ditemukan</h1>
          <p className="mt-2 text-sm text-[#6E655C]">
            Template <code>{templateSlug}</code> belum tersedia.
          </p>
          <Link
            to="/admin/templates"
            className="mt-4 inline-block rounded-md border border-[#2B2622] px-4 py-2 text-sm"
          >
            Kembali ke katalog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <Suspense fallback={<PreviewFallback />}>
      <TemplateComponent data={sampleData} guestName="Tamu Pratinjau" />
    </Suspense>
  );
}

function PreviewFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="grid min-h-dvh place-items-center bg-[#F7F3EC] text-[#6E655C]"
    >
      Memuat pratinjau template…
    </div>
  );
}