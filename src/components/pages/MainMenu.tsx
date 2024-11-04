import React, { useState, useEffect, useRef } from "react";
import { useGame } from "../../context/GameContext";

export const MainMenu: React.FC = () => {
  const { setPage, attributes } = useGame();
  const [duckPosition, setDuckPosition] = useState({ x: 45 }); // Track only horizontal position
  const [duckDirection, setDuckDirection] = useState("right");
  const duckRef = useRef<HTMLDivElement>(null);

  // Update duck's direction based on mouse position
  const handleMouseMove = (e: MouseEvent) => {
    if (!duckRef.current) return;

    const duckRect = duckRef.current.getBoundingClientRect();
    const centerX = duckRect.left + duckRect.width / 2;
    setDuckDirection(e.clientX > centerX ? "right" : "left"); // Fix facing direction
  };

  // Move duck horizontally in the direction it is facing
  const handleContainerClick = () => {
    setDuckPosition((prev) => {
      const moveAmount = 10;
      const newX =
        prev.x + (duckDirection === "right" ? moveAmount : -moveAmount);
      return { x: Math.max(0, Math.min(newX, 100)) }; // Clamp within 0-100%
    });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="text-center p-6">
      <h2 className="text-3xl font-bold mb-6">Main Menu</h2>

      {/* Menu Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-8 max-w-sm mx-auto">
        <button
          onClick={() => setPage("training")}
          className="py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          🏋️‍♂️ Training
        </button>
        <button
          onClick={() => setPage("compete")}
          className="py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          🏆 Compete
        </button>
        <button
          onClick={() => setPage("shop")}
          className="py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          🛍️ Shop
        </button>
        <button
          onClick={() => setPage("settings")}
          className="py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          ⚙️ Settings
        </button>
      </div>

      {/* Stats Display */}
      <div className="flex justify-center space-x-6 text-lg mt-8">
        <div>🍞 {attributes.bread} Bread</div>
        <div>💪 {attributes.strength} Strength</div>
        <div>⚡ {attributes.speed} Speed</div>
        <div>🏃‍♂️ {attributes.endurance} Endurance</div>
      </div>

      {/* Duck Container */}
      <div
        className="relative w-full h-20 mt-6 bg-gray-700"
        onClick={handleContainerClick}
      >
        {/* Duck Emoji */}
        <div
          ref={duckRef}
          style={{
            position: "absolute",
            bottom: "10px",
            left: `${duckPosition.x}%`,
            transform: duckDirection === "left" ? "scaleX(1)" : "scaleX(-1)", // Fix facing direction
            fontSize: "2rem",
            transition: "left 0.2s ease, transform 0.2s ease",
            cursor: "default",
          }}
        >
          🦆
        </div>
      </div>
    </div>
  );
};
