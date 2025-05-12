import VinylRecord from "../components/VinylRecord";

export default function Home() {
  const backgroundColor = "white";

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center p-4 relative`}
      style={{ backgroundColor }}
    >
      <VinylRecord backgroundColor={backgroundColor} />

      {/* GitHub Badge */}
      <a
        href="https://github.com/caleb-vanlue/portfolio"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 hover:opacity-80 transition-opacity"
      >
        <img
          src="/images/github-mark.svg"
          alt="GitHub"
          width="48"
          height="48"
          className="w-12 h-12"
        />
      </a>
    </main>
  );
}
