import { motion, AnimatePresence } from "framer-motion";
import Card from "./Card";
import Button from "./Button";

interface ProjectCardProps {
  isVisible: boolean;
}

export default function ProjectCard({ isVisible }: ProjectCardProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-[280px]"
        >
          <Card className="bg-zinc-900/90 backdrop-blur-md text-white border-zinc-800 shadow-lg overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-green-600 -mt-6 mb-3"></div>

            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center mr-3">
                <svg
                  className="w-4 h-4 text-emerald-300"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white text-sm font-medium">Now Playing</h3>
                <p className="text-zinc-400 text-xs">A Plex Dashboard</p>
              </div>
            </div>

            <p className="text-zinc-300 mb-4 text-sm">
              Come check out what I&apos;m watching or listening to right now!
            </p>

            <Button
              variant="secondary"
              size="sm"
              className="w-full text-sm"
              onClick={() =>
                window.open("http://nowplaying.calebvanlue.com", "_blank")
              }
            >
              View Project
            </Button>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
