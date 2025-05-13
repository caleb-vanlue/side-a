import VinylRecord from "../components/VinylRecord";
import GitHubBadge from "../components/GitHubBadge";
import ToneArm from "../components/ToneArm";

export default function Home() {
  const backgroundColor = "white";

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center p-4 relative overflow-x-hidden`}
      style={{ backgroundColor }}
    >
      <div className="flex items-center justify-center sm:gap-4 md:gap-8 relative -left-16 sm:left-0">
        <div className="w-[100vmin] h-[100vmin] sm:w-[70vmin] sm:h-[70vmin] md:w-[80vmin] md:h-[80vmin]">
          <VinylRecord backgroundColor={backgroundColor} />
        </div>
        <div className="w-8 sm:hidden"></div>
        <div className="w-36 sm:w-28 md:w-[25vmin] h-[100vmin] sm:h-[70vmin] md:h-[80vmin] flex items-center">
          <ToneArm />
        </div>
        <div className="w-4 sm:hidden"></div>
      </div>

      <GitHubBadge repoUrl="https://github.com/caleb-vanlue/portfolio" />
    </main>
  );
}
