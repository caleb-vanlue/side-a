import { Section } from "./shared/Section";
import { SectionTitle } from "./shared/SectionTitle";

export default function SideProjects() {
  return (
    <Section>
      <SectionTitle>Side Projects & Collaboration</SectionTitle>
      <div className="bg-gray-50 rounded-lg p-8">
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
