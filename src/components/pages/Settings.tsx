import React, { useEffect } from "react";
import { useGame } from "../../context/GameContext";

export const Settings: React.FC = () => {
  const { setPage, setAnimationState } = useGame();

  useEffect(() => {
    setAnimationState('sleeping');
    return () => setAnimationState('idle');
  }, [setAnimationState]);

  const handleResetGame = () => {
    localStorage.removeItem("duckLifeGameState");
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center text-white space-y-4">
      <h2 className="text-4xl font-bold mb-4">Settings</h2>

      {/* Reset Game Button */}
      <button
        onClick={handleResetGame}
        className="px-6 py-3 bg-red-500 rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
      >
        Reset Game
      </button>

      {/* Back to Main Menu Button */}
      <button
        onClick={() => setPage("main-menu")}
        className="px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Back to Main Menu
      </button>
    </div>
  );
};
