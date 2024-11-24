import React, { useState } from "react";
import { useGame } from "../../context/GameContext";

interface Hackathon {
	name: string,
	requiredHacking: number,
	reward: number,
	minMana: number
}

interface HackathonSelectProps {
	hackathons: Array<Hackathon>, 
	handleCompete: (a: Hackathon) => void, 
	playerHacking: number
}

// List of fantasy-themed hackathons
const hackathons: Array<Hackathon> = [
  { name: "Hack the Castle 🏰", requiredHacking: 5, reward: 20, minMana: 10 },
  { name: "RoyalHacks 👑", requiredHacking: 20, reward: 50, minMana: 50 },
  { name: "Hack 4 The Queen ♥️", requiredHacking: 50, reward: 100, minMana: 100 },
  { name: "Hacking Heaven ⛪️", requiredHacking: 500, reward: 1, minMana: 1000 },
];

function HackathonAnimation() {
return (
        <div className="race-container flex justify-center space-x-4 mb-6">
          <div className="duck text-4xl animate-bounce">💻🐉</div>
          <div className="opponent-duck text-4xl animate-bounce">💻🐉</div>
        </div>
      );
	
}

function HackathonSelect({hackathons, handleCompete, playerHacking}: HackathonSelectProps) {
	return (
	<div className="space-y-4">
        {hackathons.map((hackathon) => (
          <button
            key={hackathon.name}
            onClick={() => handleCompete(hackathon)}
            className={`w-full p-3 rounded-lg text-white transition ${
              playerHacking >= hackathon.requiredHacking
                ? "bg-green-500 hover:bg-green-600 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {hackathon.name} <br /> (Requires {hackathon.requiredHacking} Hacking)
          </button>
        ))}
      </div>


	);
}

export const Compete: React.FC = () => {
  const { attributes, updateAttributes, setPage } = useGame();
  const [message, setMessage] = useState<string | null>(null);
  const [isCompeting, setIsCompeting] = useState(false);

  // Simulate an opponent's strength based on difficulty level
  const generateOpponent = (difficulty: number, minMana: number) => {
	//hacking value of an opponent is some fraction of twice the difficulty, that is at least as diffcult 
	//as the hackathon's minimum requirement
	const hacking = Math.floor(Math.random() * difficulty + difficulty);

	//similarly for oppoenent mana.
	const mana = Math.floor(Math.random() * minMana + minMana);
    return {hacking: hacking, mana: mana};
  };

  const handleCompete = (hackathon: (typeof hackathons)[0]) => {
    if (attributes.hacking < hackathon.requiredHacking) {
      setMessage(
        `🚫 You need at least ${hackathon.requiredHacking} hacking to compete in ${hackathon.name}. Train more!`
      );
      return;
    }

    setIsCompeting(true);

    setTimeout(() => {
      const opponent = generateOpponent(
        hackathon.requiredHacking,
	hackathon.minMana
      );

      if (attributes.hacking >= opponent.hacking) {
        const rewardBread = hackathon.reward;
        updateAttributes("bread", rewardBread); // Reward bread instead of coins
        //        updateAttributes("hacking", -hackathon.requiredHacking / 2); // Reduce some strength

        setMessage(
          `🎉 You won the ${hackathon.name} and earned ${rewardBread} bread! 🏆`
        );
      } else {
        setMessage(`😢 You lost to the other hackers. Try training more!`);
      }

      setIsCompeting(false);
    }, 3000); // 3-second animation
  };

  return (
<div>
    <div className="text-center mt-5">
      <h2 className="text-3xl font-bold mb-6 ">Compete in Hackathon</h2>

      {/* Display Current Stats */}
      <div className="mb-6 text-lg">
        <p>👾 Hacking: {attributes.hacking}</p>
        <p>⚡️ Mana: {attributes.mana}</p>
        <p>🍞 Bread: {attributes.bread}</p>
      </div>

	{(! isCompeting) && <HackathonSelect hackathons={hackathons} handleCompete={handleCompete} playerHacking={attributes.hacking} />}
	{isCompeting && <HackathonAnimation />}
	  {/* Display Result Message */}
      {message && (! isCompeting) && (
        <div
          className={`mt-4 text-lg ${
            message.includes("🎉") ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </div>
      )}

      {(! isCompeting) && <button
        onClick={() => setPage("main-menu")}
        className="mt-6 w-48 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
      >
        Back to Main Menu
      </button>}
    </div>
    </div>
  );
};
