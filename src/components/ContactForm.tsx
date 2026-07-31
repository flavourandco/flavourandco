"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

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

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+61",
    phone: "",
    businessName: "",
    partnerType: "Event Catering",
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

  return (
    <div className="w-full max-w-full overflow-hidden bg-[#fdf8f3] text-[#1c1410]">
      
      {/* Top Main Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-16 items-start">
          
          {/* Left Column: Heading & Subtext */}
          <div className="lg:col-span-5 space-y-4 text-left">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1c1410] leading-tight">
              Have A Question? We&apos;re Here To Help.
            </h1>
            <p className="text-xs sm:text-base text-[#1c1410]/75 leading-relaxed font-sans">
              Whether you&apos;re curious about our pie range, event catering, or wholesale opportunities — we&apos;re just a message away. Reach out and a member from our team will get back to you within 24-48 business hours.
            </p>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7 text-left w-full min-w-0">
            {submitted ? (
              <div className="bg-white rounded-2xl p-6 sm:p-12 border border-[#c69c40]/30 shadow-sm text-center space-y-4 animate-fadeIn">
                <CheckCircle2 className="mx-auto h-14 w-14 text-[#c69c40]" />
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1c1410]">
                  Message Received!
                </h3>
                <p className="text-xs sm:text-sm text-[#1c1410]/80 max-w-md mx-auto leading-relaxed">
                  Thank you, {formData.name}! We have received your inquiry and Simran or a team member will get back to you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 inline-block bg-[#c69c40] text-[#1c1410] font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg hover:bg-[#6b1e30] hover:text-white transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 w-full min-w-0">
                {/* *Name */}
                <div className="space-y-1 w-full">
                  <label htmlFor="name" className="block text-xs font-serif italic text-[#1c1410]/70">
                    *Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full min-w-0 bg-transparent border-b border-[#1c1410]/20 py-2 text-sm text-[#1c1410] placeholder:text-[#1c1410]/40 focus:outline-none focus:border-[#c69c40] transition-colors"
                  />
                </div>

                {/* *Email */}
                <div className="space-y-1 w-full">
                  <label htmlFor="email" className="block text-xs font-serif italic text-[#1c1410]/70">
                    *Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                    className="w-full min-w-0 bg-transparent border-b border-[#1c1410]/20 py-2 text-sm text-[#1c1410] placeholder:text-[#1c1410]/40 focus:outline-none focus:border-[#c69c40] transition-colors"
                  />
                </div>

                {/* Phone with Mobile-Optimized Country Code Selector */}
                <div className="space-y-1 w-full">
                  <label htmlFor="phone" className="block text-xs font-serif italic text-[#1c1410]/70">
                    Phone
                  </label>
                  <div className="flex items-center gap-2 border-b border-[#1c1410]/20 py-1 w-full min-w-0 overflow-hidden">
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
                      placeholder="Enter your phone number"
                      className="flex-1 min-w-0 bg-transparent text-sm text-[#1c1410] placeholder:text-[#1c1410]/40 focus:outline-none py-1 truncate"
                    />
                  </div>
                </div>

                {/* Business Name (if applicable) */}
                <div className="space-y-1 w-full">
                  <label htmlFor="businessName" className="block text-xs font-serif italic text-[#1c1410]/70">
                    Business Name (if applicable)
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="Enter your venue or business name"
                    className="w-full min-w-0 bg-transparent border-b border-[#1c1410]/20 py-2 text-sm text-[#1c1410] placeholder:text-[#1c1410]/40 focus:outline-none focus:border-[#c69c40] transition-colors"
                  />
                </div>

                {/* Partner Type Selection (Mobile Responsive Grid) */}
                <div className="space-y-2 pt-1 w-full">
                  <label className="block text-xs font-serif italic text-[#1c1410]/70">
                    Inquiry Category
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full">
                    {["Retail", "Wholesale", "Event Catering", "Other"].map((type) => (
                      <label
                        key={type}
                        className={`flex items-center gap-2 px-2.5 py-2 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                          formData.partnerType === type
                            ? "border-[#c69c40] bg-[#c69c40]/10 text-[#6b1e30] font-bold"
                            : "border-[#ebe3d8] text-[#1c1410]/70 hover:border-[#c69c40]/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="partnerType"
                          value={type}
                          checked={formData.partnerType === type}
                          onChange={(e) => setFormData({ ...formData, partnerType: e.target.value })}
                          className="w-3.5 h-3.5 text-[#c69c40] accent-[#c69c40] shrink-0"
                        />
                        <span className="truncate">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Message Box */}
                <div className="space-y-2 pt-1 w-full">
                  <div className="bg-[#f7efe6]/60 border border-[#c69c40]/30 rounded-lg p-3.5 sm:p-4 w-full">
                    <label htmlFor="message" className="block text-xs text-[#1c1410]/60 mb-1.5 italic">
                      In this space, please describe your reason for reaching out!
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can we help you?"
                      className="w-full min-w-0 bg-transparent text-sm text-[#1c1410] placeholder:text-[#1c1410]/40 focus:outline-none resize-y"
                    />
                  </div>
                </div>

                {/* SUBMIT Button */}
                <div className="pt-3 w-full">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto bg-[#c69c40] hover:bg-[#6b1e30] text-[#1c1410] hover:text-white font-bold text-xs uppercase tracking-[0.2em] px-8 py-3.5 rounded shadow-sm transition-all duration-300 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? "SUBMITTING..." : "SUBMIT"}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* Bottom Section: Connect with Founder */}
      <section className="bg-[#f7efe6] border-t border-[#ebe3d8] py-12 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-16 items-center">
            
            {/* Left Column Text */}
            <div className="lg:col-span-8 text-left space-y-6 sm:space-y-8">
              <div>
                <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-normal text-[#1c1410]">
                  Connect with Flavour &amp; Co&apos;s Founder
                </h2>
              </div>

              {/* Sub-block 1 */}
              <div className="space-y-1.5">
                <h3 className="font-serif text-lg sm:text-2xl text-[#c69c40] italic">
                  Interested in working with <span className="text-[#6b1e30] font-semibold not-italic">Simran?</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#1c1410]/80 leading-relaxed font-sans">
                  The best way to get started is to fill in the form above and leave detailed information about what type of support, event catering, or wholesale partnership you are looking for.
                </p>
              </div>

              {/* Sub-block 2 */}
              <div className="space-y-1.5">
                <h3 className="font-serif text-lg sm:text-2xl text-[#c69c40] italic">
                  Interested in <span className="text-[#6b1e30] font-semibold not-italic">connecting?</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#1c1410]/80 leading-relaxed font-sans">
                  Simran is passionate about food heritage, artisan baking, and community. She is open to media interviews, podcast features, guest blog collaborations, speaking opportunities, and joint ventures across Sydney and beyond.
                </p>
              </div>
            </div>

            {/* Right Column: Founder Photo */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="relative aspect-[3/4] w-full max-w-[240px] sm:max-w-[300px] overflow-hidden rounded-xl shadow-lg border-4 border-white">
                <Image
                  src="/founder/simran-coloured.jpg"
                  alt="Simran — Founder of Flavour & Co."
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 240px, 300px"
                  quality={95}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
