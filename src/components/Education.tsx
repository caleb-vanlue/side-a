"use client";

import { Section } from "./shared/Section";
import { SectionTitle } from "./shared/SectionTitle";

interface EducationItem {
  school: string;
  schoolUrl?: string;
  degree: string;
  duration: string;
  location: string;
  description?: (string | React.ReactNode)[];
}

export default function Education() {
  const education: EducationItem[] = [
    {
      school: "Ball State University",
      schoolUrl: "https://www.bsu.edu",
      degree: "Bachelor of Science in Computer Science",
      duration: "2019 - 2022",
      location: "Muncie, Indiana",
      description: [
        "Graduated Summa Cum Laude",
        "Comprehensive curriculum covering Software Engineering, Data Structures & Algorithms, Programming Languages, Cloud Computing, and Networking fundamentals",
        <>
          Developed a mobile fitness application for the BSU{" "}
          <a
            href="https://www.bsu.edu/academics/collegesanddepartments/kinesiology/facilities/adult-fitness"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:text-emerald-700 transition-colors duration-200 underline decoration-emerald-600/30 hover:decoration-emerald-700/50"
          >
            Adult Physical Fitness Program
          </a>
          {" "}as my senior capstone project, delivering a real-world solution for campus health initiatives
        </>,
      ],
    },
  ];

  return (
    <Section>
      <SectionTitle>Education</SectionTitle>
      <div className="space-y-6">
        {education.map((item, index) => (
          <div
            key={`${item.school}-${index}`}
            className="border border-white/40 rounded-lg overflow-hidden hover:shadow-sm transition-all duration-300 bg-white/60 backdrop-blur-[2px]"
            style={{
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            }}
          >
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-gray-800 mb-1">
                    {item.degree}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    {item.schoolUrl ? (
                      <a
                        href={item.schoolUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:text-emerald-700 transition-colors duration-200 underline decoration-emerald-600/30 hover:decoration-emerald-700/50 font-medium"
                      >
                        {item.school}
                      </a>
                    ) : (
                      <span className="text-emerald-600 font-medium">
                        {item.school}
                      </span>
                    )}
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600 text-sm">
                      {item.location}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  {item.duration}
                </div>
              </div>

              {item.description && item.description.length > 0 && (
                <ul className="space-y-2">
                  {item.description.map((detail, detailIndex) => (
                    <li
                      key={detailIndex}
                      className="text-gray-600 leading-relaxed flex items-start gap-2"
                    >
                      <span className="text-emerald-600 mt-2 text-xs">•</span>
                      <span className="text-sm">{detail}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
