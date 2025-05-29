import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export default function Card({
  children,
  className = "",
  onClick,
  hover = true,
  padding = "md",
}: CardProps) {
  const paddingClasses = {
    none: "",
    sm: "p-3",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`
        border border-white/40 
        rounded-lg 
        bg-white/70 backdrop-blur-sm
        ${paddingClasses[padding]} 
        ${hover ? "hover:shadow-md transition-all duration-300" : ""} 
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
      style={{
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
