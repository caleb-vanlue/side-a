import React from "react";

const VinylLabel = React.memo(() => {
  const currentYear = React.useMemo(() => {
    return Math.floor(
      (new Date().getTime() - new Date("2000-09-05").getTime()) /
        (365.25 * 24 * 60 * 60 * 1000)
    );
  }, []);

  return (
    <>
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35%] h-[35%] pointer-events-none">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        >
          <text
            x="50"
            y="25"
            textAnchor="middle"
            className="fill-white/90"
            style={{ fontSize: "4px", letterSpacing: "1px", fontWeight: "500" }}
          >
            CALEB VAN LUE
          </text>

          <text
            x="50"
            y="35"
            textAnchor="middle"
            className="fill-white"
            style={{ fontSize: "8px", letterSpacing: "1px", fontWeight: "700" }}
          >
            SIDE A
          </text>

          <text
            x="50"
            y="60"
            textAnchor="middle"
            className="fill-white/80"
            style={{ fontSize: "3.5px" }}
          >
            33⅓ RPM
          </text>

          <text
            x="50"
            y="75"
            textAnchor="middle"
            className="fill-white/70"
            style={{
              fontSize: "3px",
              letterSpacing: "0.5px",
            }}
          >
            CV-2000-0{currentYear}
          </text>

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
});

VinylLabel.displayName = "VinylLabel";

export default VinylLabel;
