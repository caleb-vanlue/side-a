"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  // Don't show footer on home page
  if (pathname === "/") {
    return null;
  }

  return (
    <footer className="mt-4">
      <div className="max-w-2xl mx-auto px-6 py-6">
        <p className="text-center text-gray-600">
          © {currentYear} Caleb Van Lue. Thanks for visiting!
        </p>
      </div>
    </footer>
  );
}
