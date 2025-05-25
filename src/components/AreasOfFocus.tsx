import { Section, SectionTitle } from "./shared";

export default function AreasOfFocus() {
  const focusAreas = [
    {
      icon: "⚡",
      title: "Backend Systems",
      description:
        "My strongest area - building reliable, scalable web services",
    },
    {
      icon: "🎯",
      title: "Frontend Growth",
      description:
        "Actively expanding skills in modern frontend development (with this website!)",
    },
    {
      icon: "🔧",
      title: "DevOps Learning",
      description: "Growing knowledge in deployment and infrastructure",
    },
  ];

  return (
    <Section>
      <SectionTitle>Areas of Focus</SectionTitle>
      <div className="grid sm:grid-cols-3 gap-6">
        {focusAreas.map((area) => (
          <div
            key={area.title}
            className="text-center p-6 bg-gray-50 rounded-lg"
          >
            <div className="text-3xl mb-3">{area.icon}</div>
            <h3 className="font-medium text-gray-800 mb-2">{area.title}</h3>
            <p className="text-sm text-gray-600">{area.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
