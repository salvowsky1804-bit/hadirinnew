import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon?: ReactNode;
  exact?: boolean;
}

interface Props {
  area: "Admin" | "WO";
  navItems: NavItem[];
  requiredRole: "admin" | "wo";
}

// Shared frame for the Admin and WO dashboards.
// Espresso sidebar rail on md+ (the atelier signature); warm, calm
// content canvas for long editing sessions. Theming comes from the
// `.studio-shell` token scope in styles.css.
export function DashboardShell({ area, navItems, requiredRole }: Props) {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Guard — wait until Supabase session is hydrated, then enforce role.
  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    // Admin dapat mengakses area WO (editor/RSVP proyek); WO tidak boleh masuk Admin.
    if (user.role !== requiredRole) {
      if (requiredRole === "wo" && user.role === "admin") return;
      navigate({ to: user.role === "admin" ? "/admin" : "/wo" });
    }
  }, [user, loading, requiredRole, navigate]);

  if (loading || !user) {
    return (
      <div className="studio-shell flex min-h-dvh items-center justify-center bg-background text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-ping rounded-full bg-[--color-gilded]" />
          Memuat sesi…
        </span>
      </div>
    );
  }

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  const roleLabel = user.role === "admin" ? "Administrator" : "Wedding Organizer";

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/login" });
  };

  return (
    <div className="studio-shell min-h-dvh bg-background text-foreground">
      <div className="flex min-h-dvh">
        {/* ---- Sidebar rail (md+) ---- */}
        <aside
          className="hidden w-64 shrink-0 flex-col border-r border-border bg-card md:flex"
          aria-label={`Navigasi ${area}`}
        >
          <div className="px-5 py-5">
            <Link to="/" className="group flex items-center gap-2.5">
              <span
                aria-hidden
                className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground text-[11px] font-bold"
              >
                SU
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold leading-tight text-foreground">
                  Studio Undangan
                </span>
                <span className="block text-[11px] leading-tight text-muted-foreground">Area {area}</span>
              </span>
            </Link>
          </div>

          <nav className="flex-1 space-y-0.5 px-3 pb-3">
            <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">
              Menu
            </p>
            {navItems.map((item) => {
              const active = isActive(item.to, item.exact);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                    active
                      ? "bg-secondary font-semibold text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.icon && (
                    <span
                      className={`grid h-4 w-4 shrink-0 place-items-center ${
                        active ? "text-bordeaux" : "text-muted-foreground"
                      }`}
                    >
                      {item.icon}
                    </span>
                  )}
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-border p-3">
            <div className="flex items-center gap-3 rounded-lg px-2 py-2">
              <span className="sp-avatar h-9 w-9 text-xs">{initials(user.name)}</span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
                <p className="truncate text-[11px] text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" />
              Keluar
            </button>
          </div>
        </aside>

        {/* ---- Main column ---- */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 border-b border-border bg-card/90 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-4 py-3.5 md:px-8">
              <div className="min-w-0">
                <p className="text-[11px] leading-tight text-muted-foreground">{area}</p>
                <h1 className="truncate text-lg font-semibold leading-tight text-foreground md:text-xl">
                  {pageTitle(pathname)}
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-medium leading-tight text-foreground">{user.name}</p>
                  <p className="text-[11px] leading-tight text-muted-foreground">{roleLabel}</p>
                </div>
                <span className="sp-avatar h-9 w-9 text-xs">{initials(user.name)}</span>
                {/* Mobile sign-out (sidebar is hidden on small screens) */}
                <button
                  type="button"
                  onClick={handleSignOut}
                  aria-label="Keluar"
                  className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground md:hidden"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Mobile nav */}
            <nav
              aria-label="Navigasi mobile"
              className="flex gap-1.5 overflow-x-auto border-t border-border px-3 py-2.5 md:hidden"
            >
              {navItems.map((item) => {
                const active = isActive(item.to, item.exact);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition ${
                      active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground/80"
                    }`}
                  >
                    {item.icon && <span className="grid h-3.5 w-3.5 place-items-center">{item.icon}</span>}
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </header>

          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
            <div className="sp-enter mx-auto max-w-6xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function initials(name?: string): string {
  if (!name) return "·";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "·";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function pageTitle(pathname: string): string {
  const map: Array<[RegExp, string]> = [
    [/^\/admin$/, "Dashboard"],
    [/^\/admin\/projects/, "Semua Proyek"],
    [/^\/admin\/templates/, "Katalog Template"],
    [/^\/admin\/team/, "Kelola Akun WO"],
    [/^\/admin\/settings/, "Pengaturan"],
    [/^\/wo$/, "Daftar Proyek Undangan"],
    [/^\/wo\/new/, "Proyek Undangan Baru"],
    [/^\/wo\/projects\/[^/]+\/wishes/, "Ucapan Tamu"],
    [/^\/wo\/projects\/[^/]+\/rsvp/, "RSVP & Ucapan"],
    [/^\/wo\/projects\/[^/]+/, "Editor Proyek"],
  ];
  for (const [re, title] of map) if (re.test(pathname)) return title;
  return "";
}
