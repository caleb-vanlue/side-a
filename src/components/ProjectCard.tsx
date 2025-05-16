import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectCardProps {
  isVisible: boolean;
}

export default function ProjectCard({ isVisible }: ProjectCardProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed top-2 right-2 z-30 max-w-[240px] sm:top-6 sm:right-8 md:right-10"
        >
          <div
            className="w-full bg-zinc-900 bg-opacity-80 backdrop-blur-md rounded-lg overflow-hidden shadow-lg border border-zinc-800"
            style={{
              boxShadow:
                "0 10px 15px -5px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-green-600"></div>

            <div className="p-3">
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 rounded-full bg-emerald-800 flex items-center justify-center mr-2">
                  <svg
                    className="w-3 h-3 text-emerald-300"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white text-sm font-medium">
                    Now Playing
                  </h3>
                  <p className="text-zinc-400 text-xs">A Plex Dashboard</p>
                </div>
              </div>

              <p className="text-zinc-300 mb-2 text-xs">
                Come check out what I'm watching or listening to!
              </p>

              <div className="flex items-center justify-between">
                <a
                  href="http://nowplaying.calebvanlue.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-xs transition-colors duration-200"
                >
                  View Project
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
