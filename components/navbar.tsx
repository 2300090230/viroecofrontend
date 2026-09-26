"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, User } from "lucide-react";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/providers/auth-provider";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/products", label: "Shop" },
  { href: "/products?category=Drinkware", label: "Drinkware" },
  { href: "/#sustainability", label: "Sustainability" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { session, isAdmin, signOut } = useAuth();
  const { count } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="cursor-pointer font-display text-2xl tracking-tight">
          Viroeco
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="cursor-pointer text-sm text-foreground/80 transition-colors hover:text-terra-deep"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <AccountMenu session={session} isAdmin={isAdmin} signOut={signOut} />

          <Button asChild variant="ghost" size="icon" className="relative cursor-pointer">
            <Link href="/cart" aria-label={`Cart, ${count} items`}>
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-terra px-1 text-[10px] font-semibold text-primary-foreground">
                  {count}
                </span>
              )}
            </Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="cursor-pointer md:hidden" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background">
              <SheetTitle className="font-display text-xl px-4 pt-4">Viroeco</SheetTitle>
              <nav className="mt-4 flex flex-col px-2">
                {LINKS.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="cursor-pointer px-2 py-3 text-base text-foreground/90 hover:text-terra-deep"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}

function AccountMenu({
  session,
  isAdmin,
  signOut,
}: {
  session: ReturnType<typeof useAuth>["session"];
  isAdmin: boolean;
  signOut: () => void;
}) {
  if (!session) {
    return (
      <Button asChild variant="ghost" size="icon" className="cursor-pointer">
        <Link href="/login" aria-label="Sign in">
          <User className="h-5 w-5" />
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="cursor-pointer" aria-label="Account">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="truncate">{session.name || session.gmail}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isAdmin ? (
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/admin">Admin dashboard</Link>
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/orders">My orders</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/account">Account & addresses</Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="cursor-pointer">
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
