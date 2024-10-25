import React, { useState } from "react";
import { useGame } from "../../context/GameContext";

// List of duck-themed hackathons
const hackathons = [
  { name: "Community College Ducks", requiredStrength: 5, reward: 20 },
  { name: "KU Ducks", requiredStrength: 10, reward: 50 },
  { name: "Stanford Ducks", requiredStrength: 15, reward: 100 },
];

export const Compete: React.FC = () => {
  const { attributes, coins, addCoins, updateAttributes, setPage } = useGame();
  const [message, setMessage] = useState<string | null>(null); // Display results
  const [isCompeting, setIsCompeting] = useState(false); // Track competition state

  // Simulate an opponent's strength based on difficulty level
  const generateOpponentStrength = (difficulty: number) => {
    return Math.floor(Math.random() * difficulty) + difficulty;
  };

  const handleCompete = (hackathon: (typeof hackathons)[0]) => {
    if (attributes.strength < hackathon.requiredStrength) {
      setMessage(
        `🚫 You need at least ${hackathon.requiredStrength} strength to compete in ${hackathon.name}. Train more!`
      );
      return;
    }

    setIsCompeting(true); // Start the competition animation

    setTimeout(() => {
      const opponentStrength = generateOpponentStrength(
        hackathon.requiredStrength
      );

      if (attributes.strength >= opponentStrength) {
        const rewardCoins = hackathon.reward;
        addCoins(rewardCoins); // Reward coins
        updateAttributes("strength", -hackathon.requiredStrength / 2); // Reduce some strength

        setMessage(
          `🎉 You won the ${hackathon.name} and earned ${rewardCoins} coins! 🏆`
        );
      } else {
        setMessage(`😢 You lost to the other ducks. Try training more!`);
      }

      setIsCompeting(false); // End the competition animation
    }, 3000); // 3-second animation
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Compete in Hackathon</h2>

      {/* Display Current Stats */}
      <p>💪 Strength: {attributes.strength}</p>
      <p>💰 Coins: {coins}</p>

      {/* Hackathon Selection */}
      <div style={{ margin: "20px 0" }}>
        {hackathons.map((hackathon) => (
          <button
            key={hackathon.name}
            onClick={() => handleCompete(hackathon)}
            disabled={isCompeting} // Disable buttons during animation
            style={{
              display: "block",
              margin: "10px auto",
              padding: "10px 20px",
              backgroundColor:
                attributes.strength >= hackathon.requiredStrength
                  ? "green"
                  : "gray",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: isCompeting
                ? "not-allowed"
                : attributes.strength >= hackathon.requiredStrength
                ? "pointer"
                : "not-allowed",
            }}
          >
            {hackathon.name} (Requires {hackathon.requiredStrength} Strength)
          </button>
        ))}
      </div>

      {/* Duck Race Animation */}
      {isCompeting && (
        <div className="race-container">
          <div className="duck">🦆</div>
          <div className="opponent-duck">🦆</div>
        </div>
      )}

      {/* Display Result Message */}
      {message && (
        <div
          style={{
            marginTop: "10px",
            fontSize: "18px",
            color: message.includes("🎉") ? "green" : "red",
          }}
        >
          {message}
        </div>
      )}

      <button
        onClick={() => setPage("main-menu")}
        style={{ marginTop: "20px" }}
      >
        Back to Main Menu
      </button>
    </div>
  );
};
