"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { register, resendVerificationCode, verifyOtp } from "@/lib/endpoints";
import { useAuth } from "@/providers/auth-provider";
import type { RegisterRequest } from "@/lib/types";

export default function RegisterPage() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [step, setStep] = useState<"details" | "otp">("details");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [otp, setOtp] = useState("");
  const [form, setForm] = useState<RegisterRequest>({
    name: "",
    gmail: "",
    password: "",
    contactno: "",
    gender: "Male",
    dob: "",
  });

  const set = (k: keyof RegisterRequest, v: string) => setForm((f) => ({ ...f, [k]: v }));

  // Password strength calculation
  const pass = form.password;
  const hasLength = pass.length >= 8;
  const hasNumber = /\d/.test(pass);
  const hasSpecial = /[^A-Za-z0-9]/.test(pass);
  const score = [hasLength, hasNumber, hasSpecial].filter(Boolean).length;

  async function submitDetails(e: React.FormEvent) {
    e.preventDefault();
    if (!agreedTerms) {
      toast.error("Please accept the terms & conditions to proceed.");
      return;
    }
    setLoading(true);
    try {
      const message = await register(form);
      toast.success(message || "Verification code sent to your email.");
      setStep("otp");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to register account");
    } finally {
      setLoading(false);
    }
  }

  async function submitOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await verifyOtp(form.gmail, otp);
      setSession(user); // the backend signs the new customer in on successful verification
      toast.success("Welcome to VIRO eco! Your account is ready.");
      router.push("/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid verification code. Please check and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Step Indicator */}
      <div className="mb-6 flex items-center justify-between pb-4 border-b border-line">
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
              step === "details"
                ? "bg-forest text-white"
                : "bg-emerald-100 text-emerald-800"
            }`}
          >
            1
          </div>
          <span className={`text-xs font-semibold ${step === "details" ? "text-ink" : "text-muted-foreground"}`}>
            Account Details
          </span>
        </div>

        <div className="h-0.5 w-8 bg-line" />

        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
              step === "otp"
                ? "bg-forest text-white"
                : "bg-sand text-muted-foreground"
            }`}
          >
            2
          </div>
          <span className={`text-xs font-semibold ${step === "otp" ? "text-ink" : "text-muted-foreground"}`}>
            Verify &amp; Activate
          </span>
        </div>
      </div>

      {step === "otp" ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sage-wash text-forest text-[11px] font-bold uppercase tracking-wider">
              <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
              Two-Factor Activation
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
              Verify your email
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We&apos;ve sent a verification code to{" "}
              <strong className="text-ink font-semibold">{form.gmail}</strong>.
            </p>
          </div>

          <form onSubmit={submitOtp} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="otp" className="text-xs font-bold text-ink">
                Verification Code
              </Label>
              <Input
                id="otp"
                inputMode="numeric"
                required
                autoFocus
                placeholder="6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="text-center text-2xl tracking-[0.4em] font-mono h-14 bg-cream border-line focus-visible:ring-forest rounded-md font-bold text-forest"
                maxLength={6}
                autoComplete="one-time-code"
              />
              <p className="text-[11px] text-muted-foreground text-center">
                Didn&apos;t get it?{" "}
                <button
                  type="button"
                  className="cursor-pointer font-semibold text-forest underline"
                  onClick={() =>
                    resendVerificationCode(form.gmail)
                      .then(() => toast.success("A new code has been sent."))
                      .catch((err: Error) => toast.error(err.message))
                  }
                >
                  Resend code
                </button>
              </p>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-forest hover:bg-forest-dark text-white rounded-md h-11 font-semibold text-sm cursor-pointer shadow-md hover:shadow-lg transition-all"
              disabled={loading || otp.length < 6}
            >
              {loading ? "Activating Account…" : "Verify & Complete Registration"}
            </Button>

            <button
              type="button"
              onClick={() => setStep("details")}
              className="w-full flex items-center justify-center gap-1.5 cursor-pointer text-xs text-muted-foreground hover:text-ink font-semibold pt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Edit Details
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
              Create an account
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Register to access whole-catalog ordering, custom embossing, and enterprise discount pricing.
            </p>
          </div>

          <form onSubmit={submitDetails} className="space-y-3.5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-bold text-ink">
                Full Name / Organization Contact
              </Label>
              <div className="relative">
                <User className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input
                  id="name"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  className="pl-10 h-10 bg-cream border-line rounded-md text-sm"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <Label htmlFor="gmail" className="text-xs font-bold text-ink">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input
                  id="gmail"
                  type="email"
                  placeholder="name@company.com"
                  autoComplete="email"
                  required
                  value={form.gmail}
                  onChange={(e) => set("gmail", e.target.value)}
                  className="pl-10 h-10 bg-cream border-line rounded-md text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-bold text-ink">
                Create Password
              </Label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  className="pl-10 pr-10 h-10 bg-cream border-line rounded-md text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-ink cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {form.password && (
                <div className="space-y-1 pt-1">
                  <div className="flex gap-1 h-1">
                    <div
                      className={`flex-1 rounded-md ${
                        score >= 1 ? "bg-amber-400" : "bg-gray-200"
                      }`}
                    />
                    <div
                      className={`flex-1 rounded-md ${
                        score >= 2 ? "bg-emerald-500" : "bg-gray-200"
                      }`}
                    />
                    <div
                      className={`flex-1 rounded-md ${
                        score >= 3 ? "bg-emerald-600" : "bg-gray-200"
                      }`}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {score <= 1 && "Weak password"}
                    {score === 2 && "Good password"}
                    {score >= 3 && "Strong password"}
                  </p>
                </div>
              )}
            </div>

            {/* Phone & DOB */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="contactno" className="text-xs font-bold text-ink">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input
                    id="contactno"
                    inputMode="tel"
                    placeholder="98765 43210"
                    pattern={"^(\\+91[\\- ]?)?[6-9][0-9]{9}$"}
                    title="10-digit Indian mobile number"
                    required
                    value={form.contactno}
                    onChange={(e) => set("contactno", e.target.value)}
                    className="pl-10 h-10 bg-cream border-line rounded-md text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="dob" className="text-xs font-bold text-ink">
                  Date of Birth
                </Label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input
                    id="dob"
                    type="date"
                    required
                    value={form.dob}
                    onChange={(e) => set("dob", e.target.value)}
                    className="pl-10 h-10 bg-cream border-line rounded-md text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <Label htmlFor="gender" className="text-xs font-bold text-ink">
                Gender
              </Label>
              <Select value={form.gender} onValueChange={(v) => set("gender", v)}>
                <SelectTrigger id="gender" className="w-full h-10 bg-cream border-line rounded-md text-sm cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other / Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Terms Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 text-xs text-muted-foreground cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 rounded-md border-line text-forest focus:ring-forest cursor-pointer"
                />
                <span>
                  I agree to the{" "}
                  <Link href="/terms" className="underline font-medium text-forest">
                    Terms of Service
                  </Link>
                  ,{" "}
                  <Link href="/privacy" className="underline font-medium text-forest">
                    Privacy Policy
                  </Link>
                  , and Viroeco Sustainability Charter.
                </span>
              </label>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-forest hover:bg-forest-dark text-white rounded-md h-11 font-semibold text-sm cursor-pointer shadow-md hover:shadow-lg transition-all mt-2"
              disabled={loading || !agreedTerms}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-md animate-spin" />
                  Generating Verification Code…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Continue to Verification
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Footer Switch */}
          <div className="pt-4 border-t border-line/80 text-center">
            <p className="text-xs text-muted-foreground">
              Already registered with Viroeco?{" "}
              <Link
                href="/login"
                className="font-bold text-forest hover:underline underline-offset-4"
              >
                Sign in to your account
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
