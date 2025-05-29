import { Section } from "./shared/Section";
import { SectionTitle } from "./shared/SectionTitle";
import { TechBadge } from "./shared/TechBadge";
import {
  SiNextdotjs,
  SiNestjs,
  SiTypescript,
  SiPostgresql,
  SiGooglecloud,
  SiRailway,
  SiDocker,
  SiTailwindcss,
} from "react-icons/si";

export default function TechnicalSkills() {
  const primaryTech = [
    {
      name: "Next.js",
      icon: SiNextdotjs,
      url: "https://nextjs.org",
    },
    {
      name: "Tailwind CSS",
      icon: SiTailwindcss,
      url: "https://tailwindcss.com/",
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
      <div
        className="space-y-6 bg-white/50 backdrop-blur-[2px] p-6 rounded-lg border border-white/30"
        style={{
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.05)",
        }}
      >
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
