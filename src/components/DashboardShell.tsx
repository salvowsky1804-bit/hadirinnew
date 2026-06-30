import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { RoleSwitcher } from "./RoleSwitcher";
import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";

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

// Shared shell for the Admin and WO dashboards. Sidebar on md+, top bar on mobile.
// Neutral, functional palette — this is a long-session work tool.
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
    if (user.role !== requiredRole) {
      navigate({ to: user.role === "admin" ? "/admin" : "/wo" });
    }
  }, [user, loading, requiredRole, navigate]);

  if (loading || !user) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background text-sm text-muted-foreground">
        Memuat sesi…
      </div>
    );
  }

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="flex min-h-dvh">
        <aside
          className="hidden w-64 shrink-0 border-r border-border bg-card md:flex md:flex-col"
          aria-label={`Navigasi ${area}`}
        >
          <div className="border-b border-border px-5 py-5">
            <Link to="/" className="font-serif text-lg">
              Studio Undangan
            </Link>
            <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
              Area {area}
            </p>
          </div>
          <nav className="flex-1 space-y-1 p-3">
            {navItems.map((item) => {
              const active = isActive(item.to, item.exact);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition ${
                    active
                      ? "bg-foreground text-background"
                      : "text-foreground hover:bg-muted"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-border p-4 text-xs">
            <p className="font-medium">{user?.name}</p>
            <p className="truncate text-muted-foreground">{user?.email}</p>
              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  navigate({ to: "/login" });
                }}
              className="mt-2 text-muted-foreground underline hover:text-foreground"
            >
              Keluar
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-8">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {area}
                </p>
                <h1 className="truncate font-serif text-lg">{pageTitle(pathname)}</h1>
              </div>
              <RoleSwitcher />
            </div>
            {/* Mobile nav */}
            <nav
              aria-label="Navigasi mobile"
              className="flex gap-1 overflow-x-auto border-t border-border px-3 py-2 md:hidden"
            >
              {navItems.map((item) => {
                const active = isActive(item.to, item.exact);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`shrink-0 rounded-full px-3 py-1.5 text-xs transition ${
                      active
                        ? "bg-foreground text-background"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </header>
          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

function pageTitle(pathname: string): string {
  const map: Array<[RegExp, string]> = [
    [/^\/admin$/, "Dashboard"],
    [/^\/admin\/templates/, "Katalog Template"],
    [/^\/admin\/team/, "Kelola Akun WO"],
    [/^\/admin\/settings/, "Pengaturan"],
    [/^\/wo$/, "Daftar Proyek Undangan"],
    [/^\/wo\/projects\/[^/]+\/rsvp/, "RSVP & Ucapan"],
    [/^\/wo\/projects\/[^/]+/, "Editor Proyek"],
  ];
  for (const [re, title] of map) if (re.test(pathname)) return title;
  return "";
}
