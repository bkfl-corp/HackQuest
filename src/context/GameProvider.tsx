import React, { ReactNode, useEffect, useState, useCallback } from "react";
import {
  GameContext,
  GameState,
  PlayerAttributes,
  PlayerAccessories,
  GamePage,
  AnimationState,
} from "./GameContext";

const defaultState: Omit<
  GameState,
  "setPage" | "updateAttributes" | "setCustomization" | "buyAccessory" | "setAnimationState"
> = {
  page: "main-menu",
  attributes: { hacking: 0, mana: 0, bread: 0 },
  accessories: { hasHat: false, hasFamiliar: false, hasWand: false },
  customization: "default",
  animationState: "idle",
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
    accessories: {
      hasFamiliar: parsedState.accessories?.hasFamiliar || false,
      hasHat: parsedState.accessories?.hasHat || false,
      hasWand: parsedState.accessories?.hasWand || false,
    },
    customization: parsedState.customization || "default",
    animationState: parsedState.animationState || "idle",
  };
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [gameState, setGameState] = useState(loadGameState);

  useEffect(() => {
    localStorage.setItem("duckLifeGameState", JSON.stringify(gameState));
  }, [gameState]);

  // Memoize setPage
  const setPage = useCallback((page: GamePage) => {
    setGameState((prev) => ({ ...prev, page }));
  }, []);

  // Memoize updateAttributes
  const updateAttributes = useCallback(
    (stat: keyof PlayerAttributes, amount: number) => {
      if (isNaN(amount)) return;
      setGameState((prev) => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          [stat]: (prev.attributes[stat] || 0) + amount,
        },
      }));
    },
    []
  );

  // Memoize buyAccessory
  const buyAccessory = useCallback(
    (stat: keyof PlayerAccessories) =>
      setGameState((prev) => ({
        ...prev,
        accessories: {
          ...prev.accessories,
          [stat]: true,
        },
      })),
    []
  );

  // Memoize setCustomization
  const setCustomization = useCallback((custom: string) => {
    setGameState((prev) => ({ ...prev, customization: custom }));
  }, []);

  // Memoize setAnimationState
  const setAnimationState = useCallback((state: AnimationState) => {
    setGameState((prev) => ({ ...prev, animationState: state }));
  }, []);

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
