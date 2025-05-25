import { Section } from "./shared/Section";
import { SectionTitle } from "./shared/SectionTitle";

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

  const formatDuration = (duration: string) => {
    return duration;
  };

  return (
    <Section>
      <SectionTitle>Experience</SectionTitle>
      <div className="space-y-8">
        {experiences.map((experience, index) => (
          <div
            key={`${experience.company}-${index}`}
            className="border-l-2 border-emerald-600 pl-6 relative"
          >
            <div className="absolute -left-2 top-0 w-4 h-4 bg-emerald-600 rounded-full"></div>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-xl font-medium text-gray-800">
                    {experience.position}
                  </h3>
                  <div className="flex items-center gap-2">
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

              <ul className="space-y-2">
                {experience.description.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="text-gray-600 leading-relaxed flex items-start gap-2"
                  >
                    <span className="text-emerald-600 mt-2 text-xs">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {experience.technologies &&
                experience.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {experience.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
