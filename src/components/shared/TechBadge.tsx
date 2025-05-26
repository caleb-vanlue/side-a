import { IconType } from "react-icons";

export const TechBadge = ({
  name,
  icon: Icon,
  url,
}: {
  name: string;
  icon: IconType;
  url: string;
}) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 bg-zinc-800 text-zinc-200 px-3 py-2 rounded-lg hover:bg-zinc-700 transition-colors duration-200 cursor-pointer"
    >
      <span className="inline-flex items-center justify-center w-8 h-8 text-lg">
        <Icon className="w-5 h-5" />
      </span>
      <span className="text-sm font-medium">{name}</span>
    </a>
  );
};
