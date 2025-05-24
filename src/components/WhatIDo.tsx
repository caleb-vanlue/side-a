import { Section } from "./shared/Section";
import { SectionTitle } from "./shared/SectionTitle";

export default function WhatIDo() {
  const services = [
    {
      title: "Backend Development",
      description:
        "I specialize in building robust web services and APIs. My work focuses on creating scalable backend systems that handle real-world business requirements efficiently.",
    },
    {
      title: "Database Design",
      description:
        "I design and implement database architectures and data pipelines that ensure efficient data flow and storage. Performance and reliability are always top priorities.",
    },
  ];

  return (
    <Section>
      <SectionTitle>What I Do</SectionTitle>
      <div className="grid md:grid-cols-2 gap-8">
        {services.map((service) => (
          <div key={service.title} className="space-y-4">
            <h3 className="text-xl font-medium text-gray-800">
              {service.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
