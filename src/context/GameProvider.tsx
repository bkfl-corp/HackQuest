import React, { ReactNode, useEffect, useState } from "react";
import {
  GameContext,
  GameState,
  PlayerAttributes,
	PlayerAcessories,
  GamePage,
  AnimationState,
} from "./GameContext";

const defaultState: Omit<
  GameState,
  "setPage" | "updateAttributes" | "setCustomization" | "buyAcessory"
> = {
  page: "main-menu",
  attributes: { hacking: 0, mana: 0, bread: 0 },
  customization: "default",
		acessories: {hasHat: false, hasFamiliar: false, hasWand: false}
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
acessories: {
      hasFamiliar: parsedState.acessories?.hasFamiliar || false,
      hasHat: parsedState.acessories?.hasHat || false,
      hasWand: parsedState.acessories?.hasWand || false,
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
const buyAcessory = (stat: keyof PlayerAcessories) =>
    setGameState((prev) => ({
      ...prev,
      acessories: {
        ...prev.acessories,
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
				buyAcessory,
        setAnimationState,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
