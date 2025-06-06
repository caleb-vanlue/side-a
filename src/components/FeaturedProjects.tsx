import Link from "next/link";
import { ExternalLink } from "./shared/ExternalLink";
import { Section } from "./shared/Section";
import { SectionTitle } from "./shared/SectionTitle";
import { TechTag } from "./shared/TechTag";

export default function FeaturedProjects() {
  const projects = [
    {
      title: "Now Playing",
      description:
        "A live dashboard of current activity from my self-hosted Plex server. Displays information about music, movies, and shows I'm watching or listening to. Integrates with Spotify for tracks.",
      liveUrl: "https://nowplaying.calebvanlue.com",
      githubUrl: "https://github.com/caleb-vanlue/now-playing",
      tags: [
        "Next.js",
        "Tailwind CSS",
        "Spotify Web API",
        "Plex Media Server",
        "Vercel",
      ],
    },
    {
      title: "Discogs Collection API",
      description: (
        <>
          An intermediary web API to serve information from the official Discogs
          API from a cached source to avoid rate limiting. Currently powering
          the{" "}
          <Link
            href="/collection"
            className="text-emerald-600 hover:text-emerald-700 transition-colors duration-200 underline decoration-emerald-600/30 hover:decoration-emerald-700/50"
          >
            My Records
          </Link>{" "}
          page of this site! Authentication key required for API calls.
        </>
      ),
      liveUrl: "https://discogs-api.calebvanlue.com/api",
      githubUrl: "https://github.com/caleb-vanlue/discogs-api",
      tags: ["NestJS", "Railway", "OpenAPI", "TypeORM", "PostgreSQL"],
    },
  ];

  return (
    <Section>
      <SectionTitle>Featured Projects</SectionTitle>
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div
            key={project.title}
            className="border border-white/40 rounded-lg p-6 hover:shadow-md transition-all duration-300 bg-white/60 backdrop-blur-[2px]"
            style={{
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-medium text-gray-800">
                {project.title}
              </h3>
              <div className="flex gap-2">
                {project.liveUrl && (
                  <ExternalLink href={project.liveUrl} ariaLabel="View project">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </ExternalLink>
                )}
                <ExternalLink
                  href={project.githubUrl}
                  ariaLabel="View source code"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </ExternalLink>
              </div>
            </div>
            <p className="text-gray-600 mb-4 leading-relaxed">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <TechTag key={tag} technology={tag} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
