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
        <aside className="hidden w-64 shrink-0 flex-col bg-charcoal text-ivory md:flex" aria-label={`Navigasi ${area}`}>
          <div className="border-b border-ivory/10 px-6 py-6">
            <Link to="/" className="group inline-flex flex-col">
              <span className="inline-flex items-center gap-2">
                <span aria-hidden className="inline-block h-4 w-4 rotate-45 rounded-[3px] border border-gilded/70" />
                <span className="font-serif text-xl leading-none tracking-wide">Studio Undangan</span>
              </span>
              <span className="mt-2 pl-6 text-[10px] uppercase tracking-[0.4em] text-gilded">Area {area}</span>
            </Link>
          </div>

          <nav className="flex-1 space-y-1 p-3">
            {navItems.map((item) => {
              const active = isActive(item.to, item.exact);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                    active
                      ? "bg-ivory font-medium text-charcoal shadow-sm"
                      : "text-ivory/65 hover:bg-ivory/10 hover:text-ivory"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {active && (
                    <span
                      aria-hidden
                      className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-gilded"
                    />
                  )}
                  {item.icon && (
                    <span
                      className={`grid h-5 w-5 shrink-0 place-items-center ${
                        active ? "text-bordeaux" : "text-ivory/55"
                      }`}
                    >
                      {item.icon}
                    </span>
                  )}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-ivory/10 p-4">
            <div className="flex items-center gap-3">
              <span className="sp-avatar h-9 w-9 text-xs ring-1 ring-ivory/20">{initials(user.name)}</span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ivory">{user.name}</p>
                <p className="truncate text-[11px] text-ivory/50">{user.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="mt-3 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ivory/55 transition hover:text-gilded"
            >
              <LogOut className="h-3.5 w-3.5" />
              Keluar
            </button>
          </div>
        </aside>

        {/* ---- Main column ---- */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-8">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">{area}</p>
                <h1 className="truncate font-serif text-xl leading-tight text-foreground md:text-2xl">
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
