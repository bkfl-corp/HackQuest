import React, { useState, useEffect } from "react";
import { useGame } from "../../context/GameContext";

// Helper function to play sound effects
const playSound = (url: string, isSoundEnabled: boolean) => {
  if (isSoundEnabled) {
    const audio = new Audio(url);
    audio.play();
  }
};

export const Settings: React.FC = () => {
  const { setCustomization, setPage } = useGame();
  const [isSoundEnabled, setIsSoundEnabled] = useState(true); // Sound toggle state

  // Save and load sound settings from localStorage
  useEffect(() => {
    const savedSetting = localStorage.getItem("soundEnabled");
    setIsSoundEnabled(savedSetting === "true");
  }, []);

  const toggleSound = () => {
    const newState = !isSoundEnabled;
    setIsSoundEnabled(newState);
    localStorage.setItem("soundEnabled", String(newState)); // Persist setting
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>

      {/* Sound Toggle */}
      <div className="toggle-container">
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={isSoundEnabled}
            onChange={toggleSound}
          />
          Enable Sound Effects
        </label>
      </div>

      {/* Customization Buttons */}
      <button
        onClick={() => {
          playSound("/sounds/click.mp3", isSoundEnabled);
          setCustomization("cool-duck");
        }}
      >
        Cool Duck
      </button>

      <button
        onClick={() => {
          playSound("/sounds/click.mp3", isSoundEnabled);
          setCustomization("default");
        }}
      >
        Default
      </button>

      {/* Back to Main Menu */}
      <button
        onClick={() => {
          playSound("/sounds/back.mp3", isSoundEnabled);
          setPage("main-menu");
        }}
      >
        Back to Main Menu
      </button>
    </div>
  );
};
