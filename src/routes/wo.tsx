import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/DashboardShell";
import { LayoutList, Plus } from "lucide-react";

export const Route = createFileRoute("/wo")({
  head: () => ({
    meta: [{ title: "WO — Studio Undangan" }],
  }),
  component: WoLayout,
});

const icon = "h-4 w-4";

function WoLayout() {
  return (
    <DashboardShell
      area="WO"
      requiredRole="wo"
      navItems={[
        {
          to: "/wo",
          label: "Proyek Undangan",
          exact: true,
          icon: <LayoutList className={icon} />,
        },
        {
          to: "/wo/new",
          label: "Proyek Baru",
          icon: <Plus className={icon} />,
        },
      ]}
    />
  );
}
