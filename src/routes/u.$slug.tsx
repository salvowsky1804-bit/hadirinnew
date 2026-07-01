import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useMemo } from "react";
import { getTemplate } from "@/lib/template-registry";
import { usePublicProject } from "@/lib/public-invitation";

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
  component: GuestInvitationPage,
});

function GuestInvitationPage() {
  const { slug } = Route.useParams();
  const { project, loading } = usePublicProject(slug);
  const search =
    typeof window === "undefined" ? "" : window.location.search;
  const guestName = new URLSearchParams(search).get("tamu") ?? undefined;

  const entry = useMemo(
    () => (project ? getTemplate(project.templateSlug) : undefined),
    [project],
  );

  // Per-template code split: only ship the chosen template's chunk.
  // Hook order must be stable — declare before any early return.
  const TemplateComponent = useMemo(
    () => (entry ? lazy(entry.load) : null),
    [entry],
  );

  if (loading) return <TemplateFallback />;

  if (!project) {
    return (
      <main className="grid min-h-dvh place-items-center bg-[#F7F3EC] px-4 text-center text-[#2B2622]">
        <div className="max-w-sm">
          <h1 className="font-serif text-2xl">Undangan tidak ditemukan</h1>
          <p className="mt-2 text-sm text-[#6E655C]">
            Slug <code>{slug}</code> belum terdaftar.
          </p>
          <Link
            to="/"
            className="mt-4 inline-block rounded-md border border-[#2B2622] px-4 py-2 text-sm"
          >
            Kembali ke beranda
          </Link>
        </div>
      </main>
    );
  }

  if (!entry || !TemplateComponent) {
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

  return (
    <Suspense fallback={<TemplateFallback />}>
      <TemplateComponent
        data={project.data}
        guestName={guestName}
        projectId={project.id}
      />
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
