import React from "react";

interface ContentSectionProps {
  children: React.ReactNode;
  className?: string;
}

export const ContentSection = ({
  children,
  className = "",
}: ContentSectionProps) => (
  <div
    className={`bg-white/60 backdrop-blur-[2px] p-6 rounded-lg border border-white/40 ${className}`}
    style={{
      boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    }}
  >
    {children}
  </div>
);
