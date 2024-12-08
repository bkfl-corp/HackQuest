import React, { useState, useEffect, useRef, useCallback } from "react";
import { useGame } from "../../context/GameContext";
import backgroundImage from "../../assets/images/gxp.gif" 

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
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [hackingEarned, setHackingEarned] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timeLeftRef = useRef(30); // Track time left independently of state

  const [timeLeft, setTimeLeft] = useState(30);
  const [totalCorrectChars, setTotalCorrectChars] = useState(0);
  const [totalTypedChars, setTotalTypedChars] = useState(0); // Tracks total typed characters

  // Refs to store latest state values
  const totalCorrectCharsRef = useRef(totalCorrectChars);
  const totalTypedCharsRef = useRef(totalTypedChars);
  const timeLeftStateRef = useRef(timeLeft);

  // Update refs when state changes
  useEffect(() => {
    totalCorrectCharsRef.current = totalCorrectChars;
  }, [totalCorrectChars]);

  useEffect(() => {
    totalTypedCharsRef.current = totalTypedChars;
  }, [totalTypedChars]);

  useEffect(() => {
    timeLeftStateRef.current = timeLeft;
  }, [timeLeft]);

  const generateNewSentence = useCallback(() => {
    const sentenceLength = 10 + Math.floor(Math.random() * 6); // Generates sentences with 10-15 words
    const randomSentence = Array.from(
      { length: sentenceLength },
      () => words[Math.floor(Math.random() * words.length)]
    ).join(" ");

    setTargetSentence(randomSentence);
    setInput("");
    setCurrentIndex(0);
    setErrorIndex(null);
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    generateNewSentence();
  }, [generateNewSentence]);

  const endGame = useCallback(() => {
    const totalTimeMinutes = 0.5; // Fixed 30 seconds
    const finalWpm = Math.round(
      totalCorrectCharsRef.current / 5 / totalTimeMinutes
    );
    const totalTyped = totalTypedCharsRef.current;
    const correctTyped = totalCorrectCharsRef.current;

    const finalAccuracy =
      totalTyped > 0 ? Math.round((correctTyped / totalTyped) * 100) : 100;

    let earnedPoints = 0;
    let earnedHacking = 0;

    if (timeLeftStateRef.current === 0) {
      // Timer reached 0
      earnedPoints = finalWpm * (finalAccuracy / 100);
      earnedHacking = finalWpm > 0 ? Math.round(finalWpm / 10) : 0;

      // Update attributes only if points are earned
      updateAttributes("bread", Math.round(earnedPoints));
      updateAttributes("hacking", earnedHacking);
    }

    setWpm(finalWpm); // Ensure WPM is updated correctly
    setAccuracy(finalAccuracy); // Ensure accuracy is updated correctly
    setPointsEarned(Math.round(earnedPoints)); // Ensure points are updated correctly
    setHackingEarned(earnedHacking); // Ensure hacking earned is updated correctly
    setGameOver(true); // End the game
  }, [updateAttributes]);

  useEffect(() => {
    if (startTime !== null && !gameOver) {
      timerRef.current = setInterval(() => {
        if (timeLeftRef.current <= 1) {
          timeLeftRef.current = 0; // Set to 0 before ending the game
          setTimeLeft(0); // Update state
          timeLeftStateRef.current = 0; // Ensure ref is set to 0
          clearInterval(timerRef.current!);
          timerRef.current = null;
          endGame();
        } else {
          timeLeftRef.current -= 1;
          setTimeLeft(timeLeftRef.current); // Synchronize UI
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [startTime, gameOver, endGame]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (gameOver || !targetSentence) return;

    const key = e.key;
    if (startTime === null) setStartTime(Date.now());

    if (key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      // It's a character key
      setTotalTypedChars((prevTotalTypedChars) => prevTotalTypedChars + 1);

      if (key === targetSentence[currentIndex]) {
        // Correct key
        setInput((prevInput) => prevInput + key);
        setCurrentIndex((prevIndex) => {
          const newIndex = prevIndex + 1;
          if (newIndex === targetSentence.length) {
            generateNewSentence();
            return 0;
          } else {
            return newIndex;
          }
        });
        setTotalCorrectChars(
          (prevTotalCorrectChars) => prevTotalCorrectChars + 1
        );
        setErrorIndex(null);
      } else {
        // Incorrect key
        setMistakes((prevMistakes) => {
          const newMistakes = prevMistakes + 1;
          if (newMistakes >= 5) {
            endGame();
          }
          return newMistakes;
        });
        setErrorIndex(currentIndex);
        setTimeout(() => setErrorIndex(null), 250);
      }
    } else if (key === "Backspace") {
      // Handle Backspace
      if (currentIndex > 0) {
        setCurrentIndex((prevIndex) => prevIndex - 1);
        setInput((prevInput) => prevInput.slice(0, -1));
        setErrorIndex(null);
      }
    }
  };

  const resetGame = useCallback(() => {
    setTimeLeft(30);
    timeLeftRef.current = 30; // Reset the ref as well
    setMistakes(0);
    setTotalCorrectChars(0);
    setTotalTypedChars(0);
    setStartTime(null);
    setWpm(0);
    setAccuracy(null);
    setPointsEarned(0);
    setHackingEarned(0);
    setGameOver(false);
    generateNewSentence();
  }, [generateNewSentence]);

  useEffect(() => {
    if (gameOver) {
      const handleRestartKey = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          resetGame();
        }
      };
      window.addEventListener("keydown", handleRestartKey);
      return () => {
        window.removeEventListener("keydown", handleRestartKey);
      };
    }
  }, [gameOver, resetGame]);
  
  const backgroundImageUrl = backgroundImage;

  return (
    <div className="relative text-center mt-5 p-4 bg-gray-800 rounded-lg"
	style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat', 
        height: '50%', 
      }}
	>
      {gameOver ? (
        <div className="flex flex-col justify-center items-center">
          {totalTypedChars > 0 ? (
            <div className="flex flex-row gap-6">
              <p className="text-lg text-white mb-2">WPM: {wpm} </p>
              <p className="text-lg text-white mb-2">Accuracy: {accuracy}%</p>
            </div>
          ) : (
            <p className="text-lg text-white mb-2">
              You didn't type any words.
            </p>
          )}
          {timeLeft === 0 ? (
            <p className="text-2xl text-white mb-6">
              Bread Earned: {pointsEarned}
              <br />
              Hacking Earned: {hackingEarned}
            </p>
          ) : (
            <p className="text-2xl text-red-500 mb-6">
              You made too many mistakes and earned no rewards.
            </p>
          )}
          <button
            onClick={resetGame}
            className="mb-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Play Again (Press "Enter")
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
            <p className="text-lg">Time Left: {timeLeft}s</p>
            <p className="text-lg">Mistakes: {mistakes}/5</p>
          </div>
          <p className="mb-4 text-white text-2xl bg-gray-600 bg-opacity-50 p-2 rounded-md inline-block">
            {targetSentence.split("").map((char, index) => (
              <React.Fragment key={index}>
                {index === currentIndex && (
                  <span style={{ color: "yellow" }}>|</span>
                )}
                <span
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
              </React.Fragment>
            ))}
            {currentIndex === targetSentence.length && (
              <span style={{ color: "yellow" }}>|</span>
            )}
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
