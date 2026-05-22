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
  SiLinux,
  SiNginx,
  SiApachekafka,
  SiReact,
  SiVuedotjs,
  SiGraphql,
} from "react-icons/si";

export default function TechnicalSkills() {
  const developmentTech = [
    {
      name: "Next.js",
      icon: SiNextdotjs,
      url: "https://nextjs.org",
    },
    {
      name: "React",
      icon: SiReact,
      url: "https://reactjs.org",
    },
    {
      name: "Vue.js",
      icon: SiVuedotjs,
      url: "https://vuejs.org",
    },
    {
      name: "TypeScript",
      icon: SiTypescript,
      url: "https://www.typescriptlang.org",
    },
    {
      name: "Tailwind CSS",
      icon: SiTailwindcss,
      url: "https://tailwindcss.com/",
    },
  ];

  const backendTech = [
    {
      name: "NestJS",
      icon: SiNestjs,
      url: "https://nestjs.com",
    },
    {
      name: "PostgreSQL",
      icon: SiPostgresql,
      url: "https://www.postgresql.org",
    },
    {
      name: "GraphQL",
      icon: SiGraphql,
      url: "https://graphql.org",
    },
    {
      name: "Apache Kafka",
      icon: SiApachekafka,
      url: "https://kafka.apache.org",
    },
  ];

  const infrastructureTech = [
    {
      name: "Docker",
      icon: SiDocker,
      url: "https://www.docker.com",
    },
    {
      name: "Linux",
      icon: SiLinux,
      url: "https://www.linux.org",
    },
    {
      name: "Nginx",
      icon: SiNginx,
      url: "https://nginxproxymanager.com",
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
            Development
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {developmentTech.map((tech) => (
              <TechBadge
                key={tech.name}
                name={tech.name}
                icon={tech.icon}
                url={tech.url}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Backend & Data
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {backendTech.map((tech) => (
              <TechBadge
                key={tech.name}
                name={tech.name}
                icon={tech.icon}
                url={tech.url}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Infrastructure & DevOps
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {infrastructureTech.map((tech) => (
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
