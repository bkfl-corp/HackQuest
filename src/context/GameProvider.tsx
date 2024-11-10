import React, { ReactNode, useEffect, useState } from "react";
import {
  GameContext,
  GameState,
  PlayerAttributes,
  GamePage,
} from "./GameContext";

const defaultState: Omit<
  GameState,
  "setPage" | "updateAttributes" | "setCustomization"
> = {
  page: "main-menu",
  attributes: { hacking: 0, mana: 0, bread: 0 },
  customization: "default",
};

const loadGameState = (): typeof defaultState => {
  const savedState = localStorage.getItem("duckLifeGameState");
  const parsedState = savedState ? JSON.parse(savedState) : defaultState;

  return {
    page: parsedState.page || "main-menu",
    attributes: {
      hacking: parsedState.attributes?.hacking || 0,
      mana: parsedState.attributes?.mana || 0,
      bread: parsedState.attributes?.bread || 0,
    },
    customization: parsedState.customization || "default",
  };
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

  const updateAttributes = (stat: keyof PlayerAttributes, amount: number) => {
    if (isNaN(amount)) return;
    setGameState((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [stat]: (prev.attributes[stat] || 0) + amount,
      },
    }));
  };

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
