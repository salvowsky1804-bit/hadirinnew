import { useAuth, type Role } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";

// Convenience pill for switching between Admin and WO during testing.
export function RoleSwitcher() {
  const { user, switchRole } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  const swap = (role: Role) => {
    switchRole(role);
    navigate({ to: role === "admin" ? "/admin" : "/wo" });
  };

  return (
    <div
      role="group"
      aria-label="Ganti peran (untuk pengujian)"
      className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1 text-xs"
    >
      <span className="px-2 text-muted-foreground">Peran:</span>
      <button
        type="button"
        onClick={() => swap("admin")}
        aria-pressed={user.role === "admin"}
        className={`rounded-full px-3 py-1 transition ${
          user.role === "admin"
            ? "bg-foreground text-background"
            : "text-foreground hover:bg-muted"
        }`}
      >
        Admin
      </button>
      <button
        type="button"
        onClick={() => swap("wo")}
        aria-pressed={user.role === "wo"}
        className={`rounded-full px-3 py-1 transition ${
          user.role === "wo"
            ? "bg-foreground text-background"
            : "text-foreground hover:bg-muted"
        }`}
      >
        WO
      </button>
    </div>
  );
}
