import { Button } from "./ui";

export default function ContactSection() {
  return (
    <section className="text-center">
      <h2 className="text-2xl font-light text-gray-900 mb-4">
        Let&apos;s Build Something Cool
      </h2>
      <p className="text-gray-600 mb-6">
        Have an interesting project idea or want to collaborate on something
        fun?
      </p>
      <a href="mailto:vanluecaleb@outlook.com">
        <Button
          variant="primary"
          size="lg"
          className="inline-flex items-center gap-2"
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
    </section>
  );
}
