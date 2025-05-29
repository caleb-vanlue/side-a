// Update components/WhatIDo.tsx
import { Section } from "./shared/Section";
import { SectionTitle } from "./shared/SectionTitle";
import { ContentSection } from "./shared/ContentSection";

export default function WhatIDo() {
  const services = [
    {
      title: "Backend Development",
      description:
        "I work on building web services and APIs. I enjoy tackling the behind-the-scenes work that makes applications function well and handle the day-to-day demands of users.",
    },
    {
      title: "Database Design",
      description:
        "I design database systems and work with data pipelines. My approach focuses on keeping things organized and making sure data flows where it needs to go without unnecessary complexity.",
    },
  ];

  return (
    <Section>
      <SectionTitle>What I Do</SectionTitle>
      <div className="grid md:grid-cols-2 gap-8">
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
