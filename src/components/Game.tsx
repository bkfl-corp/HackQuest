import React from "react";
import { GameProvider } from "../context/GameProvider";
import { useGame } from "../context/GameContext";
import { MainMenu } from "./pages/MainMenu";
import { TypingGame } from "./pages/Training";
import { Shop } from "./pages/Shop";
import { Settings } from "./pages/Settings";
import { Compete } from "./pages/Compete";

const GameContent: React.FC = () => {
  const { page } = useGame();

  switch (page) {
    case "main-menu":
      return <MainMenu />;
    case "training":
      return <TypingGame />;
    case "compete":
      return <Compete />;
    case "shop":
      return <Shop />;
    case "settings":
      return <Settings />;
    default:
      return <MainMenu />;
  }
};

export const Game: React.FC = () => (
  <GameProvider>
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-lg h-[calc(100vw-4rem)] max-h-[75vh] bg-gray-800 rounded-lg p-4">
        <div className="bg-gray-900 rounded-md p-2 mb-4">
          <h1 className="text-center text-3xl font-bold text-white">
            HackQuest
          </h1>
        </div>
        <GameContent />
      </div>
    </div>
  </GameProvider>
);
