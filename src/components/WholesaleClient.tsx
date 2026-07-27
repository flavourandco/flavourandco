"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { wholesaleBrands, wholesaleTestimonials } from "@/lib/data";

// Country list for phone input with Australia (+61) as default
const countryCodes = [
  { code: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "+64", flag: "🇳🇿", name: "New Zealand" },
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+1", flag: "🇺🇸", name: "United States" },
  { code: "+1", flag: "🇨🇦", name: "Canada" },
  { code: "+65", flag: "🇸🇬", name: "Singapore" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+679", flag: "🇫🇯", name: "Fiji" },
  { code: "+60", flag: "🇲🇾", name: "Malaysia" },
  { code: "+62", flag: "🇮🇩", name: "Indonesia" },
  { code: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "+33", flag: "🇫🇷", name: "France" },
  { code: "+39", flag: "🇮🇹", name: "Italy" },
  { code: "+81", flag: "🇯🇵", name: "Japan" },
  { code: "+82", flag: "🇰🇷", name: "South Korea" },
];

// Clean transparent vector logo marks for brands worked with
function NikeSwooshLogo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Nike">
      <path d="M21.71 6.8c-2.3 2.1-7.1 5.9-10.4 8.2-1.9 1.3-3.8 2.2-5.4 2.2-1.6 0-2.8-.7-3.4-2.1-.6-1.4-.3-3.2.7-4.8 1.1-1.7 3-3.1 5.1-3.9 1.1-.4 1.7.3 1.2 1.3-.9 1.7-1.8 3.5-2.2 5.1-.3 1 .1 1.6.8 1.6 1.4 0 3.8-1.5 6.3-3.4 3.7-2.8 7.3-6.2 9.5-8.2.5-.4 1.1-.1.9.5z" />
    </svg>
  );
}

function AdidasLogo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 24" fill="currentColor" className={className} aria-label="Adidas">
      <path d="M2 20h5.5L15.5 8h-5.5L2 20zm8.5 0h5.5L24 5h-5.5l-8 15zm8.5 0h5.5L31 2h-5.5l-6.5 18z" />
    </svg>
  );
}

function Channel7Logo({ className = "h-7 w-auto" }: { className?: string }) {
  return (
    <div className="flex items-center gap-1.5 font-bold tracking-tighter text-lg font-serif">
      <span className="bg-[#6b1e30] text-cream px-2 py-0.5 rounded text-xs">7</span>
      <span className="uppercase text-xs tracking-widest font-sans">CHANNEL SEVEN</span>
    </div>
  );
}

function SydneyGourmetLogo({ className = "h-7 w-auto" }: { className?: string }) {
  return (
    <div className="flex items-center gap-2 font-serif font-bold text-sm tracking-wider uppercase">
      <svg className="w-5 h-5 text-[#c69c40]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" />
      </svg>
      <span>SYDNEY GOURMET</span>
    </div>
  );
}

function PlateOfOriginLogo({ className = "h-7 w-auto" }: { className?: string }) {
  return (
    <div className="flex items-center gap-2 font-sans font-extrabold text-xs tracking-widest uppercase">
      <span className="border-2 border-[#1c1410]/60 px-2 py-0.5 rounded">PLATE OF ORIGIN</span>
    </div>
  );
}

