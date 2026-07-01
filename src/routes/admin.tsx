import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/DashboardShell";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin — Studio Undangan" }],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <DashboardShell
      area="Admin"
      requiredRole="admin"
      navItems={[
        { to: "/admin", label: "Dashboard", exact: true },
        { to: "/admin/projects", label: "Semua Proyek" },
        { to: "/admin/templates", label: "Katalog Template" },
        { to: "/admin/team", label: "Kelola WO" },
        { to: "/admin/settings", label: "Pengaturan" },
      ]}
    />
  );
}
