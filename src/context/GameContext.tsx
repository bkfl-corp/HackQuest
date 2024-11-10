import { createContext, useContext } from "react";

export type GamePage =
  | "main-menu"
  | "training"
  | "compete"
  | "shop"
  | "settings";

export interface PlayerAttributes {
  hacking: number;
  mana: number;
  bread: number; // Bread added as a player attribute
}

export interface GameState {
  page: GamePage;
  attributes: PlayerAttributes;
  customization: string;
  setPage: (page: GamePage) => void;
  updateAttributes: (stat: keyof PlayerAttributes, amount: number) => void;
  setCustomization: (custom: string) => void;
}

// Create the context
export const GameContext = createContext<GameState | undefined>(undefined);

// Create a hook to use the context
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};

import React, { ReactNode, useEffect, useState } from "react";

// Default state updated to include bread within attributes
const defaultState: Omit<
  GameState,
  "setPage" | "updateAttributes" | "setCustomization"
> = {
  page: "main-menu",
  attributes: { hacking: 0, mana: 0, bread: 0 }, // Initial bread balance in attributes
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

  const setCustomization = (custom: string) =>
    setGameState((prev) => ({ ...prev, customization: custom }));

  return (
    <GameContext.Provider
      value={{
        ...gameState,
        setPage,
        updateAttributes,
        setCustomization,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
