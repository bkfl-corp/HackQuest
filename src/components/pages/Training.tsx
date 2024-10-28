import React, { useState, useEffect, useRef } from "react";
import { useGame } from "../../context/GameContext";

const words = [
  "innovation",
  "teamwork",
  "prototype",
  "collaboration",
  "presentation",
  "challenge",
  "problem",
  "debug",
  "creativity",
  "learning",
  "hackathon",
  "solution",
];

export const Training: React.FC = () => {
  const { addCoins, updateAttributes, setPage, coins } = useGame();
  const [targetWord, setTargetWord] = useState("");
  const [input, setInput] = useState("");
  const [pointsEarned, setPointsEarned] = useState(0);
  const [showPoints, setShowPoints] = useState(false);
  const [errorIndex, setErrorIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Pick a random word when the component mounts or resets
  useEffect(() => {
    generateNewWord();
  }, []);

  const generateNewWord = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setTargetWord(randomWord);
    setInput(""); // Reset input
    setShowPoints(false); // Hide points overlay
    setErrorIndex(null); // Reset error state
    inputRef.current?.focus(); // Focus input
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key.length === 1) {
      // Check if the input is correct
      if (e.key === targetWord[input.length]) {
        setInput((prev) => prev + e.key); // Append correct character
      } else {
        // Trigger error effect by setting the error index
        setErrorIndex(input.length);
        setTimeout(() => setErrorIndex(null), 250); // Clear error after 0.25s
      }
    } else if (e.key === "Backspace") {
      setInput((prev) => prev.slice(0, -1)); // Handle backspace
    }

    // Check if the word is completed
    if (input + e.key === targetWord) {
      const earnedPoints = targetWord.length * 2;
      addCoins(earnedPoints);
      updateAttributes("speed", 1);

      setPointsEarned(earnedPoints);
      setShowPoints(true); // Show overlay

      // Generate new word
      setTimeout(generateNewWord, 500);
    }
  };

  return (
    <div
      style={{ position: "relative", textAlign: "center", marginTop: "20px" }}
    >
      <h2>Typing Minigame</h2>

      {/* Display Current Coin Balance */}
      <p style={{ fontSize: "18px", color: "gold", marginBottom: "10px" }}>
        💰 Current Coins: {coins}
      </p>

      <p>Type the following word:</p>

      <div
        style={{ marginBottom: "10px", fontSize: "24px", letterSpacing: "2px" }}
      >
        {/* Display target word with correctly typed letters in green, and flash red on error */}
        {targetWord.split("").map((char, index) => (
          <span
            key={index}
            style={{
              color:
                index === errorIndex
                  ? "red"
                  : index < input.length && input[index] === char
                  ? "green"
                  : "white",
            }}
          >
            {char}
          </span>
        ))}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={input}
        onKeyDown={handleKeyPress}
        style={{ position: "absolute", top: "-9999px" }}
      />

      {/* Points overlay */}
      {showPoints && (
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            color: "green",
            fontSize: "32px",
            animation: "fade-in-out 1s ease-in-out",
          }}
        >
          +{pointsEarned} Coins!
        </div>
      )}

      <button onClick={() => setPage("main-menu")}>Back to Main Menu</button>
    </div>
  );
};
