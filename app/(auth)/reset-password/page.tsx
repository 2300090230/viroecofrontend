"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Eye, EyeOff, KeyRound, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordReset, resetPassword } from "@/lib/endpoints";

const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*\d).{8,72}$/;

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [step, setStep] = useState<"email" | "code">("email");
  const [gmail, setGmail] = useState(params.get("email") ?? "");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  async function sendCode(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    try {
      const message = await requestPasswordReset(gmail);
      toast.success(message || "If an account exists for this email, we sent a code to it.");
      setStep("code");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send the code");
    } finally {
      setLoading(false);
    }
  }

  async function submitReset(e: React.FormEvent) {
    e.preventDefault();
    if (!PASSWORD_RULE.test(password)) {
      toast.error("Password must be 8–72 characters and include a letter and a number.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(gmail, code, password);
      toast.success("Password updated. Please sign in with your new password.");
      router.push(`/login?email=${encodeURIComponent(gmail.trim())}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not reset your password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-md bg-sage-wash px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-forest">
          <KeyRound className="h-3.5 w-3.5" aria-hidden />
          Account recovery
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          {step === "email" ? "Reset your password" : "Enter your code"}
        </h1>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {step === "email"
            ? "We'll email you a 6-digit code to confirm it's you."
            : `We sent a code to ${gmail.trim()}. It expires in 10 minutes.`}
        </p>
      </div>

      {step === "email" ? (
        <form onSubmit={sendCode} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="gmail" className="text-xs font-bold text-ink">Email address</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="gmail"
                type="email"
                autoComplete="email"
                required
                value={gmail}
                onChange={(e) => setGmail(e.target.value)}
                className="h-11 rounded-md border-line bg-cream pl-10 text-sm"
              />
            </div>
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Sending…" : "Send reset code"}
          </Button>
        </form>
      ) : (
        <form onSubmit={submitReset} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="code" className="text-xs font-bold text-ink">6-digit code</Label>
            <Input
              id="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              autoFocus
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className="h-14 rounded-md border-line bg-cream text-center font-mono text-2xl font-bold tracking-[0.4em] text-forest"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-bold text-ink">New password</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={show ? "text" : "password"}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-md border-line bg-cream pl-10 pr-10 text-sm"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-ink"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground">At least 8 characters, with a letter and a number.</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm" className="text-xs font-bold text-ink">Confirm new password</Label>
            <Input
              id="confirm"
              type={show ? "text" : "password"}
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="h-11 rounded-md border-line bg-cream text-sm"
            />
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={loading || code.length !== 6}>
            {loading ? "Updating…" : "Update password"}
          </Button>
          <p className="text-center text-[11px] text-muted-foreground">
            Didn&apos;t get it?{" "}
            <button type="button" onClick={() => sendCode()} disabled={loading} className="font-semibold text-forest underline">
              Send a new code
            </button>{" "}
            ·{" "}
            <button type="button" onClick={() => setStep("email")} className="font-semibold text-forest underline">
              Use a different email
            </button>
          </p>
        </form>
      )}

      <Link href="/login" className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-forest">
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Back to sign in
      </Link>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
