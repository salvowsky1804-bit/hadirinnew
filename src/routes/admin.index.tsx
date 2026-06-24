import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardPlaceholder,
});

function AdminDashboardPlaceholder() {
  return (
    <section aria-labelledby="dashboard-heading" className="space-y-4">
      <h2 id="dashboard-heading" className="sr-only">
        Ringkasan dashboard
      </h2>
      <p className="text-sm text-muted-foreground">
        Tahap 1 selesai — kerangka rute, layout, login palsu, peralihan peran,
        tipe data, dan data dummy sudah siap. Dashboard penuh dibangun di tahap 5.
      </p>
    </section>
  );
}
