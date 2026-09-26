import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SmoothScroll } from "@/components/smooth-scroll";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </SmoothScroll>
  );
}
