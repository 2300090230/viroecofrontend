"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SESSION_EXPIRED_EVENT } from "@/lib/api-client";
import * as ep from "@/lib/endpoints";
import type { Session } from "@/lib/session";
import type { LoginRequest } from "@/lib/types";

interface AuthValue {
  session: Session | null;
  /** False until the first /api/auth/me check finishes. */
  ready: boolean;
  isAdmin: boolean;
  signIn: (creds: LoginRequest) => Promise<Session>;
  signOut: () => Promise<void>;
  /** Replace the cached profile after the user edits it (or after OTP verification signs them in). */
  setSession: (session: Session | null) => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  // The backend is the source of truth: ask it who is signed in (refreshing the session if needed).
  useEffect(() => {
    let active = true;
    ep.getCurrentUser()
      .then((user) => active && setSession(user))
      .catch(() => active && setSession(null))
      .finally(() => active && setReady(true));

    const onExpired = () => {
      setSession(null);
      queryClient.removeQueries({ queryKey: ["cart"] });
    };
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => {
      active = false;
      window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
    };
  }, [queryClient]);

  const signIn = useCallback(
    async (creds: LoginRequest) => {
      const user = await ep.login(creds);
      queryClient.clear();
      setSession(user);
      return user;
    },
    [queryClient],
  );

  const signOut = useCallback(async () => {
    try {
      await ep.logout();
    } finally {
      setSession(null);
      queryClient.clear();
      toast.success("You have been signed out.");
      router.push("/");
      router.refresh();
    }
  }, [queryClient, router]);

  const value = useMemo(
    () => ({ session, ready, isAdmin: session?.role === "ADMIN", signIn, signOut, setSession }),
    [session, ready, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
