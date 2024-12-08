import { createContext, useContext } from "react";

export type GamePage =
  | "main-menu"
  | "training"
  | "compete"
  | "shop"
  | "settings";

export type AnimationState = 'idle' | 'walking' | 'sleeping' | 'typing';

export interface PlayerAttributes {
  hacking: number;
  mana: number;
  bread: number; // Bread added as a player attribute
}

export interface PlayerAccessories {
  hasHat: boolean;
  hasFamiliar: boolean;
  hasWand: boolean;
}

export interface GameState {
  page: GamePage;
  attributes: PlayerAttributes;
  accessories: PlayerAccessories;
  customization: string;
  animationState: AnimationState;
  setPage: (page: GamePage) => void;
  updateAttributes: (stat: keyof PlayerAttributes, amount: number) => void;
  buyAccessory: (stat: keyof PlayerAccessories) => void;
  setCustomization: (custom: string) => void;
  setAnimationState: (state: AnimationState) => void;
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
  "setPage" | "updateAttributes" | "setCustomization" | "buyAccessory" | "setAnimationState"
> = {
  page: "main-menu",
  attributes: { hacking: 0, mana: 0, bread: 0 }, // Initial bread balance in attributes
  accessories: {hasFamiliar: false, hasHat: false, hasWand: false},
  customization: "default",
  animationState: 'idle',
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

const buyAccessory = (stat: keyof PlayerAccessories) => 
    setGameState((prev) => ({
      ...prev,
      accessories: { 
        ...prev.accessories,
        [stat]: true,
      },
    }));


  const setCustomization = (custom: string) =>
    setGameState((prev) => ({ ...prev, customization: custom }));

  const setAnimationState = (state: AnimationState) =>
    setGameState((prev) => ({ ...prev, animationState: state }));

  return (
    <GameContext.Provider
      value={{
        ...gameState,
        setPage,
        updateAttributes,
        setCustomization,
        buyAccessory,
        setAnimationState,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
