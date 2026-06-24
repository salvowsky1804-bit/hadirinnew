import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/settings")({
  component: () => (
    <p className="text-sm text-muted-foreground">
      Pengaturan — dibangun di tahap 5.
    </p>
  ),
});
