import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/providers/providers";

export const metadata: Metadata = {
  title: {
    default: "Viroeco — Sustainable Home & Kitchen",
    template: "%s · Viroeco",
  },
  description:
    "Viroeco crafts earth-kind drinkware and kitchen essentials from rice husk and bamboo composite. Beautiful, unbreakable, low-carbon.",
  metadataBase: new URL("http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
