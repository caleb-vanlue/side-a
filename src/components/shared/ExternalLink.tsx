export const ExternalLink = ({
  href,
  ariaLabel,
  children,
}: {
  href: string;
  ariaLabel: string;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-gray-600 transition-colors"
    aria-label={ariaLabel}
  >
    {children}
  </a>
);
