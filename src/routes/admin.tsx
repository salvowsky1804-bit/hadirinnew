import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/DashboardShell";
import { LayoutDashboard, FileStack, LayoutTemplate, Users, Settings } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin — Studio Undangan" }],
  }),
  component: AdminLayout,
});

const icon = "h-4 w-4";

function AdminLayout() {
  return (
    <DashboardShell
      area="Admin"
      requiredRole="admin"
      navItems={[
        {
          to: "/admin",
          label: "Dashboard",
          exact: true,
          icon: <LayoutDashboard className={icon} />,
        },
        {
          to: "/admin/projects",
          label: "Semua Proyek",
          icon: <FileStack className={icon} />,
        },
        {
          to: "/admin/templates",
          label: "Katalog Template",
          icon: <LayoutTemplate className={icon} />,
        },
        {
          to: "/admin/team",
          label: "Kelola WO",
          icon: <Users className={icon} />,
        },
        {
          to: "/admin/settings",
          label: "Pengaturan",
          icon: <Settings className={icon} />,
        },
      ]}
    />
  );
}
