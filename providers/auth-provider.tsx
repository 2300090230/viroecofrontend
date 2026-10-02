"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { clearSession, getSession, setSession, type Session } from "@/lib/session";
import * as ep from "@/lib/endpoints";
import type { LoginRequest } from "@/lib/types";

interface AuthValue {
  session: Session | null;
  ready: boolean;
  isAdmin: boolean;
  signIn: (creds: LoginRequest) => Promise<Session>;
  signOut: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    setSessionState(getSession());
    setReady(true);

    // Drop a stale profile cookie (e.g. from the old backend login) when Supabase Auth has no session.
    ep.hasAuthSession().then((ok) => {
      if (!ok && getSession()) clearSession();
    });

    const handleSessionChange = () => {
      setSessionState(getSession());
    };

    window.addEventListener("ve_session_change", handleSessionChange);
    window.addEventListener("storage", handleSessionChange);

    return () => {
      window.removeEventListener("ve_session_change", handleSessionChange);
      window.removeEventListener("storage", handleSessionChange);
    };
  }, []);

  const signIn = useCallback(async (creds: LoginRequest) => {
    const s = await ep.login(creds);
    setSession(s);
    setSessionState(s);
    return s;
  }, []);

  const signOut = useCallback(() => {
    void ep.logout();
    clearSession();
    setSessionState(null);
    queryClient.clear();
    toast.success("Logout successful.");
    router.push("/");
  }, [queryClient, router]);

  return (
    <AuthContext.Provider
      value={{ session, ready, isAdmin: session?.role === "ADMIN", signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
