import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/wo/projects/$projectId")({
  component: ProjectEditorPlaceholder,
});

function ProjectEditorPlaceholder() {
  const { projectId } = Route.useParams();
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Editor proyek <code>{projectId}</code> — dibangun di tahap 3 (pilih
        template → form dinamis dari manifest → kelola tamu → preview).
      </p>
      <Link
        to="/wo/projects/$projectId/rsvp"
        params={{ projectId }}
        className="inline-block rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted"
      >
        Lihat RSVP & Ucapan →
      </Link>
    </div>
  );
}
