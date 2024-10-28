import React, { ReactNode, useEffect, useState } from "react";
import {
  GameContext,
  GameState,
  PlayerAttributes,
  GamePage,
} from "./GameContext";

const defaultState: Omit<
  GameState,
  "setPage" | "updateAttributes" | "addCoins" | "setCustomization"
> = {
  page: "main-menu",
  coins: 0,
  attributes: { strength: 0, speed: 0, endurance: 0 },
  customization: "default",
};

const loadGameState = (): typeof defaultState => {
  const savedState = localStorage.getItem("duckLifeGameState");
  return savedState ? JSON.parse(savedState) : defaultState;
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [gameState, setGameState] = useState(loadGameState);

  useEffect(() => {
    localStorage.setItem("duckLifeGameState", JSON.stringify(gameState));
  }, [gameState]);

  const setPage = (page: GamePage) =>
    setGameState((prev) => ({ ...prev, page }));
  const updateAttributes = (stat: keyof PlayerAttributes, amount: number) =>
    setGameState((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [stat]: prev.attributes[stat] + amount,
      },
    }));
  const addCoins = (amount: number) =>
    setGameState((prev) => ({ ...prev, coins: prev.coins + amount }));
  const setCustomization = (custom: string) =>
    setGameState((prev) => ({ ...prev, customization: custom }));

  return (
    <GameContext.Provider
      value={{
        ...gameState,
        setPage,
        updateAttributes,
        addCoins,
        setCustomization,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
