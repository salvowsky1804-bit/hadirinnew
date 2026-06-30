import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Masuk — Studio Undangan" },
      {
        name: "description",
        content:
          "Halaman masuk internal tim studio undangan pernikahan.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { user, signIn, signUp, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (user) navigate({ to: user.role === "admin" ? "/admin" : "/wo" });
  }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setInfo(null);
    setBusy(true);
    const res =
      mode === "signin"
        ? await signIn(email, password)
        : await signUp(email, password, fullName);
    setBusy(false);
    if (res.error) {
      setErr(res.error);
      return;
    }
    if (mode === "signup") {
      setInfo(
        "Akun dibuat. Jika konfirmasi email aktif, cek inbox-mu. Lalu masuk dengan email & kata sandi.",
      );
      setMode("signin");
    }
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
          <h1 className="font-serif text-3xl">
            {mode === "signin" ? "Masuk ke Studio" : "Daftar Akun WO"}
          </h1>
          <p className="mt-2 text-sm text-[#6E655C]">
            {mode === "signin"
              ? "Gunakan email & kata sandi tim."
              : "Akun baru otomatis berperan WO. Admin diberikan oleh super-admin."}
          </p>

          <form onSubmit={submit} className="mt-6 space-y-3">
            {mode === "signup" && (
              <label className="block text-sm">
                <span>Nama lengkap</span>
                <input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 w-full rounded-md border border-[#E6DFD2] bg-white px-3 py-2 text-sm"
                />
              </label>
            )}
            <label className="block text-sm">
              <span>Email</span>
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md border border-[#E6DFD2] bg-white px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm">
              <span>Kata sandi</span>
              <input
                required
                type="password"
                minLength={6}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-md border border-[#E6DFD2] bg-white px-3 py-2 text-sm"
              />
            </label>

            {err && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
                {err}
              </p>
            )}
            {info && (
              <p className="rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                {info}
              </p>
            )}

            <button
              type="submit"
              disabled={busy || loading}
              className="w-full rounded-md bg-[#2B2622] px-4 py-2.5 text-sm font-medium text-[#F7F3EC] transition hover:bg-[#1a1612] disabled:opacity-50"
            >
              {busy
                ? "Memproses…"
                : mode === "signin"
                  ? "Masuk"
                  : "Daftar"}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[#6E655C]">
            {mode === "signin" ? (
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setErr(null);
                }}
                className="underline hover:text-[#2B2622]"
              >
                Belum punya akun? Daftar WO baru
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setErr(null);
                }}
                className="underline hover:text-[#2B2622]"
              >
                Sudah punya akun? Masuk
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
