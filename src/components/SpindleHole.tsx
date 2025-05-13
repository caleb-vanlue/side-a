interface SpindleHoleProps {
  backgroundColor: string;
}

export default function SpindleHole({ backgroundColor }: SpindleHoleProps) {
  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[3%] h-[3%] rounded-full pointer-events-none"
      style={{ backgroundColor }}
    />
  );
}
