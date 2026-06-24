import { createFileRoute, notFound } from "@tanstack/react-router";
import { lazy, Suspense, useMemo } from "react";
import { dummyProjects } from "@/data/dummy";
import { getTemplate } from "@/lib/template-registry";

export const Route = createFileRoute("/u/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Undangan ${params.slug} — Studio` },
      {
        name: "description",
        content: "Undangan pernikahan online — silakan buka untuk melihat detail acara, mengkonfirmasi kehadiran, dan menyampaikan ucapan.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: ({ params }) => {
    const project = dummyProjects.find((p) => p.slug === params.slug);
    if (!project) throw notFound();
    return { project };
  },
  component: GuestInvitationPage,
});

function GuestInvitationPage() {
  const { project } = Route.useLoaderData();
  const search =
    typeof window === "undefined" ? "" : window.location.search;
  const guestName = new URLSearchParams(search).get("tamu") ?? undefined;

  const entry = useMemo(() => getTemplate(project.templateSlug), [project.templateSlug]);

  if (!entry) {
    return (
      <main className="grid min-h-dvh place-items-center bg-[#F7F3EC] px-4 text-center text-[#2B2622]">
        <div>
          <h1 className="font-serif text-2xl">Template tidak ditemukan</h1>
          <p className="mt-2 text-sm text-[#6E655C]">
            Template <code>{project.templateSlug}</code> belum tersedia.
          </p>
        </div>
      </main>
    );
  }

  // Per-template code split: only ship the chosen template's chunk.
  const TemplateComponent = useMemo(
    () => lazy(entry.load),
    [entry],
  );

  return (
    <Suspense fallback={<TemplateFallback />}>
      <TemplateComponent data={project.data} guestName={guestName} />
    </Suspense>
  );
}

function TemplateFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="grid min-h-dvh place-items-center bg-[#F7F3EC] text-[#6E655C]"
    >
      Memuat undangan…
    </div>
  );
}
