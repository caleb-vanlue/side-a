export default function Hero() {
  const yearsExperience =
    new Date().getFullYear() - new Date("2022-05-09").getFullYear();

  return (
    <div className="text-center mb-12">
      <div className="mb-8">
        <img
          src="/images/avatar.jpeg"
          alt="Caleb Van Lue"
          className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover mx-auto border-4 border-emerald-100 shadow-lg hover:shadow-xl transition-shadow duration-300"
        />
      </div>

      <h1 className="text-4xl sm:text-5xl font-light text-gray-900 mb-4">
        Caleb Van Lue
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Software Engineer at{" "}
        <a
          href="https://theferg.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-600 hover:text-emerald-700 transition-colors duration-200 underline decoration-emerald-600/30 hover:decoration-emerald-700/50"
        >
          Ferguson
        </a>{" "}
        with {yearsExperience} years of experience building web services,
        databases, and user interfaces. Based in Fort Wayne, Indiana.
      </p>
    </div>
  );
}
