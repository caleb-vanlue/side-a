"use client";

import { useState } from "react";
import { Section } from "./shared/Section";
import { SectionTitle } from "./shared/SectionTitle";
import { getTechColor } from "./shared/techColors";

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
      company: "Ferguson",
      companyUrl: "https://theferg.com",
      position: "Software Engineer",
      duration: "2025 - Present",
      location: "Fort Wayne, Indiana",
      description: [
        "Collaborate with cross-functional teams to develop public-facing websites, data administration tools, and dynamic APIs serving Ferguson's diverse client base",
        "Build and maintain scalable web services that handle complex business requirements across multiple product lines",
        "Develop custom data migration scripts with conditional logic to ensure reliable data replication between environments",
      ],
      technologies: [
        "Next.js",
        "Tailwind CSS",
        "NestJS",
        "TypeScript",
        "PostgreSQL",
        "WordPress",
        "Railway",
        "GraphQL",
        "Google Cloud",
      ],
    },
    {
      company: "Sweetwater",
      companyUrl: "https://sweetwater.com",
      position: "Software Engineer",
      duration: "2022 - 2024",
      location: "Fort Wayne, Indiana",
      description: [
        "Built and supported critical APIs and internal applications powering the company's logistics and distribution operations",
        "Designed and implemented data pipelines for inventory allocation systems, ensuring reliable and timely data representation across platforms",
        "Worked with diverse technology stack spanning backend services, web applications, and mobile development",
        "Collaborated with teams to maintain high-availability systems supporting nationwide music equipment distribution",
      ],
      technologies: [
        "NestJS",
        "TypeScript",
        "PostgreSQL",
        "ASP.NET",
        "C#",
        "Vue.js",
        "Apache Kafka",
        "SwiftUI",
        "Jetpack Compose",
        "Google Cloud",
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

  const formatDuration = (duration: string) => {
    return duration;
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
                          className="text-emerald-600 hover:text-emerald-700 transition-colors duration-200 underline decoration-emerald-600/30 hover:decoration-emerald-700/50 font-medium"
                        >
                          {experience.company}
                        </a>
                      ) : (
                        <span className="text-emerald-600 font-medium">
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
                    {formatDuration(experience.duration)}
                  </div>
                </div>

                {experience.technologies &&
                  experience.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {experience.technologies.map((tech) => (
                        <span
                          key={tech}
                          className={`px-2 py-1 text-xs rounded-full ${getTechColor(
                            tech
                          )}`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                <button
                  onClick={() => toggleExpanded(index)}
                  className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors duration-200 text-sm font-medium"
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
                  isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
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
                        <span className="text-emerald-600 mt-2 text-xs">•</span>
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
