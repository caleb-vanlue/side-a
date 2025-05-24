import { Section } from "./shared/Section";
import { SectionTitle } from "./shared/SectionTitle";
import { TechBadge } from "./shared/TextBadge";

export default function TechnicalSkills() {
  const primaryTech = [
    { name: "Next.js", icon: "nextjs", url: "https://nextjs.org" },
    { name: "NestJS", icon: "nestjs", url: "https://nestjs.com" },
    {
      name: "TypeScript",
      icon: "typescript",
      url: "https://www.typescriptlang.org",
    },
    {
      name: "PostgreSQL",
      icon: "postgresql",
      url: "https://www.postgresql.org",
    },
    { name: "Google Cloud", icon: "gcp", url: "https://cloud.google.com" },
    {
      name: "GitHub Actions",
      icon: "github",
      url: "https://github.com/features/actions",
    },
    { name: "Railway", icon: "railway", url: "https://railway.app" },
    { name: "Docker", icon: "docker", url: "https://www.docker.com" },
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
