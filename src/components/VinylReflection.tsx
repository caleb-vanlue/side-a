export default function VinylReflection() {
  return (
    <div
      className="absolute inset-0 rounded-full pointer-events-none"
      style={{
        background: `
          conic-gradient(
            from 90deg at 50% 50%,
            transparent 0deg,
            rgba(255,255,255,0.05) 45deg,
            rgba(255,255,255,0.1) 90deg,
            rgba(255,255,255,0.05) 135deg,
            transparent 180deg,
            transparent 360deg
          ),
          radial-gradient(
            circle at 30% 30%,
            rgba(255,255,255,0.06) 0%,
            transparent 50%
          )
        `,
      }}
    />
  );
}
