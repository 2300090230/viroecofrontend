import Link from "next/link";
import { Container } from "@/components/container";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-sand">
      <Container className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <p className="font-display text-3xl tracking-tight">Viroeco</p>
          <p className="mt-3 max-w-sm leading-relaxed text-muted-foreground">
            Earth-kind drinkware and kitchen essentials, crafted from rice husk and bamboo
            composite. Beautiful, unbreakable, low-carbon.
          </p>
        </div>

        <nav className="flex flex-col gap-2">
          <p className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">Shop</p>
          <Link href="/products" className="cursor-pointer text-sm hover:text-terra-deep">
            All products
          </Link>
          <Link
            href="/products?category=Drinkware"
            className="cursor-pointer text-sm hover:text-terra-deep"
          >
            Drinkware
          </Link>
          <Link href="/cart" className="cursor-pointer text-sm hover:text-terra-deep">
            Cart
          </Link>
        </nav>

        <nav className="flex flex-col gap-2">
          <p className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">Account</p>
          <Link href="/login" className="cursor-pointer text-sm hover:text-terra-deep">
            Sign in
          </Link>
          <Link href="/register" className="cursor-pointer text-sm hover:text-terra-deep">
            Create account
          </Link>
          <Link href="/orders" className="cursor-pointer text-sm hover:text-terra-deep">
            My orders
          </Link>
        </nav>
      </Container>
      <Container className="flex flex-col items-start justify-between gap-2 border-t border-border py-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} Viroeco. All rights reserved.</p>
        <p>Made with rice husk, not plastic.</p>
      </Container>
    </footer>
  );
}
