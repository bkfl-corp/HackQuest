import { createContext, useContext } from "react";

export type GamePage =
  | "main-menu"
  | "training"
  | "compete"
  | "shop"
  | "settings";

export interface PlayerAttributes {
  strength: number;
  speed: number;
  endurance: number;
}

export interface GameState {
  page: GamePage;
  coins: number;
  attributes: PlayerAttributes;
  customization: string;
  setPage: (page: GamePage) => void;
  updateAttributes: (stat: keyof PlayerAttributes, amount: number) => void;
  addCoins: (amount: number) => void;
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
