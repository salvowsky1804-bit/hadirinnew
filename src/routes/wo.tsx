import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/DashboardShell";

export const Route = createFileRoute("/wo")({
  head: () => ({
    meta: [{ title: "WO — Studio Undangan" }],
  }),
  component: WoLayout,
});

function WoLayout() {
  return (
    <DashboardShell
      area="WO"
      requiredRole="wo"
      navItems={[{ to: "/wo", label: "Proyek Undangan", exact: true }]}
    />
  );
}
