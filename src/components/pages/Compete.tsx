import React, { useState } from "react";
import { useGame } from "../../context/GameContext";

// List of duck-themed hackathons
const hackathons = [
  { name: "Duck CC", requiredStrength: 5, reward: 20 },
  { name: "U of Ducks", requiredStrength: 10, reward: 50 },
  { name: "Duckford Hacks", requiredStrength: 15, reward: 100 },
];

export const Compete: React.FC = () => {
  const { attributes, updateAttributes, setPage } = useGame();
  const [message, setMessage] = useState<string | null>(null);
  const [isCompeting, setIsCompeting] = useState(false);

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

    setIsCompeting(true);

    setTimeout(() => {
      const opponentStrength = generateOpponentStrength(
        hackathon.requiredStrength
      );

      if (attributes.strength >= opponentStrength) {
        const rewardBread = hackathon.reward;
        updateAttributes("bread", rewardBread); // Reward bread instead of coins
        updateAttributes("strength", -hackathon.requiredStrength / 2); // Reduce some strength

        setMessage(
          `🎉 You won the ${hackathon.name} and earned ${rewardBread} bread! 🏆`
        );
      } else {
        setMessage(`😢 You lost to the other ducks. Try training more!`);
      }

      setIsCompeting(false);
    }, 3000); // 3-second animation
  };

  return (
    <div className="text-center mt-5">
      <h2 className="text-3xl font-bold mb-6 ">Compete in Hackathon</h2>

      {/* Display Current Stats */}
      <div className="mb-6 text-lg ">
        <p>💪 Strength: {attributes.strength}</p>
        <p>🍞 Bread: {attributes.bread}</p>
      </div>

      {/* Hackathon Selection */}
      <div className="space-y-4 mb-8">
        {hackathons.map((hackathon) => (
          <button
            key={hackathon.name}
            onClick={() => handleCompete(hackathon)}
            disabled={isCompeting} // Disable buttons during animation
            className={`w-48 py-3 rounded-lg text-white transition ${
              attributes.strength >= hackathon.requiredStrength
                ? "bg-green-500 hover:bg-green-600 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {hackathon.name} (Requires {hackathon.requiredStrength} Strength)
          </button>
        ))}
      </div>

      {/* Duck Race Animation */}
      {isCompeting && (
        <div className="race-container flex justify-center space-x-4 mb-6">
          <div className="duck text-4xl animate-bounce">🦆</div>
          <div className="opponent-duck text-4xl animate-bounce">🦆</div>
        </div>
      )}

      {/* Display Result Message */}
      {message && (
        <div
          className={`mt-4 text-lg ${
            message.includes("🎉") ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </div>
      )}

      <button
        onClick={() => setPage("main-menu")}
        className="mt-6 w-48 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
      >
        Back to Main Menu
      </button>
    </div>
  );
};
