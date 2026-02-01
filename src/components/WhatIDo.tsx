import { Section } from "./shared/Section";
import { SectionTitle } from "./shared/SectionTitle";

export default function WhatIDo() {
  const services = [
    {
      title: "Web Development",
      description:
        "I build public-facing websites and internal tools using modern frameworks like Next.js, React, and Vue. I focus on creating interfaces that are clean, responsive, and easy to maintain.",
    },
    {
      title: "API Design",
      description:
        "I design and maintain scalable REST APIs and GraphQL services. I've worked on microservice architectures that replace monolithic systems, improving reliability and reducing complexity.",
    },
    {
      title: "Mobile Development",
      description:
        "I develop native mobile applications for both iOS and Android using SwiftUI and Jetpack Compose. I've built logistics tools that measurably improved user efficiency in the field.",
    },
    {
      title: "Cloud & Infrastructure",
      description:
        "I work with cloud platforms and CI/CD pipelines to deploy and manage services at scale. I have experience with Kubernetes, GCP, Railway, and migrating between CI/CD providers.",
    },
    {
      title: "Data Engineering",
      description:
        "I build realtime data pipelines using tools like Apache Kafka to process and route information where it needs to go. I've worked on inventory allocation streams that reduced data delay significantly.",
    },
    {
      title: "Database Design",
      description:
        "I design and optimize database schemas across cloud and on-prem storage. I focus on reducing query execution times and eliminating deadlocks without introducing unnecessary complexity.",
    },
  ];

  return (
    <Section>
      <SectionTitle>What I Do</SectionTitle>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <div
            key={service.title}
            className="space-y-4 bg-white/50 backdrop-blur-[2px] p-6 rounded-lg border border-white/30"
            style={{
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.05)",
            }}
          >
            <h3 className="text-xl font-medium text-gray-800">
              {service.title}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
