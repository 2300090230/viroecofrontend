"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/providers/auth-provider";
import { ApiError } from "@/lib/api";

function LoginForm() {
  const { signIn } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ gmail: "", password: "" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const session = await signIn(form);
      toast.success(`Welcome back, ${session.name || "friend"}`);
      const next = params.get("next");
      router.push(session.role === "ADMIN" ? "/admin" : next || "/");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 className="font-display text-3xl">Welcome back</h1>
      <p className="mt-1 text-sm text-muted-foreground">Sign in to continue.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="gmail">Email</Label>
          <Input
            id="gmail"
            type="email"
            autoComplete="email"
            required
            value={form.gmail}
            onChange={(e) => setForm({ ...form, gmail: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <Button type="submit" size="lg" className="w-full cursor-pointer" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        New to Viroeco?{" "}
        <Link href="/register" className="cursor-pointer text-terra-deep underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
