import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/templates")({
  component: () => (
    <p className="text-sm text-muted-foreground">
      Katalog Template — dibangun di tahap 5.
    </p>
  ),
});
