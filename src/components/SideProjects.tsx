import { Section } from "./shared/Section";
import { SectionTitle } from "./shared/SectionTitle";

export default function SideProjects() {
  return (
    <Section>
      <SectionTitle>Side Projects and Collaboration</SectionTitle>
      <div
        className="bg-white/50 backdrop-blur-[2px] p-6 rounded-lg border border-white/30"
        style={{
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.05)",
        }}
      >
        <p className="text-gray-700 leading-relaxed mb-4">
          I&apos;m always interested in collaborating on interesting side or
          hobby projects. Whether it&apos;s exploring new technologies, building
          something fun, or contributing to open source projects, I enjoy
          working with other developers who share a passion for creating cool
          things.
        </p>
        <p className="text-gray-700 leading-relaxed">
          I believe in writing clean, maintainable code and building systems
          that solve real problems. If you have an interesting project idea or
          want to collaborate on something, I&apos;d love to hear about it.
        </p>
      </div>
    </Section>
  );
}
