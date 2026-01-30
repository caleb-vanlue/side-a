"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  FaLinkedin,
  FaGithub,
  FaFileDownload,
  FaEnvelope,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { Button } from "./ui";

const PHOTOS = [
  "/images/avatar.jpeg",
  "/images/avatar-2.png",
  "/images/avatar-3.png",
  "/images/avatar-4.png",
];

const AUTO_ADVANCE_MS = 10000;

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const yearsExperience = (() => {
    const start = new Date("2022-05-09");
    const now = new Date();
    let diff = now.getFullYear() - start.getFullYear();
    if (
      now.getMonth() < start.getMonth() ||
      (now.getMonth() === start.getMonth() && now.getDate() < start.getDate())
    ) {
      diff--;
    }
    return diff;
  })();

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % PHOTOS.length);
  }, []);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + PHOTOS.length) % PHOTOS.length);
  }, []);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(goNext, AUTO_ADVANCE_MS);
    return () => clearInterval(interval);
  }, [isHovered, goNext]);

  return (
    <div className="text-center mb-12">
      <div className="mb-8 inline-block">
        <div
          className="relative flex items-center gap-2 group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button
            onClick={goPrev}
            className="p-1.5 rounded-full bg-black/30 text-white opacity-70 sm:opacity-0 sm:group-hover:opacity-70 hover:!opacity-100 transition-opacity duration-200 cursor-pointer"
            aria-label="Previous photo"
          >
            <FaChevronLeft className="w-3 h-3" />
          </button>

          <div className="p-1 rounded-full bg-gradient-to-r from-emerald-200/50 to-blue-200/50 backdrop-blur-sm">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden border-4 border-white/70 shadow-lg hover:shadow-xl transition-all duration-300">
              {PHOTOS.map((src, i) => (
                <Image
                  key={src}
                  src={src}
                  alt="Caleb Van Lue"
                  fill
                  className={`object-cover transition-opacity duration-500 ${
                    i === currentIndex ? "opacity-100" : "opacity-0"
                  }`}
                  priority={i === 0}
                />
              ))}
            </div>
          </div>

          <button
            onClick={goNext}
            className="p-1.5 rounded-full bg-black/30 text-white opacity-70 sm:opacity-0 sm:group-hover:opacity-70 hover:!opacity-100 transition-opacity duration-200 cursor-pointer"
            aria-label="Next photo"
          >
            <FaChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="flex justify-center gap-1.5 mt-3">
          {PHOTOS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === currentIndex
                  ? "bg-gray-600 scale-125"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to photo ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-center items-center gap-4 mb-8">
        <a href="/doc/Caleb Van Lue.pdf" download className="inline-block">
          <Button
            variant="primary"
            size="md"
            className="inline-flex items-center gap-2 shadow-lg"
          >
            <FaFileDownload className="w-4 h-4" />
            Resume
          </Button>
        </a>

        <a
          href="mailto:vanluecaleb@outlook.com"
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/60 backdrop-blur-[2px] border border-white/30 text-gray-700 hover:text-emerald-600 hover:bg-white/80 transition-all duration-200 shadow-lg"
          aria-label="Email Contact"
        >
          <FaEnvelope className="w-5 h-5" />
        </a>

        <a
          href="https://www.linkedin.com/in/calebvanlue/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/60 backdrop-blur-[2px] border border-white/30 text-gray-700 hover:text-emerald-600 hover:bg-white/80 transition-all duration-200 shadow-lg"
          aria-label="LinkedIn Profile"
        >
          <FaLinkedin className="w-5 h-5" />
        </a>

        <a
          href="https://github.com/caleb-vanlue"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/60 backdrop-blur-[2px] border border-white/30 text-gray-700 hover:text-emerald-600 hover:bg-white/80 transition-all duration-200 shadow-lg"
          aria-label="GitHub Profile"
        >
          <FaGithub className="w-5 h-5" />
        </a>
      </div>

      <div
        className="bg-white/50 backdrop-blur-[2px] p-6 rounded-lg inline-block border border-white/30"
        style={{
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1
          className="text-4xl sm:text-5xl font-light text-gray-900 mb-4"
          style={{
            textShadow: "0 1px 3px rgba(255, 255, 255, 0.8)",
          }}
        >
          Caleb Van Lue
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Software Engineer with {yearsExperience} years of experience building
          web services, databases, and user interfaces.
        </p>
      </div>
    </div>
  );
}
