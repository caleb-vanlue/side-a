interface ToneArmProps {
  rotation?: number;
}

export default function ToneArm({ rotation = 0 }: ToneArmProps) {
  return (
    <div className="relative w-full h-full overflow-visible">
      <svg
        viewBox="0 0 100 300"
        className="w-full h-full overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        <circle
          cx="50"
          cy="20"
          r="12"
          fill="#2a2a2a"
          stroke="#1a1a1a"
          strokeWidth="1"
        />
        <circle cx="50" cy="20" r="8" fill="#3a3a3a" />
        <circle cx="50" cy="20" r="4" fill="#1a1a1a" />
        <g
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: "50px 20px",
          }}
        >
          <rect x="47" y="20" width="6" height="180" fill="#3a3a3a" rx="3" />
          <circle
            cx="50"
            cy="200"
            r="8"
            fill="#2a2a2a"
            stroke="#1a1a1a"
            strokeWidth="1"
          />
          <rect x="48" y="200" width="4" height="60" fill="#3a3a3a" rx="2" />

          <g className="cursor-grab active:cursor-grabbing">
            <path
              d="M 45 260 L 45 270 L 50 275 L 55 270 L 55 260 Z"
              fill="#2a2a2a"
              stroke="#1a1a1a"
              strokeWidth="1"
            />
            <rect x="49" y="270" width="2" height="10" fill="#1a1a1a" />
            <path d="M 49 280 L 50 285 L 51 280 Z" fill="#888" />
          </g>
          <rect x="45" y="5" width="10" height="15" fill="#4a4a4a" rx="5" />
          <rect
            x="49"
            y="20"
            width="1"
            height="180"
            fill="rgba(255,255,255,0.1)"
            rx="0.5"
          />
        </g>
      </svg>
    </div>
  );
}
