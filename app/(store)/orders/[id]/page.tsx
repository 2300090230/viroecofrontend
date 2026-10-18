"use client";

import Link from "next/link";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/components/page-header";
import { Invoice, invoiceNumber } from "@/components/invoice";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getOrder } from "@/lib/endpoints";
import { useAddresses } from "@/hooks/use-addresses";
import { useAuth } from "@/providers/auth-provider";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { session } = useAuth();
  const { list: addresses } = useAddresses();
  const order = useQuery({
    queryKey: ["orders", id],
    queryFn: () => getOrder(id),
    enabled: !!session,
  });

  const address = addresses.data?.find((a) => a.id === order.data?.addressId);

  // Browsers' "Save as PDF" produces the downloadable invoice; print CSS isolates #invoice.
  const printInvoice = (asPdf: boolean) => {
    if (!order.data) return;
    const previous = document.title;
    if (asPdf) document.title = `${invoiceNumber(order.data.id)}-VIRO-eco`;
    window.print();
    document.title = previous;
  };

  return (
    <div className="bg-cream">
      <Container className="py-6 sm:py-8">
        <div className="print:hidden">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "My orders", href: "/orders" }, { label: `Order #${id}` }]} />
          <Link href="/orders" className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-forest">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to orders
          </Link>
        </div>

        {order.isLoading || !session ? (
          <Skeleton className="mx-auto mt-6 h-[520px] w-full max-w-[820px] rounded-xl" />
        ) : order.isError || !order.data ? (
          <div className="mx-auto mt-10 max-w-md rounded-xl border border-line bg-white p-8 text-center">
            <p className="text-lg font-semibold">Order not found</p>
            <p className="mt-1 text-sm text-muted-foreground">It may belong to a different account.</p>
            <Button asChild className="mt-5">
              <Link href="/orders">View my orders</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="mx-auto mt-4 flex max-w-[820px] flex-wrap items-center justify-between gap-4 print:hidden">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold text-ink sm:text-3xl">Order #{order.data.id}</h1>
                <OrderStatusBadge status={order.data.status} />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => printInvoice(false)}>
                  <Printer className="h-4 w-4" aria-hidden /> Print
                </Button>
                <Button onClick={() => printInvoice(true)}>
                  <Download className="h-4 w-4" aria-hidden /> Download PDF
                </Button>
              </div>
            </div>
            <p className="mx-auto mt-1 max-w-[820px] text-sm text-muted-foreground print:hidden">
              Placed on {new Date(order.data.createdAt).toLocaleString("en-IN")}
            </p>

            <div className="mt-6">
              <Invoice
                order={order.data}
                customer={{ name: session.name, email: session.gmail, phone: session.contactno }}
                address={address}
              />
            </div>
          </>
        )}
      </Container>
    </div>
  );
}
