"use client";

import { useState } from "react";
import { Section } from "./shared/Section";
import { SectionTitle } from "./shared/SectionTitle";
import { TechTag } from "./shared/TechTag";

interface ExperienceItem {
  company: string;
  companyUrl?: string;
  position: string;
  duration: string;
  location: string;
  description: string[];
  technologies?: string[];
}

export default function Experience() {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const experiences: ExperienceItem[] = [
    {
      company: "Fifty Thirds",
      companyUrl: "https://fiftythirds.com",
      position: "Founder & Software Engineer",
      duration: "September 2025 - Present",
      location: "Fort Wayne, IN",
      description: [
        "Started and run a one-person software studio, handling everything from scoping, building, and supporting projects to the business side of running a company",
        "Build real-time web applications and the APIs and databases behind them, with a focus on reliability, performance, and interfaces that stay fast and accessible",
        "Develop connected hardware end to end, from embedded firmware and signal processing to the cloud backend and the companion app that people actually use",
        "Make privacy, accessibility, and cost part of the design from the start, keeping only the data a feature needs and writing decisions down before any code",
        "Run self-hosted infrastructure and CI with automated testing and backups, and use Claude Code daily for planning, implementation, and code review",
      ],
      technologies: [
        "Next.js",
        "React",
        "TypeScript",
        "NestJS",
        "PostgreSQL",
        "Supabase",
        "Expo",
        "C++",
        "ESP32 / ESP-IDF",
        "Python",
        "Docker",
        "TrueNAS",
        "Linux",
        "Cloudflare",
        "Plex Media Server",
        "Jellyfin",
        "Claude Code",
      ],
    },
    {
      company: "The Ferguson Agency",
      companyUrl: "https://theferg.com",
      position: "Software Engineer",
      duration: "March 2025 - September 2025",
      location: "Fort Wayne, IN",
      description: [
        "Built critical extensions to functionality of Ferguson's in-house software solutions using Next.js, NestJS, and GraphQL, improving user experience for multiple clients simultaneously",
        "Wrote data migration scripts using PostgreSQL and MongoDB to move vital client and product data between environments to simplify tedious manual processes",
        "Applied UTM features across Ferguson's fleet of WordPress sites, improving analytics and visibility into software usage",
      ],
      technologies: [
        "Next.js",
        "Tailwind CSS",
        "NestJS",
        "TypeScript",
        "PostgreSQL",
        "MongoDB",
        "WordPress",
        "Railway",
        "GraphQL",
        "Google Cloud",
      ],
    },
    {
      company: "Sweetwater Sound",
      companyUrl: "https://sweetwater.com",
      position: "Software Engineer",
      duration: "May 2022 - October 2024",
      location: "Fort Wayne, IN",
      description: [
        "Shipped ~15 REST APIs in NestJS and ASP.NET powering Sweetwater's distribution operations (receiving through order fulfillment), plus mobile tools in SwiftUI and Jetpack Compose for associates to take advantage of these services at scale",
        "Added indexes and query optimizations across logistics relational databases and services to improve efficiency of warehouse operations",
        "Ran daily code reviews to regularly catch issues before reaching production and to standardize team code quality and knowledge",
      ],
      technologies: [
        "NestJS",
        "TypeScript",
        "PostgreSQL",
        "ASP.NET",
        "C#",
        "React",
        "Vue.js",
        "Kotlin",
        "Apache Kafka",
        "SwiftUI",
        "Jetpack Compose",
        "Google Cloud",
      ],
    },
    {
      company: "Ball State University",
      companyUrl: "https://www.bsu.edu",
      position: "Teaching Assistant - Computer Science Department",
      duration: "January 2020 - December 2021",
      location: "Muncie, IN",
      description: [
        "Tutored 50+ students in object-oriented programming and algorithm design",
        "Worked with faculty to adjust course material based on student feedback, helping with retention and course satisfaction",
      ],
    },
  ];

  const toggleExpanded = (index: number) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <Section>
      <SectionTitle>Experience</SectionTitle>
      <div className="space-y-6">
        {experiences.map((experience, index) => {
          const isExpanded = expandedItems.has(index);

          return (
            <div
              key={`${experience.company}-${index}`}
              className="border border-white/40 rounded-lg overflow-hidden hover:shadow-sm transition-all duration-300 bg-white/60 backdrop-blur-[2px]"
              style={{
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              }}
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-gray-800 mb-1">
                      {experience.position}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      {experience.companyUrl ? (
                        <a
                          href={experience.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-navy-600 hover:text-navy-700 transition-colors duration-200 underline decoration-navy-600/30 hover:decoration-navy-700/50 font-medium"
                        >
                          {experience.company}
                        </a>
                      ) : (
                        <span className="text-navy-600 font-medium">
                          {experience.company}
                        </span>
                      )}
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600 text-sm">
                        {experience.location}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 font-medium">
                    {experience.duration}
                  </div>
                </div>

                {experience.technologies &&
                  experience.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {experience.technologies.map((tech) => (
                        <TechTag key={tech} technology={tech} />
                      ))}
                    </div>
                  )}

                <button
                  onClick={() => toggleExpanded(index)}
                  className="flex items-center gap-2 text-navy-600 hover:text-navy-700 transition-colors duration-200 text-sm font-medium cursor-pointer"
                >
                  <span>{isExpanded ? "Show less" : "Show details"}</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
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
                </button>
              </div>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Key Responsibilities & Achievements
                  </h4>
                  <ul className="space-y-2">
                    {experience.description.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="text-gray-600 leading-relaxed flex items-start gap-2"
                      >
                        <span className="text-navy-600 mt-2 text-xs">•</span>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
