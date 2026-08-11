import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "green";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyle =
    "group relative overflow-hidden inline-flex items-center justify-center font-serif font-bold uppercase tracking-wider text-center transition-all duration-300 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded-sm";

  const variantStyles = {
    primary: "bg-[#6b1e30] text-white border border-transparent",
    secondary: "bg-[#c69c40] text-white border border-transparent",
    green: "bg-[#07402b] text-white border border-transparent",
  };

  const underlineColor = variant === "secondary" ? "bg-[#6b1e30]" : "bg-[#c69c40]";

  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {/* Sliding gold or garnet underline from bottom edge left-to-right */}
      <span className={`absolute bottom-0 left-0 h-[3px] ${underlineColor} w-full origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100`} />
    </button>
  );
}
