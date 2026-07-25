import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyle =
    "inline-flex items-center justify-center font-serif font-bold uppercase tracking-wider text-center transition-all duration-300 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles = {
    primary: "bg-[#6b1e30] hover:bg-[#6b1e30]/90 text-white border border-transparent",
    secondary: "bg-[#c69c40] hover:bg-[#c69c40]/90 text-white border border-transparent",
  };

  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
