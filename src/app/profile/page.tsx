"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, ShoppingBag, BookOpen } from "lucide-react";
import HomeNavbar from "@/components/home/HomeNavbar";
import Footer from "@/components/Footer";

export default function ProfilePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

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

  const firstName = user?.firstName || user?.fullName?.split(" ")[0] || "Gourmet";
  const fullName = user?.fullName || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Valued Customer";
  const userEmail = user?.primaryEmailAddress?.emailAddress || "";
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

          {/* Main Grid: Left Column Profile Card & Right Column Recent Orders */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Column: Profile Card */}
            <div className="md:col-span-4 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col items-center text-center">
              {/* Profile Avatar Box */}
              <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-2xl bg-brand-green text-brand-gold flex items-center justify-center text-6xl font-serif font-bold shadow-md overflow-hidden mb-6 border-2 border-brand-gold/30">
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{userInitial}</span>
                )}
              </div>

              {/* Welcome text & User info */}
              <span className="text-xs uppercase tracking-widest text-stone-500 font-sans">
                Welcome,
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green mt-1 mb-1 tracking-tight">
                {fullName}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 font-sans mb-8 break-all">
                {userEmail}
              </p>

              {/* Sign Out Button */}
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 border border-brand-green text-brand-green font-bold text-xs uppercase tracking-widest py-3 px-6 rounded-md hover:bg-brand-green hover:text-white transition-all cursor-pointer shadow-xs"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>

            {/* Right Column: Recent Orders */}
            <div className="md:col-span-8 space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-sm">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-200">
                  <h3 className="font-serif text-2xl font-bold text-brand-green flex items-center gap-3">
                    <ShoppingBag className="h-6 w-6 text-brand-gold" />
                    My Recent Orders
                  </h3>
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Order History
                  </span>
                </div>

                {/* Empty State Card matching requested UI */}
                <div className="bg-[#fcfaf7] border border-stone-200/60 rounded-xl p-8 sm:p-12 text-center flex flex-col items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-brand-gold/15 flex items-center justify-center text-brand-green mb-4">
                    <BookOpen className="h-8 w-8 stroke-[1.5]" />
                  </div>

                  <h4 className="font-serif text-2xl font-bold text-stone-800 mb-2">
                    Your Gourmet Journey Awaits
                  </h4>

                  <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed mb-8">
                    You haven&apos;t placed any pie orders yet. Discover our handcrafted Indo-Australian pies and artisanal bakery selections today.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <Link
                      href="/shop"
                      className="w-full sm:w-auto bg-brand-green text-white font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-md hover:bg-brand-gold hover:text-brand-green transition-all shadow-sm text-center"
                    >
                      Explore Menu
                    </Link>
                    <Link
                      href="/blog"
                      className="w-full sm:w-auto border border-stone-300 text-stone-700 font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-md hover:bg-stone-100 transition-all text-center"
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
