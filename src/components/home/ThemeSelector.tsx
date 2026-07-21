"use client";

import { useState, useEffect } from "react";
import { Palette, Check, RefreshCw } from "lucide-react";

export const daisyThemes = [
  { id: "garnet", color: "#6b1d2f" },
  { id: "light", color: "#ffffff" },
  { id: "dark", color: "#1d232a" },
  { id: "cupcake", color: "#faf7f5" },
  { id: "emerald", color: "#66cc8a" },
  { id: "corporate", color: "#4b6bfb" },
  { id: "synthwave", color: "#e779c1" },
  { id: "retro", color: "#ef9995" },
  { id: "cyberpunk", color: "#ff7598" },
  { id: "valentine", color: "#e96d7b" },
  { id: "halloween", color: "#f28c18" },
  { id: "garden", color: "#5c7f67" },
  { id: "forest", color: "#1eb854" },
  { id: "aqua", color: "#09ecf3" },
  { id: "lofi", color: "#808080" },
  { id: "pastel", color: "#d1c1d7" },
  { id: "fantasy", color: "#6e0b75" },
  { id: "wireframe", color: "#b8b8b8" },
  { id: "black", color: "#000000" },
  { id: "luxury", color: "#dca54c" },
  { id: "dracula", color: "#ff79c6" },
  { id: "cmyk", color: "#45abee" },
  { id: "autumn", color: "#8c0327" },
  { id: "business", color: "#1c4ed8" },
  { id: "acid", color: "#ff00f4" },
  { id: "lemonade", color: "#519903" },
  { id: "night", color: "#38bdf8" },
  { id: "coffee", color: "#db924b" },
  { id: "winter", color: "#047857" },
  { id: "dim", color: "#f43f5e" },
  { id: "nord", color: "#5e81ac" },
  { id: "sunset", color: "#ff7598" },
  { id: "caramellatte", color: "#c69c40" },
  { id: "abyss", color: "#102a43" },
  { id: "silk", color: "#e0d6c8" },
];

export default function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState("garnet");

  useEffect(() => {
    const syncTheme = () => {
      const saved = localStorage.getItem("flavour_theme") || "garnet";
      setCurrentTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
      document.body.setAttribute("data-theme", saved);
    };

    syncTheme();

    window.addEventListener("storage", syncTheme);
    window.addEventListener("themeChange", syncTheme);
    return () => {
      window.removeEventListener("storage", syncTheme);
      window.removeEventListener("themeChange", syncTheme);
    };
  }, []);

  const handleSelectTheme = (themeId: string) => {
    setCurrentTheme(themeId);
    localStorage.setItem("flavour_theme", themeId);
    document.documentElement.setAttribute("data-theme", themeId);
    document.body.setAttribute("data-theme", themeId);
    window.dispatchEvent(new Event("themeChange"));
  };

  const handleResetTheme = () => {
    handleSelectTheme("garnet");
  };

  return (
    <section className="bg-base-200 py-8 sm:py-10 border-t-2 border-dashed border-secondary/30">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <div className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-1">
              <Palette className="h-4 w-4 text-secondary" />
              <span>Theme Options Playground</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
              Select Brand Theme
            </h2>
            <p className="text-xs opacity-70 mt-1">
              Test live theme options for Flavour & Co. Click any theme below to apply instantly across the site.
            </p>
          </div>

          <button
            onClick={handleResetTheme}
            className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-base-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-content transition-all shadow-sm self-start sm:self-auto shrink-0"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset to Default (garnet)
          </button>
        </div>

        {/* Themes Grid — Compact Single Line Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2.5">
          {daisyThemes.map((theme) => {
            const isActive = currentTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => handleSelectTheme(theme.id)}
                className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 border transition-all duration-200 ${
                  isActive
                    ? "border-2 border-secondary bg-base-100 shadow-md ring-2 ring-secondary/30 scale-[1.02]"
                    : "border-secondary/20 bg-base-100/70 hover:bg-base-100 hover:border-secondary/50 hover:scale-[1.01]"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-black/10 shadow-inner inline-block shrink-0"
                    style={{ backgroundColor: theme.color }}
                  />
                  <span className="font-mono text-xs font-bold text-primary truncate">
                    {theme.id}
                  </span>
                </div>
                {isActive && <Check className="h-3.5 w-3.5 text-secondary shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
