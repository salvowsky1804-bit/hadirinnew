import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/team")({
  component: () => (
    <p className="text-sm text-muted-foreground">
      Kelola Akun WO — dibangun di tahap 5.
    </p>
  ),
});
