"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { register, verifyOtp } from "@/lib/endpoints";
import { ApiError } from "@/lib/api";
import type { RegisterRequest } from "@/lib/types";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"details" | "otp">("details");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [form, setForm] = useState<RegisterRequest>({
    name: "",
    gmail: "",
    password: "",
    contactno: "",
    imageUrl: "",
    gender: "Male",
    dob: "",
  });

  const set = (k: keyof RegisterRequest, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submitDetails(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success("We emailed you a verification code.");
      setStep("otp");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  async function submitOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await verifyOtp(form.gmail, Number(otp));
      if (res.toLowerCase().includes("successful")) {
        toast.success("Account created. Please sign in.");
        router.push("/login");
      } else {
        toast.error(res);
      }
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  if (step === "otp") {
    return (
      <>
        <h1 className="font-display text-3xl">Verify your email</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter the 6-digit code sent to {form.gmail}.
        </p>
        <form onSubmit={submitOtp} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="otp">Verification code</Label>
            <Input
              id="otp"
              inputMode="numeric"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="text-center text-lg tracking-[0.3em]"
              maxLength={6}
            />
          </div>
          <Button type="submit" size="lg" className="w-full cursor-pointer" disabled={loading}>
            {loading ? "Verifying…" : "Verify & create account"}
          </Button>
          <button
            type="button"
            onClick={() => setStep("details")}
            className="w-full cursor-pointer text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to details
          </button>
        </form>
      </>
    );
  }

  return (
    <>
      <h1 className="font-display text-3xl">Create your account</h1>
      <p className="mt-1 text-sm text-muted-foreground">Join Viroeco in two quick steps.</p>

      <form onSubmit={submitDetails} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" required value={form.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="gmail">Email</Label>
          <Input
            id="gmail"
            type="email"
            autoComplete="email"
            required
            value={form.gmail}
            onChange={(e) => set("gmail", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="contactno">Phone</Label>
            <Input
              id="contactno"
              inputMode="tel"
              required
              value={form.contactno}
              onChange={(e) => set("contactno", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dob">Date of birth</Label>
            <Input id="dob" type="date" required value={form.dob} onChange={(e) => set("dob", e.target.value)} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="gender">Gender</Label>
          <Select value={form.gender} onValueChange={(v) => set("gender", v)}>
            <SelectTrigger id="gender" className="w-full cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" size="lg" className="w-full cursor-pointer" disabled={loading}>
          {loading ? "Sending code…" : "Continue"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="cursor-pointer text-terra-deep underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}
