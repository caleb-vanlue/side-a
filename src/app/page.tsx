import VinylRecord from "../components/VinylRecord";

export default function Home() {
  const backgroundColor = "white";

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center p-4`}
      style={{ backgroundColor }}
    >
      <VinylRecord backgroundColor={backgroundColor} />
    </main>
  );
}
