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
      company: "The Van Lue/Elrod Residence",
      position: "Self-Directed Technical Development",
      duration: "Sept. 2025 - Present",
      location: "Indiana",
      description: [
        "Designed, deployed, and maintained a self-hosted TrueNAS server environment supporting 24/7 media streaming, network video recording, DNS services, network-wide ad blocking, and cloud backup workflows",
        "Managed ongoing server administration tasks including uptime monitoring, storage pool management, replication, permissions configuration, backup strategies, and service reliability troubleshooting",
        "Gained hands-on experience with networking fundamentals, Docker containerization, self-hosted infrastructure, and distributed service management through day-to-day operation and expansion of home lab",
        "Developed and maintained personal web applications using Next.js to strengthen modern web development skills and explore new frontend and deployment workflows",
      ],
      technologies: [
        "TrueNAS",
        "Docker",
        "Linux",
        "Nginx Proxy Manager",
        "Plex Media Server",
        "Immich",
        "Frigate",
        "Pi-hole",
        "Next.js",
      ],
    },
    {
      company: "Ferguson",
      companyUrl: "https://theferg.com",
      position: "Software Engineer",
      duration: "March 2025 - Sept. 2025",
      location: "Fort Wayne, Indiana",
      description: [
        "Collaborate with cross-functional teams to develop public-facing websites, data administration tools, and dynamic APIs serving Ferguson's diverse client base",
        "Build and maintain scalable web services that handle complex business requirements across multiple product lines",
        "Develop custom data migration scripts to ensure reliable data replication between development and production environments",
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
      duration: "May 2022 - Oct. 2024",
      location: "Fort Wayne, Indiana",
      description: [
        "Designed, developed, and deployed cloud- and mobile-based logistics tools, reducing redundancy in warehouse pick routing and improving associate travel times by 35%",
        "Implemented failsafe systems around critical workflows, reducing incident recovery time and automating recovery processes where possible",
        "Led efforts to optimize database schema across cloud and on-prem storage, reducing query execution times by up to 90%",
        "Built and maintained ~15 scalable REST APIs and applications leveraging modern technologies (React, Vue, Kotlin) for critical distribution workflows",
        "Provided feedback and suggestions to engineers through code reviews and pairing sessions, standardizing practices to reduce code variability",
        "Collaborated with team and business leaders in agile sprint cycles to gather requirements, receive feedback, and ensure timely delivery of solutions",
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
      duration: "Jan. 2020 - Dec. 2021",
      location: "Muncie, Indiana",
      description: [
        "Mentored 50+ students in mastering core software engineering principles, with a focus on object-oriented programming (OOP) and algorithm design",
        "Enhanced curriculum through collaboration with students and faculty, determining most effective practices and expanding upon them to improve student retention and course satisfaction",
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
                        <TechTag key={tech} technology={tech} />
                      ))}
                    </div>
                  )}

                <button
                  onClick={() => toggleExpanded(index)}
                  className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors duration-200 text-sm font-medium cursor-pointer"
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
