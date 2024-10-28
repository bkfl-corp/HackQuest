import React from "react";
import { useGame } from "../../context/GameContext";

export const MainMenu: React.FC = () => {
  const { setPage, coins, attributes, customization } = useGame();

  return (
    <div
      style={{
        textAlign: "center",
        padding: "30px",
      }}
    >
      <h2>Main Menu</h2>

      {/* Main buttons */}
      <div style={{ margin: "20px 0" }}>
        <button onClick={() => setPage("training")} style={menuButtonStyle}>
          🏋️‍♂️ Training
        </button>
        <button onClick={() => setPage("compete")}>🏆 Compete</button>
        <button onClick={() => setPage("shop")} style={menuButtonStyle}>
          🛍️ Shop
        </button>
        <button onClick={() => setPage("settings")} style={menuButtonStyle}>
          ⚙️ Settings
        </button>
      </div>

      {/* Always-visible horizontal stats */}
      <div style={statsContainerStyle}>
        <div>💰 {coins} Coins</div>
        <div>💪 {attributes.strength} Strength</div>
        <div>⚡ {attributes.speed} Speed</div>
        <div>🏃‍♂️ {attributes.endurance} Endurance</div>
        <div>🎨 {customization}</div>
      </div>
    </div>
  );
};

// Reusable button style for the main menu buttons
const menuButtonStyle: React.CSSProperties = {
  display: "block",
  width: "200px",
  margin: "10px auto",
  padding: "15px",
  backgroundColor: "#2196F3",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "18px",
};

// Plain horizontal flexbox for stats
const statsContainerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: "20px", // Space between each stat
  marginTop: "20px",
  fontSize: "16px", // Simple, readable text size
};
