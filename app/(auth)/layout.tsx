import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grain relative flex min-h-screen flex-col items-center justify-center px-5 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-terra/15 blur-3xl"
      />
      <Link href="/" className="cursor-pointer font-display text-3xl tracking-tight">
        Viroeco
      </Link>
      <div className="relative mt-8 w-full max-w-md border border-border bg-card p-8">{children}</div>
    </div>
  );
}
