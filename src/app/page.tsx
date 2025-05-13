import VinylRecord from "../components/VinylRecord";
import GitHubBadge from "../components/GitHubBadge";

export default function Home() {
  const backgroundColor = "white";

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center p-4 relative`}
      style={{ backgroundColor }}
    >
      <VinylRecord backgroundColor={backgroundColor} />
      <GitHubBadge repoUrl="https://github.com/caleb-vanlue/portfolio" />
    </main>
  );
}
