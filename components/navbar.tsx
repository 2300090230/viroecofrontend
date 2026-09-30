"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { QuoteDialog } from "@/components/quote-dialog";
import { Logo } from "@/components/logo";

const LINKS = [
  { href: "/products", label: "Our Products" },
  { href: "/categories", label: "Categories" },
  { href: "/impact", label: "Impact & Materials" },
  { href: "/calculator", label: "Savings Calculator" },
  { href: "/enterprise", label: "Enterprise Solutions" },
  { href: "/about", label: "Why Us" },
  { href: "/faq", label: "FAQ" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const { session, isAdmin, signOut } = useAuth();
  const { count } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 transition-all duration-300 backdrop-blur-xl",
          scrolled
            ? "border-b border-[#50644C]/15 bg-[#FAF9F5]/80 shadow-[0_4px_30px_rgba(36,48,33,0.05)]"
            : "border-b border-[#50644C]/10 bg-[#FAF9F5]/90",
        )}
      >
        <Container className="flex h-18 items-center justify-between gap-4">
          {/* Brand Logo */}
          <Logo size="md" imageClassName="h-10 w-auto" />

          {/* Glassy Nav Links Bar */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 p-1 bg-white/40 backdrop-blur-md border border-[#50644C]/12 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_2px_8px_rgba(0,0,0,0.02)]">
            {LINKS.map((l) => {
              const isActive = pathname === l.href || (l.href !== "/" && pathname?.startsWith(l.href));
              return (
                <Link
                  key={l.label}
                  href={l.href}
                  className={cn(
                    "cursor-pointer px-3 py-1.5 text-sm font-medium transition-all duration-200 rounded-none border",
                    isActive
                      ? "text-[#243021] bg-white/95 backdrop-blur-md font-semibold border-[#50644C]/35 shadow-[0_2px_10px_rgba(80,100,76,0.12),inset_0_1px_0_rgba(255,255,255,1)]"
                      : "text-[#1A241C]/80 border-transparent hover:text-[#50644C] hover:bg-white/80 hover:backdrop-blur-md hover:border-[#50644C]/25 hover:shadow-[0_4px_12px_rgba(80,100,76,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]"
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & CTA */}
          <div className="flex items-center gap-2">
            <AccountMenu session={session} isAdmin={isAdmin} signOut={signOut} />

            <Button
              asChild
              variant="ghost"
              size="icon"
              className="relative cursor-pointer bg-white/50 backdrop-blur-md border border-[#50644C]/15 hover:bg-white/90 hover:border-[#50644C]/30 hover:shadow-[0_4px_12px_rgba(80,100,76,0.08)] text-[#50644C] transition-all duration-200"
            >
              <Link href="/cart" aria-label={`Cart, ${count} items`}>
                <ShoppingBag className="h-5 w-5" />
                {count > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-none bg-[#50644C] px-1 text-[10px] font-semibold text-white shadow-xs">
                    {count}
                  </span>
                )}
              </Link>
            </Button>

            {/* Mobile Sheet */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer lg:hidden bg-white/50 backdrop-blur-md border border-[#50644C]/15 hover:bg-white/90 text-[#50644C] transition-all duration-200"
                  aria-label="Menu"
                >
                  <Menu className="h-5 w-5 text-[#50644C]" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#FAF9F5]/98 backdrop-blur-2xl border-l border-[#DFD5C6] w-[85vw] max-w-sm max-h-[100dvh] overflow-y-auto p-4 sm:p-6 flex flex-col justify-between">
                <div>
                  <SheetTitle className="px-2 pt-2">
                    <Logo size="md" imageClassName="h-9 w-auto" />
                  </SheetTitle>
                  <nav className="mt-6 flex flex-col space-y-1">
                    {session && (
                      <div className="mb-3 pb-3 border-b border-[#DFD5C6] px-2">
                        <p className="text-[10px] uppercase tracking-wider text-[#5A6659] font-bold">Logged In Account</p>
                        <p className="text-xs font-semibold text-[#17231C] truncate">{session.name || session.gmail}</p>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs">
                          {isAdmin ? (
                            <Link
                              href="/admin"
                              onClick={() => setOpen(false)}
                              className="font-semibold text-[#50644C] hover:underline"
                            >
                              Admin Dashboard →
                            </Link>
                          ) : (
                            <>
                              <Link
                                href="/profile"
                                onClick={() => setOpen(false)}
                                className="font-semibold text-[#50644C] hover:underline"
                              >
                                My Profile
                              </Link>
                              <span className="text-[#5A6659]">•</span>
                              <Link
                                href="/orders"
                                onClick={() => setOpen(false)}
                                className="font-semibold text-[#50644C] hover:underline"
                              >
                                My Orders
                              </Link>
                              <span className="text-[#5A6659]">•</span>
                              <Link
                                href="/account"
                                onClick={() => setOpen(false)}
                                className="font-semibold text-[#50644C] hover:underline"
                              >
                                Addresses
                              </Link>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                    {LINKS.map((l) => {
                      const isActive = pathname === l.href || (l.href !== "/" && pathname?.startsWith(l.href));
                      return (
                        <Link
                          key={l.label}
                          href={l.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "cursor-pointer px-3.5 py-2.5 rounded-none text-sm font-medium transition-all duration-200 border",
                            isActive
                              ? "text-[#243021] bg-white/90 backdrop-blur-md font-semibold border-[#50644C]/30 shadow-xs"
                              : "text-[#1A241C]/85 border-transparent hover:text-[#50644C] hover:bg-white/80 hover:backdrop-blur-md hover:border-[#50644C]/20 hover:shadow-xs"
                          )}
                        >
                          {l.label}
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-4 mt-6 border-t border-[#DFD5C6] space-y-3">
                  <Button
                    onClick={() => {
                      setOpen(false);
                      setQuoteOpen(true);
                    }}
                    className="w-full bg-[#50644C] hover:bg-[#384935] text-white rounded-none py-2.5 cursor-pointer shadow-xs text-xs font-semibold"
                  >
                    Request Enterprise Sample Kit
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </Container>
      </header>

      <QuoteDialog open={quoteOpen} onOpenChange={setQuoteOpen} />
    </>
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
      <Button
        asChild
        variant="ghost"
        size="icon"
        className="cursor-pointer bg-white/50 backdrop-blur-md border border-[#50644C]/15 hover:bg-white/90 hover:border-[#50644C]/30 hover:shadow-[0_4px_12px_rgba(80,100,76,0.08)] text-[#50644C] transition-all duration-200"
      >
        <Link href="/login" aria-label="Sign in">
          <User className="h-5 w-5" />
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer bg-white/50 backdrop-blur-md border border-[#50644C]/15 hover:bg-white/90 hover:border-[#50644C]/30 hover:shadow-[0_4px_12px_rgba(80,100,76,0.08)] text-[#50644C] transition-all duration-200"
          aria-label="Account"
        >
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-xl border-[#DFD5C6] text-[#17231C] rounded-none shadow-[0_12px_36px_rgba(0,0,0,0.08)]">
        <DropdownMenuLabel className="truncate font-semibold text-xs text-[#5A6659]">
          {session.name || session.gmail}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#DFD5C6]" />
        {isAdmin ? (
          <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/80 hover:backdrop-blur-md">
            <Link href="/admin">Admin Dashboard</Link>
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/80 hover:backdrop-blur-md font-medium">
              <Link href="/profile">My Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/80 hover:backdrop-blur-md">
              <Link href="/orders">My Orders</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/80 hover:backdrop-blur-md">
              <Link href="/account">Saved Addresses</Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator className="bg-[#DFD5C6]" />
        <DropdownMenuItem onClick={signOut} className="cursor-pointer text-red-600 hover:bg-red-50/80">
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
