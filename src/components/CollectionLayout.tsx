"use client";

import { ReactNode } from "react";
import PageLayout from "./PageLayout";
import Image from "next/image";

interface CollectionLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

function DiscogsBanner({ className = "" }: { className?: string }) {
  return (
    <a
      href="https://www.discogs.com"
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-center gap-3 py-3 px-6 bg-white/70 backdrop-blur-sm border border-white/40 rounded-lg shadow-sm hover:bg-white/80 transition-all duration-300 ${className}`}
      style={{
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
      }}
    >
      <span className="text-gray-600 text-sm font-medium">Powered by</span>
      <div className="flex items-center gap-2">
        <Image
          src="/images/discogs.svg"
          alt="Discogs"
          width={24}
          height={24}
          className="w-14 h-8"
        />
      </div>
    </a>
  );
}

export default function CollectionLayout({
  children,
  title = "My Collection",
  description,
}: CollectionLayoutProps) {
  return (
    <PageLayout>
      <div className="flex justify-center mb-6 mt-12 sm:mt-4">
        <DiscogsBanner className="max-w-sm" />
      </div>

      {title && (
        <div
          className="text-center mb-8 bg-white/60 backdrop-blur-[2px] p-5 rounded-lg border border-white/40 max-w-3xl mx-auto"
          style={{
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.07)",
          }}
        >
          <h1
            className="text-3xl font-light text-gray-900 mb-2"
            style={{
              textShadow: "0 1px 2px rgba(255, 255, 255, 0.6)",
            }}
          >
            {title}
          </h1>
          {description && <p className="text-gray-700">{description}</p>}
        </div>
      )}

      <div className="max-w-7xl mx-auto">{children}</div>
    </PageLayout>
  );
}
