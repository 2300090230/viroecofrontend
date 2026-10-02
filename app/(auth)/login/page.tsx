"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/providers/auth-provider";
import { requestPasswordReset } from "@/lib/endpoints";

function LoginForm() {
  const { signIn } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [form, setForm] = useState({ gmail: "", password: "" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const session = await signIn(form);
      toast.success("Login successful.");
      const next = params.get("next");
      router.push(session.role === "ADMIN" ? "/admin" : next || "/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-none bg-[#EDF2EB] text-[#50644C] text-[11px] font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Secure Member Portal
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-[#17231C]">
          Sign in to your account
        </h1>
        <p className="text-xs text-[#5A6659] leading-relaxed">
          Enter your registered email and password to access your dashboard.
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="gmail" className="text-xs font-bold text-[#17231C]">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#5A6659] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              id="gmail"
              type="email"
              placeholder="name@company.com"
              autoComplete="email"
              required
              value={form.gmail}
              onChange={(e) => setForm({ ...form, gmail: e.target.value })}
              className="pl-10 h-11 bg-[#FAF9F5] border-[#DFD5C6] focus-visible:ring-[#50644C] rounded-none text-sm"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs font-bold text-[#17231C]">
              Password
            </Label>
            <button
              type="button"
              onClick={async () => {
                if (!form.gmail.trim()) {
                  toast.error("Enter your email address first.");
                  return;
                }
                try {
                  await requestPasswordReset(form.gmail);
                  toast.success("Password reset link sent — check your email.");
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Could not send the reset email.");
                }
              }}
              className="text-xs text-[#50644C] hover:underline font-medium cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#5A6659] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="pl-10 pr-10 h-11 bg-[#FAF9F5] border-[#DFD5C6] focus-visible:ring-[#50644C] rounded-none text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5A6659] hover:text-[#17231C] cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 text-xs text-[#5A6659] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded-none border-[#DFD5C6] text-[#50644C] focus:ring-[#50644C] cursor-pointer"
            />
            Keep me signed in for 30 days
          </label>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full bg-[#50644C] hover:bg-[#243021] text-white rounded-none h-11 font-semibold text-sm cursor-pointer shadow-md hover:shadow-lg transition-all"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-none animate-spin" />
              Authenticating…
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Sign In to Portal
              <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </Button>
      </form>

      {/* Footer Switch */}
      <div className="mt-8 pt-6 border-t border-[#DFD5C6]/80 text-center">
        <p className="text-xs text-[#5A6659]">
          Don&apos;t have an enterprise or personal account?{" "}
          <Link
            href="/register"
            className="font-bold text-[#50644C] hover:underline underline-offset-4"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-72 flex items-center justify-center text-sm text-muted-foreground">Loading portal…</div>}>
      <LoginForm />
    </Suspense>
  );
}
