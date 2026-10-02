"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { KeyRound, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { completePasswordReset, startPasswordRecovery } from "@/lib/endpoints";

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState<"checking" | "ready" | "invalid">("checking");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    startPasswordRecovery(params.get("code")).then((ok) => setStatus(ok ? "ready" : "invalid"));
  }, [params]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await completePasswordReset(password);
      toast.success("Password updated. Please sign in.");
      router.push("/login");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to set the new password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-none bg-[#EDF2EB] text-[#50644C] text-[11px] font-bold uppercase tracking-wider">
          <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
          Account Recovery
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-[#17231C]">
          Set a new password
        </h1>
      </div>

      {status === "checking" && (
        <p className="mt-6 text-sm text-[#5A6659]">Verifying your reset link…</p>
      )}

      {status === "invalid" && (
        <div className="mt-6 space-y-4">
          <p className="text-sm text-[#5A6659]">
            This reset link is invalid or has expired. Request a new one from the sign-in page
            (open the link in the same browser you requested it from).
          </p>
          <Link href="/login" className="text-sm font-bold text-[#50644C] hover:underline underline-offset-4">
            Back to sign in
          </Link>
        </div>
      )}

      {status === "ready" && (
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {[
            { id: "new-password", label: "New password", value: password, set: setPassword },
            { id: "confirm-password", label: "Confirm new password", value: confirm, set: setConfirm },
          ].map((f) => (
            <div key={f.id} className="space-y-1.5">
              <Label htmlFor={f.id} className="text-xs font-bold text-[#17231C]">
                {f.label}
              </Label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#5A6659] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input
                  id={f.id}
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  className="pl-10 h-11 bg-[#FAF9F5] border-[#DFD5C6] focus-visible:ring-[#50644C] rounded-none text-sm"
                />
              </div>
            </div>
          ))}

          <Button
            type="submit"
            size="lg"
            className="w-full bg-[#50644C] hover:bg-[#243021] text-white rounded-none h-11 font-semibold text-sm cursor-pointer shadow-md hover:shadow-lg transition-all"
            disabled={loading}
          >
            {loading ? "Saving…" : "Update password"}
          </Button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="h-72 flex items-center justify-center text-sm text-muted-foreground">Loading…</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
