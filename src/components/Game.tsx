import React from "react";
import { GameProvider } from "../context/GameProvider";
import { useGame } from "../context/GameContext";
import { MainMenu } from "./pages/MainMenu";
import { Training } from "./pages/Training";
import { Shop } from "./pages/Shop";
import { Settings } from "./pages/Settings";
import { Compete } from "./pages/Compete";

const GameContent: React.FC = () => {
  const { page } = useGame();

  switch (page) {
    case "main-menu":
      return <MainMenu />;
    case "training":
      return <Training />;
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
    <div className="game-container">
      <h1 className="game-title">HackQuest</h1>
      <GameContent />
    </div>
  </GameProvider>
);
