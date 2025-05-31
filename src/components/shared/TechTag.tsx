import { getTechColor, getTechUrl } from "./techColors";

export const TechTag = ({ technology }: { technology: string }) => {
  const url = getTechUrl(technology);
  const className = `px-2 py-1 text-xs rounded-full transition-opacity duration-200 ${getTechColor(
    technology
  )}`;

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${className} hover:opacity-80 cursor-pointer`}
      >
        {technology}
      </a>
    );
  }

  return <span className={className}>{technology}</span>;
};
