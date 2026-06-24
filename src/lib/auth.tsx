// Fake auth — UI-only. Persists chosen role in localStorage so refreshes
// keep the session. Replace with real auth once backend lands; consumers
// only know about `useAuth()`.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Role = "admin" | "wo";

export interface FakeUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

const FAKE_USERS: Record<Role, FakeUser> = {
  admin: {
    id: "admin-1",
    name: "Admin Studio",
    email: "admin@studio.id",
    role: "admin",
  },
  wo: {
    id: "wo-1",
    name: "Anindya (WO)",
    email: "anindya@studio.id",
    role: "wo",
  },
};

interface AuthContextValue {
  user: FakeUser | null;
  signInAs: (role: Role) => void;
  signOut: () => void;
  switchRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "wedding-platform.role";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FakeUser | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY) as Role | null;
    if (stored && FAKE_USERS[stored]) setUser(FAKE_USERS[stored]);
  }, []);

  const signInAs = useCallback((role: Role) => {
    setUser(FAKE_USERS[role]);
    if (typeof window !== "undefined")
      window.localStorage.setItem(STORAGE_KEY, role);
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    if (typeof window !== "undefined")
      window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, signInAs, signOut, switchRole: signInAs }),
    [user, signInAs, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
