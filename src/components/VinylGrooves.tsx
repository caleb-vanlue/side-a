export default function VinylGrooves() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 200 200"
      style={{ pointerEvents: "none" }}
    >
      {Array.from({ length: 65 }, (_, i) => {
        const radius = 35 + i * 1;
        const strokeWidth = i % 3 === 0 ? 0.8 : 0.4;
        const opacity = i % 3 === 0 ? 0.7 : 0.4;

        return (
          <circle
            key={i}
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={i % 2 === 0 ? "#2a2a2a" : "#1a1a1a"}
            strokeWidth={strokeWidth}
            opacity={opacity}
          />
        );
      })}
    </svg>
  );
}
