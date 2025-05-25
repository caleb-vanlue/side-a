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
      className={`flex items-center justify-center gap-3 py-3 px-6 bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer ${className}`}
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">{title}</h1>
          {description && <p className="text-gray-600">{description}</p>}
        </div>
      )}

      <div className="max-w-7xl mx-auto">{children}</div>
    </PageLayout>
  );
}
