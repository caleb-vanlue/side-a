"use client";

import Image from "next/image";
import { useState } from "react";
import { useLazyLoad } from "@/hooks/useLazyLoad";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
  placeholder?: React.ReactNode;
}

export default function LazyImage({
  src,
  alt,
  className,
  sizes,
  placeholder,
}: LazyImageProps) {
  const [containerRef, isVisible] = useLazyLoad<HTMLDivElement>({
    rootMargin: "100px",
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {(!isVisible || !isLoaded) && !hasError && (
        <div className="absolute inset-0 z-10">
          {placeholder || (
            <div className="w-full h-full bg-gray-200 animate-pulse" />
          )}
        </div>
      )}

      {isVisible && !hasError && (
        <Image
          src={src}
          alt={alt}
          fill
          className={`${className} ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
          sizes={sizes}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
        />
      )}

      {hasError && (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
        </div>
      )}
    </div>
  );
}