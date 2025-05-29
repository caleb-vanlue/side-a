import { ContentSection } from "./shared";
import { Button } from "./ui";

export default function ContactSection() {
  return (
    <ContentSection className="text-center bg-white/50">
      <h2
        className="text-2xl font-light text-gray-900 mb-4"
        style={{
          textShadow: "0 1px 2px rgba(255, 255, 255, 0.8)",
        }}
      >
        Let&apos;s Build Something Cool
      </h2>
      <p className="text-gray-700 mb-6">
        Have an interesting project idea or want to collaborate on something
        fun?
      </p>
      <a href="mailto:vanluecaleb@outlook.com">
        <Button
          variant="primary"
          size="lg"
          className="inline-flex items-center gap-2 shadow-lg"
        >
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
              d="M3 8l7.89 4.542a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          Let&apos;s Chat
        </Button>
      </a>
    </ContentSection>
  );
}
