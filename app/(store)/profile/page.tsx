"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  MapPin,
  ShoppingBag,
  Camera,
  CheckCircle2,
  Lock,
  ArrowRight,
  Pencil,
  Trash2,
  Leaf,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddressFormDialog } from "@/components/address-form-dialog";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { useAuth } from "@/providers/auth-provider";
import { useAddresses } from "@/hooks/use-addresses";
import {
  getUserProfile,
  updateUserProfile,
  updateProfileImage,
  changeUserPassword,
  getOrders,
} from "@/lib/endpoints";
import { formatINR } from "@/lib/format";
import type { UpdateProfileRequest } from "@/lib/types";

export default function ProfilePage() {
  const { session, ready } = useAuth();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // Active Tab state
  const [activeTab, setActiveTab] = useState("details");

  // Profile Query
  const profileQuery = useQuery({
    queryKey: ["userProfile", session?.gmail],
    queryFn: () => (session?.gmail ? getUserProfile(session.gmail) : null),
    enabled: !!session?.gmail,
  });

  // Orders Query for stats and preview
  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    enabled: !!session,
  });

  const { list: addressList, remove: removeAddress } = useAddresses();

  // Personal Info Form State
  const [name, setName] = useState("");
  const [contactno, setContactno] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  // Sync form with profile data
  if (profileQuery.data && !isFormInitialized) {
    setName(profileQuery.data.name || "");
    setContactno(profileQuery.data.contactno || "");
    setGender(profileQuery.data.gender || "NA");
    setDob(profileQuery.data.dob || "");
    setIsFormInitialized(true);
  }

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Update Profile Mutation
  const updateProfileMut = useMutation({
    mutationFn: async (payload: UpdateProfileRequest) => {
      if (!session?.gmail) throw new Error("Not authenticated");
      return await updateUserProfile(session.gmail, payload);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["userProfile", session?.gmail], updated);
      toast.success("Profile details updated successfully!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update profile.");
    },
  });

  // Change Password Mutation
  const changePasswordMut = useMutation({
    mutationFn: async () => {
      if (!session?.gmail) throw new Error("Not authenticated");
      if (!currentPassword) throw new Error("Please enter your current password");
      if (newPassword.length < 6) throw new Error("New password must be at least 6 characters");
      if (newPassword !== confirmPassword) throw new Error("Passwords do not match");

      return await changeUserPassword(session.gmail, {
        currentPassword,
        newPassword,
      });
    },
    onSuccess: (msg) => {
      toast.success(msg || "Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update password.");
    },
  });

  // Photo Upload Handler
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !session?.gmail) return;
    setUploading(true);
    try {
      const newImageUrl = await updateProfileImage(session.gmail, file);
      queryClient.invalidateQueries({ queryKey: ["userProfile", session.gmail] });
      toast.success("Profile photo updated successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to upload photo.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMut.mutate({
      name: name.trim(),
      contactno: contactno.trim(),
      gender,
      dob,
    });
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    changePasswordMut.mutate();
  };

  if (!ready || profileQuery.isLoading) {
    return (
      <div className="pt-24 min-h-[70vh]">
        <Container className="py-10">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </Container>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="pt-24 min-h-[70vh]">
        <Container className="py-16 text-center">
          <User className="mx-auto h-12 w-12 text-[#50644C]/40" />
          <h2 className="mt-4 font-display text-2xl">Please sign in to view your profile</h2>
          <p className="mt-2 text-sm text-muted-foreground">Access your orders, saved addresses, and profile details.</p>
          <Button asChild className="mt-6 bg-[#50644C] hover:bg-[#384935] text-white">
            <Link href="/login">Sign In</Link>
          </Button>
        </Container>
      </div>
    );
  }

  const user = profileQuery.data || {
    gmail: session.gmail,
    name: session.name,
    contactno: session.contactno,
    gender: session.gender,
    dob: session.dob,
    role: session.role,
    imageUrl: session.imageUrl,
    enabled: true,
  };

  const orders = ordersQuery.data || [];
  const addresses = addressList.data || [];
  const initials = (user.name || user.gmail).slice(0, 2).toUpperCase();

  // Sustainability impact metrics calculation
  const totalItemsOrdered = orders.reduce(
    (acc, o) => acc + (o.items?.reduce((n, i) => n + i.quantity, 0) || 0),
    0
  );

  return (
    <div className="pt-24 min-h-[85vh] bg-[#FAF9F5]/40">
      <Container className="py-10">
        {/* Page Title & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#50644C]/15 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#50644C]">
              <span>Customer Portal</span>
              <span>/</span>
              <span>My Profile</span>
            </div>
            <h1 className="mt-1 font-display text-3xl sm:text-4xl text-[#17231C]">
              Customer Profile &amp; Account
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-[#50644C]/25 text-[#243021] hover:bg-white"
            >
              <Link href="/orders" className="flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-[#50644C]" />
                <span>My Orders ({orders.length})</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-[#50644C]/25 text-[#243021] hover:bg-white"
            >
              <Link href="/cart" className="flex items-center gap-1.5">
                <span>View Cart</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Main Profile Layout */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[22rem_1fr] items-start">
          {/* Left Column: User Card & Eco Stats */}
          <aside className="space-y-6">
            <div className="border border-[#50644C]/20 bg-white/80 backdrop-blur-md p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              {/* Avatar & Photo Upload */}
              <div className="flex flex-col items-center text-center">
                <div className="relative group">
                  <Avatar className="h-28 w-28 rounded-none border border-[#50644C]/25 shadow-xs">
                    {user.imageUrl ? (
                      <AvatarImage src={user.imageUrl} alt={user.name || user.gmail} className="rounded-none object-cover" />
                    ) : null}
                    <AvatarFallback className="bg-[#EAE4D9] text-[#243021] font-display text-3xl font-semibold rounded-none">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="absolute bottom-0 right-0 p-2 bg-[#50644C] text-white shadow-xs hover:bg-[#384935] transition-transform hover:scale-105 cursor-pointer rounded-none border border-white/50"
                    title="Change profile picture"
                    aria-label="Upload new photo"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                  />
                </div>

                <h2 className="mt-4 font-display text-xl font-bold text-[#17231C]">
                  {user.name || "Eco Partner"}
                </h2>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Mail className="w-3 h-3 text-[#50644C]" />
                  {user.gmail}
                </p>

                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  <Badge className="bg-[#50644C]/10 text-[#50644C] border-[#50644C]/20 text-[11px] font-medium">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-[#50644C]" />
                    {user.role === "ADMIN" ? "Administrator" : "Verified Customer"}
                  </Badge>
                  {user.enabled && (
                    <Badge variant="outline" className="border-emerald-600/30 text-emerald-700 bg-emerald-50/50 text-[11px]">
                      Active Status
                    </Badge>
                  )}
                </div>

                {uploading && (
                  <p className="mt-2 text-xs text-[#50644C] animate-pulse font-medium">
                    Uploading photo…
                  </p>
                )}
              </div>

              {/* Quick Info Rows */}
              <div className="mt-6 border-t border-[#50644C]/15 pt-5 space-y-3 text-xs">
                <div className="flex items-center justify-between text-[#1A241C]">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#50644C]" /> Phone
                  </span>
                  <span className="font-medium">{user.contactno || "Not set"}</span>
                </div>
                <div className="flex items-center justify-between text-[#1A241C]">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#50644C]" /> Gender
                  </span>
                  <span className="font-medium capitalize">{user.gender || "Not specified"}</span>
                </div>
                <div className="flex items-center justify-between text-[#1A241C]">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#50644C]" /> Date of Birth
                  </span>
                  <span className="font-medium">{user.dob || "Not set"}</span>
                </div>
              </div>
            </div>

            {/* Eco Impact Stats Box */}
            <div className="border border-[#50644C]/20 bg-gradient-to-br from-[#243021] to-[#1A2418] text-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-[#CCAC88]">
                <Leaf className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Your Eco Contribution</span>
              </div>
              <p className="mt-2 text-xs text-emerald-100/80 leading-relaxed">
                By purchasing certified crop-residue dinnerware and sustainable packaging with ViroEco:
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                <div className="bg-white/10 p-3 border border-white/10">
                  <p className="font-display text-xl font-bold text-[#CCAC88]">
                    {totalItemsOrdered}
                  </p>
                  <p className="text-[10px] text-emerald-200/80 uppercase tracking-wider mt-0.5">
                    Plastic Items Replaced
                  </p>
                </div>
                <div className="bg-white/10 p-3 border border-white/10">
                  <p className="font-display text-xl font-bold text-[#CCAC88]">
                    {(totalItemsOrdered * 0.12).toFixed(1)} <span className="text-xs font-normal">kg</span>
                  </p>
                  <p className="text-[10px] text-emerald-200/80 uppercase tracking-wider mt-0.5">
                    Agricultural Waste Upcycled
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Tabbed Content (Personal Details, Addresses, Orders, Security) */}
          <main className="border border-[#50644C]/20 bg-white/90 backdrop-blur-md p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 sm:grid-cols-4 bg-[#F2EDE4] p-1 border border-[#50644C]/15 mb-6 h-auto w-full gap-1">
                <TabsTrigger
                  value="details"
                  className="cursor-pointer py-2 px-3 text-xs font-semibold text-[#1A241C]/75 border border-transparent data-[state=active]:bg-white data-[state=active]:text-[#243021] data-[state=active]:border-[#50644C]/15 data-[state=active]:shadow-xs transition-all"
                >
                  Personal Info
                </TabsTrigger>
                <TabsTrigger
                  value="addresses"
                  className="cursor-pointer py-2 px-3 text-xs font-semibold text-[#1A241C]/75 border border-transparent data-[state=active]:bg-white data-[state=active]:text-[#243021] data-[state=active]:border-[#50644C]/15 data-[state=active]:shadow-xs transition-all"
                >
                  Address Book ({addresses.length})
                </TabsTrigger>
                <TabsTrigger
                  value="orders"
                  className="cursor-pointer py-2 px-3 text-xs font-semibold text-[#1A241C]/75 border border-transparent data-[state=active]:bg-white data-[state=active]:text-[#243021] data-[state=active]:border-[#50644C]/15 data-[state=active]:shadow-xs transition-all"
                >
                  Recent Orders ({orders.length})
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="cursor-pointer py-2 px-3 text-xs font-semibold text-[#1A241C]/75 border border-transparent data-[state=active]:bg-white data-[state=active]:text-[#243021] data-[state=active]:border-[#50644C]/15 data-[state=active]:shadow-xs transition-all"
                >
                  Security
                </TabsTrigger>
              </TabsList>

              {/* Tab 1: Personal Info Form */}
              <TabsContent value="details" className="space-y-6 focus-visible:outline-none">
                <div>
                  <h3 className="font-display text-xl text-[#17231C]">Personal Information</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Manage your personal details and contact information.
                  </p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-semibold text-[#17231C]">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      required
                      className="border-[#50644C]/20 bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="gmail" className="text-xs font-semibold text-[#17231C]">
                      Email Address (Account ID)
                    </Label>
                    <Input
                      id="gmail"
                      value={user.gmail}
                      disabled
                      className="border-[#50644C]/15 bg-[#FAF9F5] text-muted-foreground cursor-not-allowed"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Email address is linked to your login identity and cannot be changed.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="contactno" className="text-xs font-semibold text-[#17231C]">
                        Phone / Contact Number
                      </Label>
                      <Input
                        id="contactno"
                        value={contactno}
                        onChange={(e) => setContactno(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="border-[#50644C]/20 bg-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="dob" className="text-xs font-semibold text-[#17231C]">
                        Date of Birth
                      </Label>
                      <Input
                        id="dob"
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="border-[#50644C]/20 bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="gender" className="text-xs font-semibold text-[#17231C]">
                      Gender
                    </Label>
                    <select
                      id="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full h-9 px-3 text-sm bg-white border border-[#50644C]/20 text-[#17231C] rounded-none focus:outline-none focus:ring-1 focus:ring-[#50644C]"
                    >
                      <option value="NA">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={updateProfileMut.isPending}
                      className="bg-[#50644C] hover:bg-[#384935] text-white px-6 cursor-pointer font-medium text-xs shadow-xs"
                    >
                      {updateProfileMut.isPending ? "Saving Changes…" : "Save Profile Details"}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              {/* Tab 2: Saved Addresses */}
              <TabsContent value="addresses" className="space-y-6 focus-visible:outline-none">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-xl text-[#17231C]">Saved Addresses</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Manage delivery destinations for fast enterprise and retail checkout.
                    </p>
                  </div>
                  <AddressFormDialog
                    trigger={
                      <Button size="sm" className="bg-[#50644C] hover:bg-[#384935] text-white cursor-pointer text-xs">
                        + Add New Address
                      </Button>
                    }
                  />
                </div>

                {addressList.isLoading ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="border border-dashed border-[#50644C]/25 p-8 text-center bg-[#FAF9F5]/60">
                    <MapPin className="mx-auto h-8 w-8 text-[#50644C]/50" />
                    <p className="mt-2 text-sm font-semibold text-[#17231C]">No addresses saved yet</p>
                    <p className="text-xs text-muted-foreground mt-1">Add your shipping or billing address for easy ordering.</p>
                    <div className="mt-4">
                      <AddressFormDialog
                        trigger={
                          <Button size="sm" variant="outline" className="border-[#50644C]/30 text-[#50644C] cursor-pointer">
                            Add Address
                          </Button>
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {addresses.map((a) => (
                      <div
                        key={a.id}
                        className="border border-[#50644C]/20 bg-white p-4 shadow-xs flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#50644C]/10 text-[#50644C]">
                              {a.addressType}
                            </span>
                            <div className="flex gap-1">
                              <AddressFormDialog
                                address={a}
                                trigger={
                                  <button
                                    className="cursor-pointer p-1.5 text-muted-foreground hover:text-[#50644C]"
                                    aria-label="Edit address"
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                  </button>
                                }
                              />
                              <button
                                className="cursor-pointer p-1.5 text-muted-foreground hover:text-red-600"
                                aria-label="Delete address"
                                onClick={() => removeAddress.mutate(a.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                          <p className="mt-3 text-xs leading-relaxed text-[#17231C]">
                            <span className="font-semibold">{a.doorNumber}</span>, {a.street}
                            <br />
                            {a.city}, {a.state} {a.zipCode}
                            <br />
                            <span className="text-muted-foreground">{a.country}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Tab 3: Recent Orders */}
              <TabsContent value="orders" className="space-y-6 focus-visible:outline-none">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-xl text-[#17231C]">Recent Orders</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Track and review your recent circular purchases and procurement dispatches.
                    </p>
                  </div>
                  {orders.length > 0 && (
                    <Button asChild size="sm" variant="outline" className="border-[#50644C]/30 text-[#50644C]">
                      <Link href="/orders">View Full History</Link>
                    </Button>
                  )}
                </div>

                {ordersQuery.isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-20" />
                    <Skeleton className="h-20" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="border border-dashed border-[#50644C]/25 p-8 text-center bg-[#FAF9F5]/60">
                    <ShoppingBag className="mx-auto h-8 w-8 text-[#50644C]/50" />
                    <p className="mt-2 text-sm font-semibold text-[#17231C]">No orders placed yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Browse our eco-friendly tableware and sustainable packaging catalog.
                    </p>
                    <Button asChild size="sm" className="mt-4 bg-[#50644C] hover:bg-[#384935] text-white">
                      <Link href="/products">Explore Catalog</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-[#50644C]/15 border border-[#50644C]/20 bg-white">
                    {orders.slice(0, 5).map((o) => (
                      <Link
                        key={o.id}
                        href={`/orders/${o.id}`}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-[#FAF9F5] transition-colors"
                      >
                        <div>
                          <p className="font-display font-bold text-sm text-[#17231C]">
                            Order #{o.id}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(o.createdAt).toLocaleDateString()} ·{" "}
                            {o.items?.reduce((n, i) => n + i.quantity, 0) || 0} items
                          </p>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-3">
                          <OrderStatusBadge status={o.status} />
                          <span className="font-medium text-sm tabular-nums text-[#17231C]">
                            {formatINR(o.totalAmount)}
                          </span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground hidden sm:inline-block" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Tab 4: Security & Password */}
              <TabsContent value="security" className="space-y-6 focus-visible:outline-none">
                <div>
                  <h3 className="font-display text-xl text-[#17231C]">Account Security</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Update your password and maintain credential security.
                  </p>
                </div>

                <form onSubmit={handleSavePassword} className="space-y-4 max-w-md">
                  <div className="space-y-1.5">
                    <Label htmlFor="current-pass" className="text-xs font-semibold text-[#17231C]">
                      Current Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="current-pass"
                        type="password"
                        placeholder="••••••••"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        className="border-[#50644C]/20 bg-white pr-9"
                      />
                      <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="new-pass" className="text-xs font-semibold text-[#17231C]">
                      New Password (minimum 6 characters)
                    </Label>
                    <div className="relative">
                      <Input
                        id="new-pass"
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                        className="border-[#50644C]/20 bg-white pr-9"
                      />
                      <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="confirm-pass" className="text-xs font-semibold text-[#17231C]">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirm-pass"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                        className="border-[#50644C]/20 bg-white pr-9"
                      />
                      <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={changePasswordMut.isPending}
                      className="bg-[#50644C] hover:bg-[#384935] text-white px-6 cursor-pointer font-medium text-xs shadow-xs"
                    >
                      {changePasswordMut.isPending ? "Updating Password…" : "Update Password"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </Container>
    </div>
  );
}
