import Image from "next/image";
import { FaLinkedin, FaGithub, FaFileDownload, FaEnvelope } from "react-icons/fa";
import { Button } from "./ui";

export default function Hero() {
  const yearsExperience =
    new Date().getFullYear() - new Date("2022-05-09").getFullYear();

  return (
    <div className="text-center mb-12">
      <div className="mb-8 inline-block">
        <div className="relative p-1 rounded-full bg-gradient-to-r from-emerald-200/50 to-blue-200/50 backdrop-blur-sm">
          <Image
            src="/images/avatar.jpeg"
            alt="Caleb Van Lue"
            width={160}
            height={160}
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white/70 shadow-lg hover:shadow-xl transition-all duration-300"
          />
        </div>
      </div>

      <div className="flex justify-center items-center gap-4 mb-8">
        <a 
          href="/doc/Caleb Van Lue.pdf" 
          download
          className="inline-block"
        >
          <Button
            variant="primary"
            size="md"
            className="inline-flex items-center gap-2 shadow-lg"
          >
            <FaFileDownload className="w-4 h-4" />
            Resume
          </Button>
        </a>
        
        <a
          href="mailto:vanluecaleb@outlook.com"
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/60 backdrop-blur-[2px] border border-white/30 text-gray-700 hover:text-emerald-600 hover:bg-white/80 transition-all duration-200 shadow-lg"
          aria-label="Email Contact"
        >
          <FaEnvelope className="w-5 h-5" />
        </a>
        
        <a
          href="https://www.linkedin.com/in/calebvanlue/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/60 backdrop-blur-[2px] border border-white/30 text-gray-700 hover:text-emerald-600 hover:bg-white/80 transition-all duration-200 shadow-lg"
          aria-label="LinkedIn Profile"
        >
          <FaLinkedin className="w-5 h-5" />
        </a>
        
        <a
          href="https://github.com/caleb-vanlue"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/60 backdrop-blur-[2px] border border-white/30 text-gray-700 hover:text-emerald-600 hover:bg-white/80 transition-all duration-200 shadow-lg"
          aria-label="GitHub Profile"
        >
          <FaGithub className="w-5 h-5" />
        </a>
      </div>

      <div
        className="bg-white/50 backdrop-blur-[2px] p-6 rounded-lg inline-block border border-white/30"
        style={{
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1
          className="text-4xl sm:text-5xl font-light text-gray-900 mb-4"
          style={{
            textShadow: "0 1px 3px rgba(255, 255, 255, 0.8)",
          }}
        >
          Caleb Van Lue
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Software Engineer at{" "}
          <a
            href="https://theferg.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:text-emerald-700 transition-colors duration-200 underline decoration-emerald-600/30 hover:decoration-emerald-700/50 font-medium"
          >
            Ferguson
          </a>{" "}
          with {yearsExperience} years of experience building web services,
          databases, and user interfaces. Based in Fort Wayne, Indiana.
        </p>
      </div>
    </div>
  );
}