export default function WholesaleClient() {
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    email: "",
    countryCode: "+61",
    phone: "",
    venueType: "Café / Coffee Shop",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  const scrollToForm = () => {
    const el = document.getElementById("wholesale-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full bg-[#fdf8f3] text-[#1c1410]">
      
      {/* 1. Hero Overview Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
          
          {/* Left Column Text */}
          <div className="lg:col-span-6 text-left space-y-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#6b1e30]">
              Foodservice Partnerships
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1c1410] leading-[1.15]">
              Elevating Menus Across Sydney
            </h2>
            <p className="text-sm sm:text-base text-[#1c1410]/80 leading-relaxed font-sans max-w-xl">
              Flavour &amp; Co partners with cafés, caterers, hotels and foodservice venues to deliver premium Indo-fusion pies that stand out on any menu. Handcrafted with local Australian ingredients.
            </p>
            <div className="pt-2">
              <button
                onClick={scrollToForm}
                className="w-full sm:w-auto bg-[#c69c40] hover:bg-[#6b1e30] text-[#1c1410] hover:text-white font-bold text-xs uppercase tracking-[0.2em] px-8 py-3.5 rounded shadow-sm transition-all duration-300 cursor-pointer"
              >
                REQUEST A SAMPLE
              </button>
            </div>
          </div>

          {/* Right Column Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl shadow-md">
              <Image
                src="/products/PHOTOS_Flavour&Co-3.jpg"
                alt="Flavour & Co. Wholesale Gourmet Pies"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={95}
                priority
              />
            </div>
          </div>

        </div>
      </section>

      {/* 2. Brands We Have Worked With Ticker Section & Manual Testimonial Carousel */}
      <section className="w-full bg-[#f7efe6] py-10 overflow-hidden">
        <div className="text-center mb-6">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#6b1e30]">
            BRANDS WE HAVE WORKED WITH
          </span>
        </div>

        {/* Continuous Moving Brand Logo Marquee Ticker (Mapped dynamically from src/lib/data.ts) */}
        <div className="flex whitespace-nowrap animate-marquee gap-16 text-[#1c1410]/70 items-center justify-around opacity-80 mb-10">
          {[1, 2, 3, 4].map((groupKey) => (
            <React.Fragment key={groupKey}>
              {wholesaleBrands.map((brand) => (
                <div key={`${groupKey}-${brand.id}`} className="shrink-0 flex items-center hover:opacity-100 transition-opacity">
                  {brand.type === "nike" ? (
                    <NikeSwooshLogo className="h-9 w-auto text-[#1c1410]" />
                  ) : brand.type === "adidas" ? (
                    <AdidasLogo className="h-8 w-auto text-[#1c1410]" />
                  ) : brand.type === "channel7" ? (
                    <Channel7Logo />
                  ) : brand.type === "sydneygourmet" ? (
                    <SydneyGourmetLogo />
                  ) : brand.type === "plateoforigin" ? (
                    <PlateOfOriginLogo />
                  ) : (
                    /* Custom Brand Logo Image File from src/lib/data.ts */
                    <img src={brand.logo} alt={brand.name} className="h-8 w-auto object-contain max-w-[130px]" />
                  )}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>

        {/* Testimonials Container */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-t border-[#ebe3d8]/60 pt-6 mt-6">
          
          {/* PC Desktop View: Fixed 4-Column Grid (No Carousel, No Borders, No Card Backgrounds, Tight Spacing) */}
          <div className="hidden md:grid md:grid-cols-4 gap-6 text-left">
            {wholesaleTestimonials.map((t) => (
              <div key={t.id} className="space-y-2 bg-transparent border-0 p-0">
                <p className="font-serif italic font-bold text-[#1c1410] text-sm leading-snug">
                  {t.quote}
                </p>

                <div className="flex items-center gap-2.5 pt-1">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-[#c69c40]">
                    <Image
                      src={t.avatar}
                      alt={t.author}
                      fill
                      className="object-cover"
                      sizes="32px"
                      quality={95}
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#6b1e30] leading-tight">{t.author}</h4>
                    <p className="text-[10px] text-[#1c1410]/70 font-sans leading-tight">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile View: Touch-Swipe Carousel (Content-based Width & Line Wrapping) */}
          <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory gap-6 py-1 scrollbar-none text-left">
            {wholesaleTestimonials.map((t) => (
              <div
                key={t.id}
                className="snap-start shrink-0 w-auto min-w-[150px] max-w-[75vw] bg-transparent border-0 p-0 flex flex-col justify-between space-y-2 whitespace-normal break-words"
              >
                <p className="font-serif italic font-bold text-[#1c1410] text-sm leading-snug">
                  {t.quote}
                </p>

                <div className="flex items-center gap-2.5 pt-1">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-[#c69c40]">
                    <Image
                      src={t.avatar}
                      alt={t.author}
                      fill
                      className="object-cover"
                      sizes="32px"
                      quality={95}
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#6b1e30] leading-tight">{t.author}</h4>
                    <p className="text-[10px] text-[#1c1410]/70 font-sans leading-tight">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. Why Work With Us Section (Compact Simran Kitchen Image) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
          
          {/* Left Column: Compact Simran Kitchen Image */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start order-last lg:order-first">
            <div className="relative aspect-[3/4] w-full max-w-[260px] sm:max-w-[300px] overflow-hidden rounded-xl shadow-lg border-4 border-white">
              <Image
                src="/founder/simran-kitchen.jpg"
                alt="Simran in her kitchen — Founder of Flavour & Co."
                fill
                className="object-cover"
                sizes="(max-width: 768px) 260px, 300px"
                quality={95}
              />
            </div>
          </div>

          {/* Right Column Content */}
          <div className="lg:col-span-7 text-left space-y-8">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#c69c40]">
                Our Commitment
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1c1410]">
                WHY WORK WITH US?
              </h2>
            </div>

            <div className="space-y-6">
              {/* Point 1 */}
              <div className="space-y-1 border-l-2 border-[#c69c40] pl-4">
                <h3 className="font-serif text-xl font-bold text-[#1c1410]">
                  Consistent Quality
                </h3>
                <p className="text-xs sm:text-sm text-[#1c1410]/80 leading-relaxed font-sans">
                  Built for reliability in foodservice, with consistent results across preparation, presentation and taste.
                </p>
              </div>

              {/* Point 2 */}
              <div className="space-y-1 border-l-2 border-[#c69c40] pl-4">
                <h3 className="font-serif text-xl font-bold text-[#1c1410]">
                  Distinctive Range
                </h3>
                <p className="text-xs sm:text-sm text-[#1c1410]/80 leading-relaxed font-sans">
                  A curated range of Indo-fusion pies that elevate traditional flavours into something modern, memorable and menu-worthy.
                </p>
              </div>

              {/* Point 3 */}
              <div className="space-y-1 border-l-2 border-[#c69c40] pl-4">
                <h3 className="font-serif text-xl font-bold text-[#1c1410]">
                  Built for Service
                </h3>
                <p className="text-xs sm:text-sm text-[#1c1410]/80 leading-relaxed font-sans">
                  Designed for ease of preparation and consistency across service, with flexible storage that works for busy kitchens and events.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Hospitality Use Cases */}
      <section className="bg-[#f7efe6] border-t border-b border-[#ebe3d8] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#6b1e30] block mb-2">
            Versatile Applications
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1c1410] mb-12">
            Hospitality Use Cases
          </h2>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="text-left space-y-3 group">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl shadow-sm">
                <Image
                  src="/products/PHOTOS_Flavour&Co-2.jpg"
                  alt="Perfect for cabinet display"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={95}
                />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1c1410]">
                Perfect for cabinet display
              </h3>
              <p className="text-xs text-[#1c1410]/75 leading-relaxed">
                Eye-catching golden pastry presentation that drives impulse café sales.
              </p>
            </div>

            {/* Card 2 */}
            <div className="text-left space-y-3 group">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl shadow-sm">
                <Image
                  src="/products/PHOTOS_Flavour&Co-3.jpg"
                  alt="Ideal for catering menus"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={95}
                />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1c1410]">
                Ideal for catering menus
              </h3>
              <p className="text-xs text-[#1c1410]/75 leading-relaxed">
                Pre-portioned mini pies crafted for effortless high-volume event service.
              </p>
            </div>

            {/* Card 3 */}
            <div className="text-left space-y-3 group sm:col-span-2 lg:col-span-1">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl shadow-sm">
                <Image
                  src="/products/PHOTOS_Flavour&Co-4.jpg"
                  alt="Great for events and functions"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={95}
                />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1c1410]">
                Great for events and functions
              </h3>
              <p className="text-xs text-[#1c1410]/75 leading-relaxed">
                Elevated cocktail food options that delight corporate and private guests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Wholesale Contact Form Section (Matching Contact Page Aesthetic & 2 Inputs Per Row) */}
      <section id="wholesale-form" className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 scroll-mt-10">
        <div className="text-center mb-10 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#6b1e30]">
            Get In Touch
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1c1410]">
            PARTNER WITH FLAVOUR &amp; CO
          </h2>
          <p className="text-sm sm:text-base text-[#1c1410]/75 max-w-xl mx-auto italic font-serif">
            Let&apos;s bring something new to your menu. Fill out the form below for wholesale pricing and sample packs.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-[#c69c40]/30 shadow-sm text-center space-y-4 animate-fadeIn">
            <CheckCircle2 className="mx-auto h-14 w-14 text-[#c69c40]" />
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1c1410]">
              Wholesale Inquiry Received!
            </h3>
            <p className="text-xs sm:text-sm text-[#1c1410]/80 max-w-md mx-auto leading-relaxed">
              Thank you, {formData.name} from {formData.businessName || "your venue"}! Simran or a team member will get in touch with product spec sheets and sample details.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 inline-block bg-[#c69c40] text-[#1c1410] font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg hover:bg-[#6b1e30] hover:text-white transition-colors"
            >
              Submit Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            
            {/* Row 1: Name & Business Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label htmlFor="name" className="block text-xs font-serif italic text-[#1c1410]/70">
                  *Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full bg-transparent border-b border-[#1c1410]/20 py-2.5 text-sm text-[#1c1410] placeholder:text-[#1c1410]/40 focus:outline-none focus:border-[#c69c40] transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="businessName" className="block text-xs font-serif italic text-[#1c1410]/70">
                  *Business / Venue Name
                </label>
                <input
                  type="text"
                  id="businessName"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="e.g. The Grand Café Sydney"
                  className="w-full bg-transparent border-b border-[#1c1410]/20 py-2.5 text-sm text-[#1c1410] placeholder:text-[#1c1410]/40 focus:outline-none focus:border-[#c69c40] transition-colors"
                />
              </div>
            </div>

            {/* Row 2: Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label htmlFor="email" className="block text-xs font-serif italic text-[#1c1410]/70">
                  *Work Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  className="w-full bg-transparent border-b border-[#1c1410]/20 py-2.5 text-sm text-[#1c1410] placeholder:text-[#1c1410]/40 focus:outline-none focus:border-[#c69c40] transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="phone" className="block text-xs font-serif italic text-[#1c1410]/70">
                  Phone
                </label>
                <div className="flex items-center gap-2 border-b border-[#1c1410]/20 py-1 overflow-hidden">
                  <select
                    value={formData.countryCode}
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                    aria-label="Country Code"
                    className="w-[85px] sm:w-[105px] shrink-0 bg-transparent text-xs font-semibold text-[#1c1410] focus:outline-none cursor-pointer py-1 truncate"
                  >
                    {countryCodes.map((c, i) => (
                      <option key={`${c.code}-${i}`} value={c.code} className="bg-[#fdf8f3] text-[#1c1410]">
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>

                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter phone number"
                    className="flex-1 min-w-0 bg-transparent text-sm text-[#1c1410] placeholder:text-[#1c1410]/40 focus:outline-none py-1 truncate"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Venue Type */}
            <div className="space-y-1">
              <label htmlFor="venueType" className="block text-xs font-serif italic text-[#1c1410]/70">
                Venue Type
              </label>
              <select
                id="venueType"
                value={formData.venueType}
                onChange={(e) => setFormData({ ...formData, venueType: e.target.value })}
                className="w-full bg-transparent border-b border-[#1c1410]/20 py-2.5 text-sm text-[#1c1410] focus:outline-none cursor-pointer"
              >
                <option value="Café / Coffee Shop" className="bg-[#fdf8f3] text-[#1c1410]">Café / Coffee Shop</option>
                <option value="Catering & Events" className="bg-[#fdf8f3] text-[#1c1410]">Catering &amp; Events</option>
                <option value="Hotel / Resort" className="bg-[#fdf8f3] text-[#1c1410]">Hotel / Resort</option>
                <option value="Retailer / Gourmet Grocery" className="bg-[#fdf8f3] text-[#1c1410]">Retailer / Gourmet Grocery</option>
                <option value="Other" className="bg-[#fdf8f3] text-[#1c1410]">Other Foodservice Venue</option>
              </select>
            </div>

            {/* Row 4: Message Textarea */}
            <div className="space-y-2 pt-2">
              <div className="bg-[#f7efe6]/60 border border-[#c69c40]/30 rounded-lg p-4">
                <label htmlFor="message" className="block text-xs text-[#1c1410]/60 mb-2 italic">
                  In this space, please describe your venue, estimated weekly quantity, or sample request:
                </label>
                <textarea
                  id="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we partner with you?"
                  className="w-full bg-transparent text-sm text-[#1c1410] placeholder:text-[#1c1410]/40 focus:outline-none resize-y"
                />
              </div>
            </div>

            {/* SUBMIT Button */}
            <div className="pt-4 w-full">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-[#c69c40] hover:bg-[#6b1e30] text-[#1c1410] hover:text-white font-bold text-xs uppercase tracking-[0.2em] px-10 py-3.5 rounded shadow-sm transition-all duration-300 cursor-pointer disabled:opacity-50"
              >
                {loading ? "SUBMITTING..." : "SUBMIT WHOLESALE INQUIRY"}
              </button>
            </div>
          </form>
        )}
      </section>

    </div>
  );
}
