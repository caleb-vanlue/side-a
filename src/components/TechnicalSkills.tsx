import { Section } from "./shared/Section";
import { SectionTitle } from "./shared/SectionTitle";
import { TechBadge } from "./shared/TechBadge";
import {
  SiNextdotjs,
  SiNestjs,
  SiTypescript,
  SiPostgresql,
  SiGooglecloud,
  SiGithubactions,
  SiRailway,
  SiDocker,
} from "react-icons/si";

export default function TechnicalSkills() {
  const primaryTech = [
    {
      name: "Next.js",
      icon: SiNextdotjs,
      url: "https://nextjs.org",
    },
    {
      name: "NestJS",
      icon: SiNestjs,
      url: "https://nestjs.com",
    },
    {
      name: "TypeScript",
      icon: SiTypescript,
      url: "https://www.typescriptlang.org",
    },
    {
      name: "PostgreSQL",
      icon: SiPostgresql,
      url: "https://www.postgresql.org",
    },
    {
      name: "Google Cloud",
      icon: SiGooglecloud,
      url: "https://cloud.google.com",
    },
    {
      name: "GitHub Actions",
      icon: SiGithubactions,
      url: "https://github.com/features/actions",
    },
    {
      name: "Railway",
      icon: SiRailway,
      url: "https://railway.app",
    },
    {
      name: "Docker",
      icon: SiDocker,
      url: "https://www.docker.com",
    },
  ];

  return (
    <Section>
      <SectionTitle>Technical Skills</SectionTitle>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Current Stack
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {primaryTech.map((tech) => (
              <TechBadge
                key={tech.name}
                name={tech.name}
                icon={tech.icon}
                url={tech.url}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
