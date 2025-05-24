export const Section = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <section className={`mb-16 ${className}`}>{children}</section>;
