"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
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
  }, []);

  const signIn = useCallback(async (creds: LoginRequest) => {
    const s = await ep.login(creds);
    setSession(s);
    setSessionState(s);
    return s;
  }, []);

  const signOut = useCallback(() => {
    clearSession();
    setSessionState(null);
    queryClient.clear();
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
