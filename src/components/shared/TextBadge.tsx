export const TechBadge = ({
  name,
  icon,
  url,
}: {
  name: string;
  icon: string;
  url: string;
}) => {
  const iconMap: { [key: string]: string } = {
    nextjs: "⚡",
    nestjs: "🚀",
    typescript: "📘",
    postgresql: "🐘",
    gcp: "☁️",
    github: "🐙",
    railway: "🚂",
    docker: "🐳",
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 bg-zinc-800 text-zinc-200 px-3 py-2 rounded-lg hover:bg-zinc-700 transition-colors duration-200 cursor-pointer"
    >
      <span className="inline-flex items-center justify-center w-8 h-8 text-lg">
        {iconMap[icon] || "⚙️"}
      </span>
      <span className="text-sm font-medium">{name}</span>
    </a>
  );
};
