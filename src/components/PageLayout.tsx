"use client";

import useMediaQuery from "../hooks/useMediaQuery";
import Navigation from "./Navigation";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  withoutPadding?: boolean;
}

export default function PageLayout({
  children,
  className = "",
  containerClassName = "",
  withoutPadding = false,
}: PageLayoutProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <main className={`min-h-screen ${className}`}>
      <Navigation />

      <div
        className={`
          container mx-auto 
          ${withoutPadding ? "" : "px-4"} 
          ${isDesktop ? "pt-20" : "pt-17"} 
          ${containerClassName}
        `}
      >
        {children}
      </div>
    </main>
  );
}
