import React, { useState, useEffect, useRef } from "react";
import { useGame } from "../../context/GameContext";

const words = [
  "and",
  "as",
  "break",
  "class",
  "continue",
  "def",
  "del",
  "elif",
  "else",
  "except",
  "for",
  "from",
  "global",
  "if",
  "import",
  "in",
  "is",
  "not",
  "or",
  "pass",
  "raise",
  "return",
  "try",
  "while",
  "with",
];

export const TypingGame: React.FC = () => {
  const { updateAttributes, setPage, attributes } = useGame();
  const [targetSentence, setTargetSentence] = useState("");
  const [input, setInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [errorIndex, setErrorIndex] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState(100);
  const [wpm, setWpm] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    generateNewSentence();
  }, []);

  const generateNewSentence = () => {
    const sentenceLength = 10 + Math.floor(Math.random() * 6); // Generates sentences with 5-10 words
    const randomSentence = Array.from(
      { length: sentenceLength },
      () => words[Math.floor(Math.random() * words.length)]
    ).join(" ");

    setTargetSentence(randomSentence);
    setInput("");
    setCurrentIndex(0);
    setMistakes(0);
    setErrorIndex(null);
    setAccuracy(100);
    setWpm(0);
    setPointsEarned(0);
    setGameOver(false);
    setStartTime(null);
    inputRef.current?.focus();
  };

  const calculateWPM = () => {
    if (!startTime) return 0;
    const timeElapsed = (Date.now() - startTime) / 1000 / 60;
    const wordsTyped = currentIndex / 5;
    return Math.round(wordsTyped / timeElapsed);
  };

  const calculateAccuracy = () => {
    if (currentIndex === 0) return 100;
    const totalTyped = currentIndex + mistakes;
    const correctTyped = currentIndex - mistakes;
    return Math.round((correctTyped / totalTyped) * 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (gameOver || !targetSentence) return;

    const key = e.key;
    if (startTime === null) setStartTime(Date.now());

    if (key === targetSentence[currentIndex]) {
      setInput((prev) => prev + key);
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setErrorIndex(null);

      setWpm(calculateWPM());
      setAccuracy(calculateAccuracy());

      if (currentIndex + 1 === targetSentence.length) {
        endGame();
      }
    } else if (key.length === 1) {
      setMistakes((prevMistakes) => prevMistakes + 1);
      setErrorIndex(currentIndex);
      setTimeout(() => setErrorIndex(null), 250);
    } else if (key === "Backspace") {
      if (currentIndex > 0) {
        setCurrentIndex((prevIndex) => prevIndex - 1);
        setInput((prev) => prev.slice(0, -1));
        setErrorIndex(null);
        setWpm(calculateWPM());
        setAccuracy(calculateAccuracy());
      }
    }
  };

  useEffect(() => {
    if (gameOver) {
      const handleRestartKey = (e: KeyboardEvent) => {
        if (e.key === " " || e.key === "Enter") {
          generateNewSentence();
        }
      };
      window.addEventListener("keydown", handleRestartKey);
      return () => {
        window.removeEventListener("keydown", handleRestartKey);
      };
    }
  }, [gameOver]);

  const endGame = () => {
    const endTime = Date.now();
    const timeTaken = (endTime - (startTime ?? endTime)) / 1000 / 60;
    const words = targetSentence.split(" ").length;
    const finalWpm = Math.round(words / timeTaken);
    const finalAccuracy = calculateAccuracy();
    const earnedPoints = Math.round(finalWpm * (finalAccuracy / 100));

    setWpm(finalWpm);
    setAccuracy(finalAccuracy);
    setPointsEarned(earnedPoints);
    updateAttributes("bread", earnedPoints);
    setGameOver(true);
  };

  return (
    <div className="relative text-center mt-5 p-4 bg-gray-800 rounded-lg">
      {gameOver ? (
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-row gap-6">
            <p className="text-lg text-white mb-2">WPM: {wpm} </p>
            <p className="text-lg text-white mb-2">Accuracy: {accuracy}%</p>
          </div>
          <p className="text-2xl text-white mb-6">
            Bread Earned: {pointsEarned}
          </p>
          <button
            onClick={generateNewSentence}
            className="mb-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Play Again (Press "Space" or "Enter")
          </button>
          <button
            onClick={() => setPage("main-menu")}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Return to Main Menu
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4 text-white">Typing Game</h2>
          <div className="flex justify-between mb-4 text-white">
            <p className="text-lg">🍞 Bread: {attributes.bread}</p>
            <p className="text-lg">WPM: {wpm}</p>
            <p className="text-lg">Accuracy: {accuracy}%</p>
          </div>
          <p className="mb-4 text-white text-2xl bg-gray-700 bg-opacity-50 p-2 rounded-md inline-block">
            {targetSentence.split("").map((char, index) => (
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
          </p>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onKeyDown={handleKeyPress}
            style={{ position: "absolute", top: "-9999px" }}
            autoFocus
            aria-label="Typing Input"
          />
          <button
            onClick={() => setPage("main-menu")}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Main Menu
          </button>
        </>
      )}
    </div>
  );
};
