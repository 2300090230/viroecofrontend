"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { AddressFormDialog } from "@/components/address-form-dialog";
import { useAuth } from "@/providers/auth-provider";
import { useAddresses } from "@/hooks/use-addresses";
import { updateProfileImage, removeProfileImage } from "@/lib/endpoints";

export default function AccountPage() {
  const { session } = useAuth();
  const { list, remove } = useAddresses();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !session) return;
    setUploading(true);
    try {
      await updateProfileImage(session.gmail, file);
      toast.success("Image uploaded successfully.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function onRemovePhoto() {
    if (!session) return;
    setUploading(true);
    try {
      await removeProfileImage(session.gmail);
      toast.success("Profile photo removed.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove photo.");
    } finally {
      setUploading(false);
    }
  }

  if (!session) return null;
  const initials = (session.name || session.gmail).slice(0, 2).toUpperCase();
  const addresses = list.data ?? [];

  return (
    <div className="pt-24">
      <Container className="py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="font-display text-4xl tracking-tight sm:text-5xl">Account &amp; Addresses</h1>
          <Button asChild className="bg-[#50644C] hover:bg-[#384935] text-white self-start sm:self-auto">
            <Link href="/profile">View &amp; Edit My Profile →</Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[20rem_1fr]">
          <section className="h-fit border border-border bg-card p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 border border-border">
                {session.imageUrl ? <AvatarImage src={session.imageUrl} alt={session.name} /> : null}
                <AvatarFallback className="bg-sand font-display text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <p className="mt-4 font-display text-xl">{session.name}</p>
              <p className="text-sm text-muted-foreground">{session.gmail}</p>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer text-xs"
                  disabled={uploading}
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload className="mr-1 h-3.5 w-3.5" /> {uploading ? "Uploading…" : "Change photo"}
                </Button>
                {session.imageUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer border-red-200 text-red-600 hover:bg-red-50 text-xs"
                    disabled={uploading}
                    onClick={onRemovePhoto}
                  >
                    <Trash2 className="mr-1 h-3.5 w-3.5" /> Remove
                  </Button>
                )}
              </div>
            </div>

            <dl className="mt-6 space-y-3 border-t border-border pt-6 text-sm">
              <Row label="Phone" value={session.contactno} />
              <Row label="Gender" value={session.gender} />
              <Row label="Date of birth" value={session.dob} />
            </dl>
          </section>

          <section>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">Address book</h2>
              <AddressFormDialog
                trigger={
                  <Button size="sm" className="cursor-pointer">
                    Add address
                  </Button>
                }
              />
            </div>

            {list.isLoading ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </div>
            ) : addresses.length === 0 ? (
              <p className="mt-4 text-muted-foreground">No saved addresses yet.</p>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {addresses.map((a) => (
                  <div key={a.id} className="border border-border bg-card p-4">
                    <div className="flex items-start justify-between">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">
                        {a.addressType}
                      </p>
                      <div className="flex gap-1">
                        <AddressFormDialog
                          address={a}
                          trigger={
                            <button
                              className="cursor-pointer p-1 text-muted-foreground hover:text-foreground"
                              aria-label="Edit address"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                          }
                        />
                        <button
                          className="cursor-pointer p-1 text-muted-foreground hover:text-destructive"
                          aria-label="Delete address"
                          onClick={() => remove.mutate(a.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed">
                      {a.doorNumber}, {a.street}
                      <br />
                      {a.city}, {a.state} {a.zipCode}
                      <br />
                      {a.country}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </Container>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right">{value || "—"}</dd>
    </div>
  );
}
