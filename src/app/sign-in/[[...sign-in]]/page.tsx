import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { media } from "@/lib/media";

export default function SignInPage() {
  return (
    <div className="min-h-screen w-full flex bg-stone-50 text-stone-800">
      {/* Left Column: Solid Brand Panel (Visible on Large Screens) */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-green flex-col justify-center items-center p-12 text-white text-center">
        <div className="max-w-md space-y-6 flex flex-col items-center">
          <h1 className="font-serif text-3xl xl:text-4xl font-medium tracking-tight text-white/90">
            Welcome back to
          </h1>

          <Link href="/" aria-label="Home">
            <img
              src={media.footerLogo}
              alt="Flavour & Co."
              className="h-28 xl:h-36 w-auto object-contain transition-transform hover:scale-105"
            />
          </Link>

          <p className="text-cream/80 text-sm xl:text-base font-light leading-relaxed max-w-sm">
            Sign in to manage your order history, track fresh express deliveries, and explore Simran&apos;s award-winning pie collections.
          </p>
        </div>
      </div>

      {/* Right Column: Clerk Sign In Form */}
      <div className="w-full lg:w-1/2 flex flex-col min-h-screen justify-center items-center p-6 sm:p-12 relative bg-cream/40">
        {/* Mobile Header Branding */}
        <div className="lg:hidden w-full max-w-md mb-8 text-center space-y-4">
          <div className="flex justify-center">
            <Link href="/">
              <img
                src={media.navbarLogo}
                alt="Flavour & Co."
                className="h-14 w-auto object-contain"
              />
            </Link>
          </div>
        </div>

        <div className="w-full max-w-md flex justify-center">
          <SignIn
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            appearance={{
              elements: {
                rootBox: "w-full flex justify-center",
                card: "w-full max-w-md shadow-xl border border-brand-green/10 bg-white rounded-2xl p-6 sm:p-8",
                headerTitle: "font-serif text-2xl font-bold text-brand-green text-center",
                headerSubtitle: "text-stone-600 text-sm text-center",
                socialButtonsBlockButton: "border border-stone-200 hover:bg-stone-50 text-stone-700 font-medium py-2.5 rounded-lg transition-all",
                formButtonPrimary: "bg-brand-green hover:bg-brand-green/90 text-white font-semibold py-2.5 rounded-lg transition-all uppercase tracking-wider text-xs shadow-md",
                formFieldInput: "border border-stone-300 focus:border-brand-green focus:ring-1 focus:ring-brand-green rounded-lg py-2 px-3 text-sm",
                footerActionLink: "text-brand-green hover:underline font-semibold",
                footerActionText: "text-stone-600 text-xs",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
