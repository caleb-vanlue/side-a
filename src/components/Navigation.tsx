"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useMediaQuery from "../hooks/useMediaQuery";
import { NAVIGATION_LINKS } from "../lib/constants";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  useEffect(() => {
    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close menu when path changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/10 backdrop-blur-sm py-5">
        <div className="container mx-auto px-6 flex justify-center items-center">
          <Link href="/" className="text-xl font-medium text-gray-900">
            Caleb Van Lue
          </Link>
        </div>
      </nav>
    );
  }

  const mobileNav = (
    <div ref={navRef} className="fixed top-0 left-0 right-0 z-50">
      <nav
        onClick={() => setMenuOpen(!menuOpen)}
        className={`transition-all duration-300 cursor-pointer ${
          scrolled
            ? "bg-white/80 shadow-md backdrop-blur-md py-3"
            : "bg-white/40 backdrop-blur-sm py-4"
        }`}
        style={{
          boxShadow: scrolled ? "0 4px 20px rgba(0, 0, 0, 0.1)" : "none",
          borderBottom: !scrolled
            ? "1px solid rgba(255, 255, 255, 0.2)"
            : "none",
        }}
      >
        <div className="container mx-auto px-4 flex justify-center items-center relative">
          <span className="text-xl font-medium text-gray-900">
            Caleb Van Lue
          </span>
          <svg
            className={`w-4 h-4 text-gray-800 absolute right-4 top-1/2 transform -translate-y-1/2 transition-transform duration-200 ${
              menuOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </nav>

      <div
        className={`bg-white/90 backdrop-blur-md shadow-lg border-b border-white/40 overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="container mx-auto px-4 py-2">
          {NAVIGATION_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch={true}
              className={`block py-3 text-center text-base ${
                pathname === link.href
                  ? "text-emerald-600 font-medium border-b-2 border-emerald-600 mx-8"
                  : "text-gray-800 hover:text-emerald-600 border-b border-gray-100"
              } transition-colors duration-200`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

  const desktopNav = (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 shadow-md backdrop-blur-md py-3"
          : "bg-white/25 backdrop-blur-sm py-4"
      }`}
      style={{
        boxShadow: scrolled ? "0 4px 20px rgba(0, 0, 0, 0.1)" : "none",
        borderBottom: !scrolled ? "1px solid rgba(255, 255, 255, 0.2)" : "none",
      }}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="text-xl font-medium text-gray-900">
          Caleb Van Lue
        </Link>

        <div className="flex items-center space-x-8">
          {NAVIGATION_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch={true}
              className={`text-base font-medium transition-colors duration-200 ${
                pathname === link.href
                  ? "text-gray-900 border-b-2 border-emerald-600"
                  : "text-gray-800 hover:text-gray-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );

  return isDesktop ? desktopNav : mobileNav;
}
