import { useEffect } from "react";

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
        <div className="flex flex-col h-full font-sans">
          <div className="pt-20 pb-8 px-6 text-center">
            <h2 className="text-4xl font-light text-white mb-3">
              Nice to meet you!
            </h2>
            <p className="text-zinc-400 text-lg max-w-xs mx-auto">
              Software Engineer & Music Enthusiast
            </p>
          </div>

          <div className="flex-grow flex flex-col justify-center">
            <nav className="py-8 space-y-16">
              <a
                href="https://www.linkedin.com/in/calebvanlue/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-2xl text-white hover:text-emerald-400 transition-colors duration-300"
              >
                LinkedIn
              </a>

              <a
                href="https://github.com/caleb-vanlue"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-2xl text-white hover:text-emerald-400 transition-colors duration-300"
              >
                GitHub
              </a>

              <a
                href="https://www.discogs.com/user/Irrelativity/collection"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-2xl text-white hover:text-emerald-400 transition-colors duration-300"
              >
                Discogs
              </a>

              <a
                href="mailto:vanluecaleb@outlook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-2xl text-white hover:text-emerald-400 transition-colors duration-300"
              >
                Email
              </a>
            </nav>
          </div>

          <div className="mt-auto">
            <div className="border-t border-zinc-800 pt-6 pb-8">
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
