"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronDown,
  CircleHelp,
  Menu,
  Search,
  ShoppingCart,
  Truck,
  User,
} from "lucide-react";
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
import { getCategories } from "@/lib/endpoints";
import { cn } from "@/lib/utils";
import { QuoteDialog } from "@/components/quote-dialog";
import { Logo } from "@/components/logo";

type NavLink = { href: string; label: string };

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  // "Categories" dropdown is rendered between these two groups
  { href: "/impact", label: "Sustainability" },
  { href: "/about", label: "About Us" },
  { href: "/enterprise", label: "Bulk & Corporate" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

function useCategories() {
  return useQuery({
    queryKey: ["nav-categories"],
    queryFn: async () => {
      const cats = await getCategories();
      return [...cats].sort((a, b) => a.name.localeCompare(b.name));
    },
    staleTime: 5 * 60_000,
  });
}

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const { session, isAdmin, signOut } = useAuth();
  const { count } = useCart();
  const categories = useCategories();

  return (
    <>
      {/* Announcement bar — scrolls away; the main header below stays pinned */}
      <div className="bg-forest-dark text-white/90 no-print">
        <Container className="flex h-9 items-center justify-between gap-4 text-xs">
          <p className="truncate">Sustainable products for a better everyday</p>
          <div className="hidden sm:flex items-center divide-x divide-white/25">
            <Link href="/orders" className="flex items-center gap-1.5 px-3 hover:text-white transition-colors">
              <Truck className="h-3.5 w-3.5" aria-hidden /> Track Order
            </Link>
            <Link href="/faq" className="flex items-center gap-1.5 pl-3 hover:text-white transition-colors">
              <CircleHelp className="h-3.5 w-3.5" aria-hidden /> Help
            </Link>
          </div>
        </Container>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85 no-print">
        <Container className="flex h-[72px] items-center gap-4 lg:gap-8">
          {/* Logo keeps its fixed slot and aspect ratio at every breakpoint */}
          <Logo size="lg" className="shrink-0" imageClassName="h-10 sm:h-11 w-auto" />

          <HeaderSearch className="hidden md:flex flex-1 max-w-xl mx-auto" />

          <div className="ml-auto flex items-center gap-1 sm:gap-3">
            <AccountMenu session={session} isAdmin={isAdmin} signOut={signOut} />

            <Link
              href="/cart"
              aria-label={`Cart, ${count} items`}
              className="relative flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-ink hover:text-forest transition-colors"
            >
              <span className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span
                  className={cn(
                    "absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white",
                    count > 0 ? "bg-forest" : "bg-olive/70",
                  )}
                >
                  {count}
                </span>
              </span>
              <span className="hidden sm:inline">Cart</span>
            </Link>

            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-ink" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[86vw] max-w-sm overflow-y-auto bg-white p-0">
                <SheetTitle className="border-b border-line px-5 py-4">
                  <Logo size="md" imageClassName="h-9 w-auto" />
                </SheetTitle>
                <MobileMenu
                  pathname={pathname}
                  categories={categories.data ?? []}
                  session={session}
                  isAdmin={isAdmin}
                  signOut={signOut}
                  close={() => setMenuOpen(false)}
                  openQuote={() => {
                    setMenuOpen(false);
                    setQuoteOpen(true);
                  }}
                />
              </SheetContent>
            </Sheet>
          </div>
        </Container>

        {/* Search on small screens */}
        <Container className="pb-3 md:hidden">
          <HeaderSearch />
        </Container>

        {/* Primary navigation */}
        <nav aria-label="Primary" className="hidden lg:block border-t border-line">
          <Container className="flex h-11 items-center justify-center gap-1 xl:gap-3">
            {NAV_LINKS.slice(0, 2).map((l) => (
              <NavItem key={l.href} link={l} active={isActive(pathname, l.href)} />
            ))}
            <CategoriesMenu categories={categories.data ?? []} active={pathname === "/categories"} />
            {NAV_LINKS.slice(2).map((l) => (
              <NavItem key={l.href} link={l} active={isActive(pathname, l.href)} />
            ))}
          </Container>
        </nav>
      </header>

      <QuoteDialog open={quoteOpen} onOpenChange={setQuoteOpen} />
    </>
  );
}

function NavItem({ link, active }: { link: NavLink; active: boolean }) {
  return (
    <Link
      href={link.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative px-3 py-2.5 text-sm font-medium transition-colors",
        active ? "text-forest" : "text-ink/85 hover:text-forest",
        "after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:rounded-full after:bg-forest after:transition-transform after:origin-left",
        active ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100",
      )}
    >
      {link.label}
    </Link>
  );
}

