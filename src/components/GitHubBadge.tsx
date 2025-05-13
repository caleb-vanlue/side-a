import Image from "next/image";

interface GitHubBadgeProps {
  repoUrl: string;
}

export default function GitHubBadge({ repoUrl }: GitHubBadgeProps) {
  return (
    <a
      href={repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 hover:opacity-80 transition-opacity"
    >
      <Image
        src="/images/github-mark.svg"
        alt="GitHub"
        width={48}
        height={48}
        className="w-12 h-12"
      />
    </a>
  );
}
