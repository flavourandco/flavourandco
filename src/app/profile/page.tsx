"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, ShoppingBag, BookOpen } from "lucide-react";
import HomeNavbar from "@/components/home/HomeNavbar";
import Footer from "@/components/layout/Footer";
import { useAuthStore } from "@/store/auth.store";
import { BoneyardProfilePageSkeleton } from "@/components/ui/BoneyardSkeleton";

export default function ProfilePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const userProfile = useAuthStore((s) => s.userProfile);
  const authLoading = useAuthStore((s) => s.isLoading);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  const isHydrating = !isLoaded || (isSignedIn && authLoading) || (!isInitialized && isSignedIn);

  // Render Boneyard Skeleton during Clerk initialization & Supabase data fetching
  if (isHydrating) {
    return (
      <>
        <HomeNavbar />
        <main className="min-h-screen bg-[#f9f7f2] pt-[100px] sm:pt-[116px] md:pt-[124px] pb-20 px-4 sm:px-6 lg:px-12">
          <BoneyardProfilePageSkeleton />
        </main>
        <Footer />
      </>
    );
  }

  // Once loaded, if user is not signed in render Access Restricted
  if (isLoaded && !isSignedIn) {
    return (
      <>
        <HomeNavbar />
        <main className="min-h-screen bg-[#f9f7f2] pt-[120px] pb-20 px-4 flex flex-col items-center justify-center text-center">
          <div className="max-w-md bg-white p-8 rounded-xl shadow-lg border border-stone-200">
            <h1 className="font-serif text-2xl font-bold text-brand-green mb-3">
              Access Restricted
            </h1>
            <p className="text-stone-600 text-sm mb-6">
              Please log in to view your profile and order history.
            </p>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="bg-brand-green text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-md hover:bg-brand-gold hover:text-brand-green transition-all cursor-pointer"
            >
              Return to Home
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const fullName =
    userProfile?.fullName ||
    user?.fullName ||
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    "Valued Customer";

  const firstName = fullName.split(" ")[0] || "Gourmet";
  const userEmail = userProfile?.email || user?.primaryEmailAddress?.emailAddress || "";
  const avatarUrl = userProfile?.imageUrl || user?.imageUrl || "";
  const userInitial = (firstName[0] || "U").toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <>
      <HomeNavbar />
      <main className="min-h-screen bg-[#f9f7f2] pt-[100px] sm:pt-[116px] md:pt-[124px] pb-20 px-4 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-6xl">
          {/* Header Banner */}
          <div className="mb-8 pb-4 border-b border-stone-300/60 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-gold">
                My Account
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-green mt-1">
                Profile &amp; Dashboard
              </h1>
            </div>
          </div>

          {/* Main Grid: Left Column Profile & Right Column Recent Orders */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            {/* Left Column: Minimal Profile */}
            <div className="md:col-span-4 flex flex-col items-center text-center p-4">
              {/* Minimal Avatar */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-5 shadow-sm bg-brand-green text-brand-gold flex items-center justify-center text-4xl font-serif font-bold">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{userInitial}</span>
                )}
              </div>

              {/* Welcome text & User info */}
              <span className="text-[11px] font-bold uppercase tracking-widest text-stone-400 font-sans">
                Welcome
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green mt-1 mb-1 tracking-tight">
                {fullName}
              </h2>
              <p className="text-xs text-stone-500 font-sans mb-6 break-all">
                {userEmail}
              </p>

              {/* Minimal Sign Out Button */}
              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center justify-center gap-2 text-stone-600 hover:text-rose-600 font-bold text-xs uppercase tracking-widest py-2 px-4 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>

            {/* Right Column: Recent Orders */}
            <div className="md:col-span-8 space-y-6">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-200/80">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-green flex items-center gap-2.5">
                    <ShoppingBag className="h-5 w-5 text-brand-gold" />
                    My Recent Orders
                  </h3>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                    Order History
                  </span>
                </div>

                {/* Minimal Empty State Card */}
                <div className="py-12 text-center flex flex-col items-center justify-center">
                  <div className="h-14 w-14 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
                    <BookOpen className="h-7 w-7 stroke-[1.5]" />
                  </div>

                  <h4 className="font-serif text-xl font-bold text-stone-800 mb-2">
                    Your Gourmet Journey Awaits
                  </h4>

                  <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed mb-6">
                    You haven&apos;t placed any pie orders yet. Discover our handcrafted Indo-Australian pies and artisanal bakery selections today.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <Link
                      href="/shop"
                      className="w-full sm:w-auto bg-brand-green text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full hover:bg-brand-gold hover:text-brand-green transition-all text-center cursor-pointer shadow-xs"
                    >
                      Explore Menu
                    </Link>
                    <Link
                      href="/blog"
                      className="w-full sm:w-auto text-stone-600 font-bold text-xs uppercase tracking-widest px-6 py-3 transition-colors text-center hover:text-brand-green cursor-pointer"
                    >
                      Read Blogs
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

