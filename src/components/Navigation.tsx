"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import HamburgerButton from "./HamburgerButton";
import SideDrawer from "./SideDrawer";
import useMediaQuery from "../hooks/useMediaQuery";
import { NAVIGATION_LINKS, EXTERNAL_LINKS } from "../lib/constants";

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

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

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  const mobileMenu = (
    <>
      <HamburgerButton isOpen={menuOpen} onClick={handleMenuToggle} />
      <SideDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );

  const desktopNav = (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 shadow-md backdrop-blur-md py-3"
          : "bg-white/10 backdrop-blur-sm py-5"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-center items-center">
        <div className="flex items-center space-x-8">
          {NAVIGATION_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className={`text-base text-xl transition-colors duration-200 ${
                pathname === link.href
                  ? "text-gray-900 border-b-2 border-emerald-600"
                  : "text-gray-800 hover:text-gray-900"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {EXTERNAL_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base text-xl text-gray-800 hover:text-gray-900 transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );

  return <>{isDesktop ? desktopNav : mobileMenu}</>;
}
