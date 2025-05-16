interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function HamburgerButton({
  isOpen,
  onClick,
}: HamburgerButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed top-6 left-6 z-50 w-12 h-12 flex flex-col justify-center items-center bg-zinc-900 bg-opacity-90 rounded-full shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      style={{
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div
        className={`w-5 h-0.5 bg-zinc-200 transition-all duration-300 ${
          isOpen ? "rotate-45 translate-y-1.5" : ""
        }`}
      />
      <div
        className={`w-5 h-0.5 bg-zinc-200 my-1.5 transition-all duration-300 ${
          isOpen ? "opacity-0 transform scale-0" : "opacity-100 scale-100"
        }`}
      />
      <div
        className={`w-5 h-0.5 bg-zinc-200 transition-all duration-300 ${
          isOpen ? "-rotate-45 -translate-y-1.5" : ""
        }`}
      />
    </button>
  );
}
