export default function VinylLabel() {
  const getCurrentYear = () => {
    return Math.floor(
      (new Date().getTime() - new Date("2000-09-05").getTime()) /
        (365.25 * 24 * 60 * 60 * 1000)
    );
  };

  return (
    <>
      {/* Green label background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35%] h-[35%] rounded-full pointer-events-none overflow-hidden">
        <div
          className="w-full h-full"
          style={{
            background: `
              radial-gradient(circle at 30% 30%, #1a4027 0%, #275c3a 50%, #347a4d 100%),
              radial-gradient(circle at 70% 70%, #234f33 0%, #2d6942 100%)
            `,
            boxShadow: "inset 0 0 10px rgba(0,0,0,0.2)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 5px,
                rgba(0,0,0,0.02) 5px,
                rgba(0,0,0,0.02) 6px
              ),
              repeating-linear-gradient(
                -45deg,
                transparent,
                transparent 5px,
                rgba(0,0,0,0.02) 5px,
                rgba(0,0,0,0.02) 6px
              )
            `,
          }}
        />
      </div>

      {/* Label text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35%] h-[35%] pointer-events-none">
        <div className="absolute top-[22%] left-1/2 -translate-x-1/2 text-white/90 text-[0.5rem] sm:text-xs font-medium tracking-widest">
          CALEB VAN LUE
        </div>

        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 text-white text-base sm:text-xl md:text-2xl font-bold tracking-wider">
          SIDE A
        </div>

        <div className="absolute top-[58%] left-1/2 -translate-x-1/2 text-white/80 text-[0.5rem] sm:text-xs">
          33⅓ RPM
        </div>

        <div className="absolute bottom-[28%] left-1/2 -translate-x-1/2 text-white/70 text-[0.4rem] sm:text-xs font-mono">
          CV-2000-0{getCurrentYear()}
        </div>

        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <defs>
            <path id="bottom-arc" d="M 15,50 A 35,35 0 0,0 85,50" />
          </defs>
          <text
            className="fill-white/60"
            style={{ fontSize: "2.5px", letterSpacing: "0.6px" }}
          >
            <textPath href="#bottom-arc" startOffset="50%" textAnchor="middle">
              STEREO • MADE IN USA • ALL RIGHTS RESERVED
            </textPath>
          </text>
        </svg>
      </div>
    </>
  );
}
