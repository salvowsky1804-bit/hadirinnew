import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useAuth, type Role } from "@/lib/auth";
import { useEffect } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Masuk — Studio Undangan" },
      {
        name: "description",
        content:
          "Halaman masuk internal tim studio undangan pernikahan. Pilih peran Admin atau WO untuk pengujian.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { user, signInAs } = useAuth();
  const navigate = useNavigate();

  // If somehow already signed in, drop them on their dashboard.
  useEffect(() => {
    if (user) navigate({ to: user.role === "admin" ? "/admin" : "/wo" });
  }, [user, navigate]);

  const enter = (role: Role) => {
    signInAs(role);
    navigate({ to: role === "admin" ? "/admin" : "/wo" });
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#F7F3EC] px-4 py-16 text-[#2B2622]">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-8 inline-block text-xs uppercase tracking-[0.3em] text-[#6E655C] hover:text-[#2B2622]"
        >
          ← Kembali ke beranda
        </Link>
        <div className="rounded-2xl border border-[#E6DFD2] bg-white/70 p-8 shadow-sm backdrop-blur">
          <h1 className="font-serif text-3xl">Masuk ke Studio</h1>
          <p className="mt-2 text-sm text-[#6E655C]">
            Alat kerja internal tim. Untuk fase pengujian, pilih salah satu jalur
            di bawah untuk masuk tanpa kata sandi.
          </p>

          <form
            className="mt-6 space-y-3"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Form masuk (nonaktif)"
          >
            <label className="block text-sm">
              <span className="text-[#2B2622]">Email</span>
              <input
                type="email"
                placeholder="nama@studio.id"
                disabled
                className="mt-1 w-full rounded-md border border-[#E6DFD2] bg-white/50 px-3 py-2 text-sm placeholder:text-[#A89F94]"
              />
            </label>
            <label className="block text-sm">
              <span className="text-[#2B2622]">Kata sandi</span>
              <input
                type="password"
                placeholder="••••••••"
                disabled
                className="mt-1 w-full rounded-md border border-[#E6DFD2] bg-white/50 px-3 py-2 text-sm placeholder:text-[#A89F94]"
              />
            </label>
            <button
              type="submit"
              disabled
              className="w-full rounded-md bg-[#6E2A36]/40 px-4 py-2 text-sm font-medium text-white"
            >
              Masuk (segera hadir)
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-[#A89F94]">
            <span className="h-px flex-1 bg-[#E6DFD2]" />
            <span>Jalur uji</span>
            <span className="h-px flex-1 bg-[#E6DFD2]" />
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => enter("admin")}
              className="rounded-md border border-[#2B2622] bg-[#2B2622] px-4 py-3 text-sm font-medium text-[#F7F3EC] transition hover:bg-[#1a1612]"
            >
              Masuk sebagai Admin
            </button>
            <button
              type="button"
              onClick={() => enter("wo")}
              className="rounded-md border border-[#6E2A36] bg-[#6E2A36] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#581f29]"
            >
              Masuk sebagai WO
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