function CategoriesMenu({ categories, active }: { categories: { id: number; name: string }[]; active: boolean }) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center gap-1 px-3 py-2.5 text-sm font-medium outline-none transition-colors data-[state=open]:text-forest",
          active ? "text-forest" : "text-ink/85 hover:text-forest",
        )}
      >
        Categories <ChevronDown className="h-3.5 w-3.5" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-60 p-1.5">
        {categories.length === 0 ? (
          <p className="px-2 py-3 text-xs text-muted-foreground">Categories are loading…</p>
        ) : (
          categories.map((c) => (
            <DropdownMenuItem key={c.id} asChild className="cursor-pointer">
              <Link href={`/products?category=${encodeURIComponent(c.name)}`}>{c.name}</Link>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer font-medium text-forest">
          <Link href="/categories">View all categories</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function HeaderSearch({ className }: { className?: string }) {
  const router = useRouter();
  const [value, setValue] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/products?query=${encodeURIComponent(q)}` : "/products");
  };

  return (
    <form role="search" onSubmit={submit} className={cn("flex w-full", className)}>
      <label htmlFor="site-search" className="sr-only">
        Search products
      </label>
      <input
        id="site-search"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search mugs, plates, planters, storage…"
        className="h-11 w-full min-w-0 rounded-l-md border border-r-0 border-input bg-cream px-4 text-sm text-ink placeholder:text-muted-foreground outline-none focus:border-forest focus:bg-white focus:ring-2 focus:ring-forest/15"
      />
      <button
        type="submit"
        aria-label="Search"
        className="flex h-11 w-12 shrink-0 items-center justify-center rounded-r-md bg-forest text-white hover:bg-forest-dark transition-colors"
      >
        <Search className="h-4.5 w-4.5" />
      </button>
    </form>
  );
}

function MobileMenu({
  pathname,
  categories,
  session,
  isAdmin,
  signOut,
  close,
  openQuote,
}: {
  pathname: string | null;
  categories: { id: number; name: string }[];
  session: ReturnType<typeof useAuth>["session"];
  isAdmin: boolean;
  signOut: () => void;
  close: () => void;
  openQuote: () => void;
}) {
  const [catsOpen, setCatsOpen] = useState(false);
  const linkCls = (active: boolean) =>
    cn(
      "block rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
      active ? "bg-sage-wash text-forest" : "text-ink hover:bg-sand",
    );

  return (
    <div className="flex min-h-[calc(100dvh-73px)] flex-col justify-between">
      <nav aria-label="Mobile" className="space-y-1 p-4">
        {NAV_LINKS.slice(0, 2).map((l) => (
          <Link key={l.href} href={l.href} onClick={close} className={linkCls(isActive(pathname, l.href))}>
            {l.label}
          </Link>
        ))}
        <button
          type="button"
          onClick={() => setCatsOpen((o) => !o)}
          aria-expanded={catsOpen}
          className={cn(linkCls(false), "flex w-full items-center justify-between")}
        >
          Categories
          <ChevronDown className={cn("h-4 w-4 transition-transform", catsOpen && "rotate-180")} />
        </button>
        {catsOpen && (
          <div className="ml-3 space-y-0.5 border-l border-line pl-3">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/products?category=${encodeURIComponent(c.name)}`}
                onClick={close}
                className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-sand hover:text-ink"
              >
                {c.name}
              </Link>
            ))}
            <Link href="/categories" onClick={close} className="block px-3 py-2 text-sm font-medium text-forest">
              View all categories
            </Link>
          </div>
        )}
        {NAV_LINKS.slice(2).map((l) => (
          <Link key={l.href} href={l.href} onClick={close} className={linkCls(isActive(pathname, l.href))}>
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="space-y-3 border-t border-line p-4">
        {session ? (
          <div className="space-y-1">
            <p className="px-3 text-xs text-muted-foreground">Signed in as</p>
            <p className="truncate px-3 text-sm font-semibold text-ink">{session.name || session.gmail}</p>
            {isAdmin ? (
              <Link href="/admin" onClick={close} className={linkCls(false)}>
                Admin dashboard
              </Link>
            ) : (
              <>
                <Link href="/profile" onClick={close} className={linkCls(false)}>My profile</Link>
                <Link href="/orders" onClick={close} className={linkCls(false)}>My orders</Link>
                <Link href="/account" onClick={close} className={linkCls(false)}>Saved addresses</Link>
              </>
            )}
            <button type="button" onClick={signOut} className={cn(linkCls(false), "w-full text-left text-destructive")}>
              Sign out
            </button>
          </div>
        ) : (
          <Button asChild className="w-full">
            <Link href="/login" onClick={close}>Sign in</Link>
          </Button>
        )}
        <Button variant="outline" className="w-full" onClick={openQuote}>
          Request a bulk quote
        </Button>
      </div>
    </div>
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
  const label = (
    <>
      <User className="h-5 w-5" />
      <span className="hidden sm:inline">Account</span>
    </>
  );
  const cls =
    "flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-ink hover:text-forest transition-colors outline-none";

  if (!session) {
    return (
      <Link href="/login" aria-label="Sign in" className={cls}>
        {label}
      </Link>
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className={cls} aria-label="Account">
        {label}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate text-xs font-normal text-muted-foreground">
          {session.name || session.gmail}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isAdmin ? (
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/admin">Admin dashboard</Link>
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/profile">My profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/orders">My orders</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/account">Saved addresses</Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive focus:text-destructive">
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
