import React, { useState, useEffect, useRef } from "react";
import { useGame } from "../../context/GameContext";
import { Player } from "../Player";
import backgroundImage from "../../assets/images/bkgrnd1.png" 

export const MainMenu: React.FC = () => {
  const { setPage, attributes, setAnimationState } = useGame();
  const [duckPosition, setDuckPosition] = useState({ x: 45 }); // Track only horizontal position
  const [duckDirection, setDuckDirection] = useState("right");
  const duckRef = useRef<HTMLDivElement>(null);
  const backgroundImageUrl = backgroundImage;

  // Update duck's direction based on mouse position
  const handleMouseMove = (e: MouseEvent) => {
    if (!duckRef.current) return;

    const duckRect = duckRef.current.getBoundingClientRect();
    const centerX = duckRect.left + duckRect.width / 2;
    setDuckDirection(e.clientX > centerX ? "right" : "left"); // Fix facing direction
  };

  // Move duck horizontally in the direction it is facing
  const handleContainerClick = () => {
    setAnimationState('walking');
    setDuckPosition((prev) => {
      const moveAmount = 10;
      const newX =
        prev.x + (duckDirection === "right" ? moveAmount : -moveAmount);
      return { x: Math.max(0, Math.min(newX, 100)) }; // Clamp within 0-100%
    });
    setTimeout(() => setAnimationState('idle'), 500); // Reset after movement
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
  // Added background here as a css div container
  <div
      className="rounded-lg overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat', 
        width: '100%', 
      }}
    >
    <div className="text-center p-6">
      <h2 className="text-3xl font-bold mb-6 text-dark-blue">Main Menu</h2>

      {/* Menu Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-8 max-w-sm mx-auto">
        <button
          onClick={() => setPage("training")}
          className="py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          🏋️ Training
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
          ⚙️  Settings
        </button>
      </div>

      {/* Stats Display */}
      <div className="flex justify-center space-x-6 text-lg mt-8 text-dark-blue">
        <div>🍞 {attributes.bread} Bread</div>
        <div>👾 {attributes.hacking} Hacking</div>
        <div>⚡️ {attributes.mana} Mana</div>
      </div>

      {/* Dragon Container */}
      <div
        className="relative w-full h-20 mt-6 bg-gray-800 bg-opacity-50 p-16 rounded-lg"
        onClick={handleContainerClick}
      >
        {/* Dragon Emoji */}
        <div
          ref={duckRef}
          style={{
            position: "absolute",
            bottom: "10px",
            left: `${duckPosition.x}%`,
            transform: duckDirection === "left" ? "none" : "scaleX(-1)", // horizontal flip without scaling
            fontSize: "2rem",
            transition: "left 0.2s ease, transform 0.2s ease",
            cursor: "default",
          }}
        >
          <Player />
        </div>
      </div>
    </div>
  </div>
  );
};
