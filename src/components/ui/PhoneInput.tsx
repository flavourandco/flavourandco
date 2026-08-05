"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check } from "lucide-react";
import { countryList, getCountryByCode, CountryData } from "@/lib/countries";

export interface PhoneInputProps {
  id?: string;
  value: string;
  countryCode: string;
  onChangePhone: (value: string) => void;
  onChangeCountryCode: (code: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
}

export default function PhoneInput({
  id = "phone",
  value,
  countryCode = "+61",
  onChangePhone,
  onChangeCountryCode,
  placeholder = "Enter your phone number",
  required = false,
  disabled = false,
  className = "",
  label,
}: PhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedCountry = getCountryByCode(countryCode);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery("");
    }
  }, [isOpen]);

  // Filter countries by query (name, short code, or dial code)
  const filteredCountries = countryList.filter((c: CountryData) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.short.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.iso2.toLowerCase().includes(q)
    );
  });

  const handleSelectCountry = (country: CountryData) => {
    onChangeCountryCode(country.code);
    setIsOpen(false);
  };

  return (
    <div className={`space-y-1 w-full text-left relative ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-xs font-serif italic text-[#1c1410]/70">
          {label}
        </label>
      )}

      <div className="flex items-center gap-3 relative w-full">
        {/* Country Selector Trigger */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 bg-transparent border-b border-[#1c1410]/20 hover:border-[#c69c40] py-2 text-sm text-[#1c1410] font-sans font-normal focus:outline-none transition-colors cursor-pointer"
          >
            <span className="text-base leading-none">{selectedCountry.flag}</span>
            <span className="font-normal text-sm text-[#1c1410]">
              {selectedCountry.short} ({selectedCountry.code})
            </span>
            <ChevronDown
              className={`h-3.5 w-3.5 text-[#1c1410]/60 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#c69c40]" : ""
                }`}
            />
          </button>

          {/* Custom Searchable Dropdown */}
          {isOpen && (
            <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 max-h-80 bg-white border border-[#c69c40]/30 rounded-xl shadow-2xl z-[100] flex flex-col overflow-hidden text-stone-800 font-sans text-xs animate-fadeIn">
              {/* Search Box */}
              <div className="p-2 border-b border-stone-100 bg-stone-50/80 flex items-center gap-2 sticky top-0 z-10">
                <Search className="h-4 w-4 text-stone-400 shrink-0 ml-1.5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search country or code..."
                  className="w-full bg-transparent border-none py-1.5 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none font-sans font-normal"
                />
              </div>

              {/* Country List */}
              <div className="overflow-y-auto max-h-60 py-1 divide-y divide-stone-50">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((c: CountryData) => {
                    const isSelected = c.code === countryCode;
                    return (
                      <button
                        key={`${c.iso2}-${c.code}`}
                        type="button"
                        onClick={() => handleSelectCountry(c)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left transition-colors cursor-pointer ${isSelected
                            ? "bg-[#f7efe6] font-normal text-[#1c1410]"
                            : "hover:bg-[#f9f6f0] font-normal text-stone-700"
                          }`}
                      >
                        <div className="flex items-center gap-2.5 truncate pr-2">
                          <span className="text-base shrink-0 leading-none">{c.flag}</span>
                          <span className="truncate text-xs font-normal text-[#1c1410]">{c.name}</span>
                          <span className="text-[11px] font-sans text-stone-500 font-normal shrink-0">
                            ({c.code})
                          </span>
                        </div>
                        {isSelected && <Check className="h-4 w-4 text-[#c69c40] shrink-0 ml-2 stroke-[2.5]" />}
                      </button>
                    );
                  })
                ) : (
                  <div className="py-6 text-center text-xs text-stone-400 italic">
                    No countries found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Phone Input Field */}
        <div className="flex-1 min-w-0">
          <input
            type="tel"
            id={id}
            required={required}
            disabled={disabled}
            value={value}
            onChange={(e) => onChangePhone(e.target.value)}
            placeholder={placeholder}
            className="w-full min-w-0 bg-transparent border-b border-[#1c1410]/20 py-2 text-sm text-[#1c1410] placeholder:text-[#1c1410]/40 focus:outline-none focus:border-[#c69c40] transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
