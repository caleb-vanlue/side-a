import { IconType } from "react-icons";
import { getTechColor } from "./techColors";

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
      className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:opacity-80 transition-opacity duration-200 cursor-pointer ${getTechColor(
        name
      )}`}
    >
      <span className="inline-flex items-center justify-center w-5 h-5">
        <Icon className="w-4 h-4" />
      </span>
      <span className="text-sm font-medium">{name}</span>
    </a>
  );
};
