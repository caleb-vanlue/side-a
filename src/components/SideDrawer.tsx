import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideDrawer({ isOpen, onClose }: SideDrawerProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-500 ease-in-out z-40 ${
          isOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`fixed top-0 left-0 h-full w-64 sm:w-80 bg-zinc-900 z-50 transform transition-transform duration-500 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          boxShadow: "0 4px 30px rgba(0,0,0,0.3)",
        }}
      >
        <div className="flex flex-col h-full font-sans justify-between">
          <div>
            <div className="flex justify-center pt-6">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-500 shadow-lg">
                <Image
                  src="/images/avatar.jpeg"
                  alt="Profile Avatar"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="pt-4 pb-4 px-6 text-center">
              <h2 className="text-3xl font-light text-white mb-2">
                Nice to meet you!
              </h2>
              <p className="text-zinc-400 text-base max-w-xs mx-auto">
                Software Engineer & Music Enthusiast
              </p>
            </div>
          </div>

          <nav className="py-2">
            <div className="space-y-8">
              <Link
                href="/"
                onClick={onClose}
                className="block text-center text-xl text-white hover:text-emerald-400 transition-colors duration-300"
              >
                Home
              </Link>

              <Link
                href="/collection"
                onClick={onClose}
                className="block text-center text-xl text-white hover:text-emerald-400 transition-colors duration-300"
              >
                My Records
              </Link>

              <a
                href="https://www.linkedin.com/in/calebvanlue/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-xl text-white hover:text-emerald-400 transition-colors duration-300"
              >
                LinkedIn
              </a>

              <a
                href="https://github.com/caleb-vanlue"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-xl text-white hover:text-emerald-400 transition-colors duration-300"
              >
                GitHub
              </a>

              <a
                href="mailto:vanluecaleb@outlook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-xl text-white hover:text-emerald-400 transition-colors duration-300"
              >
                Email
              </a>
            </div>
          </nav>

          <div className="pb-6 pt-4">
            <div className="border-t border-zinc-800 pt-4">
              <div className="flex flex-col items-center">
                <p className="text-sm text-zinc-500">
                  © {new Date().getFullYear()} Caleb Van Lue
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
