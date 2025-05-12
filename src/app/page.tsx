"use client";

import { useState } from "react";

export default function Home() {
  const backgroundColor = "white";
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      console.log("Dragging at:", e.clientX, e.clientY);
    }
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center p-4`}
      style={{ backgroundColor }}
    >
      <div
        className={`relative w-[80vw] h-[80vw] max-w-[80vh] max-h-[80vh] rounded-full ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{
          background: `
               repeating-radial-gradient(
                 circle,
                 #6b7280 0px,
                 #6b7280 3px,
                 #9ca3af 3px,
                 #9ca3af 4px,
                 #6b7280 4px,
                 #6b7280 8px,
                 #9ca3af 8px,
                 #9ca3af 10px
               )
             `,
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-gray-600 rounded-full pointer-events-none" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2%] h-[2%] rounded-full pointer-events-none"
          style={{ backgroundColor }}
        />
      </div>
    </main>
  );
}
