"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { wholesaleBrands, wholesaleTestimonials } from "@/lib/data";
import PhoneInput from "@/components/ui/PhoneInput";


// Hotel & Brand Vector Logos
function FullertonHotelLogo() {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2 opacity-90 hover:opacity-100 transition-opacity">
      <div className="text-[#c69c40] font-serif text-xl font-bold">F</div>
      <div className="flex flex-col text-left">
        <span className="font-serif font-extrabold text-xs sm:text-sm tracking-widest text-[#1c1410] uppercase">THE FULLERTON HOTEL</span>
        <span className="text-[9px] font-sans font-semibold tracking-wider text-[#6b1e30] uppercase">SYDNEY • 5-STAR</span>
      </div>
    </div>
  );
}

function SheratonGrandLogo() {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2 opacity-90 hover:opacity-100 transition-opacity">
      <div className="w-6 h-6 rounded-full border-2 border-[#c69c40] flex items-center justify-center text-[#c69c40] font-serif text-xs font-bold">S</div>
      <div className="flex flex-col text-left">
        <span className="font-serif font-extrabold text-xs sm:text-sm tracking-widest text-[#1c1410] uppercase">SHERATON GRAND</span>
        <span className="text-[9px] font-sans font-semibold tracking-wider text-[#6b1e30] uppercase">HYDE PARK SYDNEY</span>
      </div>
    </div>
  );
}

function AmoraHotelLogo() {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2 opacity-90 hover:opacity-100 transition-opacity">
      <span className="font-serif italic font-black text-lg text-[#6b1e30]">Amora</span>
      <div className="flex flex-col text-left">
        <span className="font-sans font-black text-xs sm:text-sm tracking-widest text-[#1c1410] uppercase">HOTEL JAMISON</span>
        <span className="text-[9px] font-sans font-semibold tracking-wider text-[#c69c40] uppercase">SYDNEY • 5-STAR</span>
      </div>
    </div>
  );
}

function NovotelLogo() {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2 opacity-90 hover:opacity-100 transition-opacity">
      <div className="bg-[#07402b] text-white px-2.5 py-1 font-sans font-black text-xs tracking-widest uppercase rounded">
        NOVOTEL
      </div>
      <span className="text-[10px] font-bold text-[#1c1410] tracking-wider uppercase">DARLING HARBOUR</span>
    </div>
  );
}

function ParkRoyalLogo() {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2 opacity-90 hover:opacity-100 transition-opacity">
      <div className="text-[#6b1e30] font-serif text-base font-black tracking-tighter">PR</div>
      <div className="flex flex-col text-left">
        <span className="font-serif font-extrabold text-xs sm:text-sm tracking-widest text-[#1c1410] uppercase">PARKROYAL</span>
        <span className="text-[9px] font-sans font-semibold tracking-wider text-[#6b1e30] uppercase">PARRAMATTA</span>
      </div>
    </div>
  );
}

function Channel7PlateLogo() {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2 opacity-90 hover:opacity-100 transition-opacity">
      <span className="bg-[#6b1e30] text-cream px-2 py-0.5 rounded text-xs font-bold">7</span>
      <div className="flex flex-col text-left">
        <span className="font-sans font-black text-xs sm:text-sm tracking-widest text-[#1c1410] uppercase">CHANNEL SEVEN</span>
        <span className="text-[9px] font-sans font-bold tracking-wider text-[#c69c40] uppercase">PLATE OF ORIGIN</span>
      </div>
    </div>
  );
}

function CorporateCateringLogo() {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2 opacity-90 hover:opacity-100 transition-opacity">
      <svg className="w-5 h-5 text-[#c69c40]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" />
      </svg>
      <div className="flex flex-col text-left">
        <span className="font-serif font-bold text-xs sm:text-sm tracking-widest text-[#1c1410] uppercase">CORPORATE CATERING</span>
        <span className="text-[9px] font-sans font-semibold tracking-wider text-[#6b1e30] uppercase">FOODSERVICE PARTNERS</span>
      </div>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/wholesale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactName: formData.name,
          businessName: formData.businessName,
          email: formData.email,
          phone: `${formData.countryCode} ${formData.phone}`,
          businessType: formData.venueType,
          message: formData.message,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        alert("Failed to submit inquiry. Please try again.");
      }
    } catch {
      alert("Submission error. Please check your connection.");
    } finally {
      setLoading(false);
    }
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
              Elevating Menus Nationwide
            </h2>
            <p className="text-sm sm:text-base text-[#1c1410]/80 leading-relaxed font-sans max-w-xl">
              Flavour &amp; Co partners with cafés, caterers, 5-star hotels and foodservice key venues across Australia to deliver premium Indo-Australian pies that stand out on any menu. Handcrafted with local Australian ingredients and backed by nationwide logistics partners.
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
                loading="eager"
              />
            </div>
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
                  HACCP-Certified &amp; 12-Month Shelf Life
                </h3>
                <p className="text-xs sm:text-sm text-[#1c1410]/80 leading-relaxed font-sans">
                  Supplied frozen with a 12-month shelf life under strict HACCP accreditation for reliable stock holding and nationwide distribution.
                </p>
              </div>

              {/* Point 2 */}
              <div className="space-y-1 border-l-2 border-[#c69c40] pl-4">
                <h3 className="font-serif text-xl font-bold text-[#1c1410]">
                  Distinctive Range
                </h3>
                <p className="text-xs sm:text-sm text-[#1c1410]/80 leading-relaxed font-sans">
                  A curated range of Indo-Australian pies, canapés, and gluten-free South Asian breakfast items that elevate traditional flavours into something modern and menu-worthy.
                </p>
              </div>

              {/* Point 3 */}
              <div className="space-y-1 border-l-2 border-[#c69c40] pl-4">
                <h3 className="font-serif text-xl font-bold text-[#1c1410]">
                  Built for Scale &amp; Key Venues
                </h3>
                <p className="text-xs sm:text-sm text-[#1c1410]/80 leading-relaxed font-sans">
                  Designed for ease of preparation and consistency across service for key venues, with flexible logistics serving clients Australia-wide.
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
                  src="/products/cabinet-display-pies.jpg"
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

              <PhoneInput
                id="phone"
                label="Phone"
                value={formData.phone}
                countryCode={formData.countryCode}
                onChangePhone={(phone) => setFormData({ ...formData, phone })}
                onChangeCountryCode={(countryCode) => setFormData({ ...formData, countryCode })}
                placeholder="*Phone Number"
              />
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
