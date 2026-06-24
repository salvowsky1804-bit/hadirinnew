import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/wo/projects/$projectId/rsvp")({
  component: () => (
    <p className="text-sm text-muted-foreground">
      RSVP &amp; Ucapan — dibangun di tahap 3.
    </p>
  ),
});
