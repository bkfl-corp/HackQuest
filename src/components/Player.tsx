import { useGame } from "../context/GameContext";
import { useEffect, useState } from "react";
import drgnIdle from "../assets/drgn_idle.gif";
import drgnWalk from "../assets/drgn_wlk.gif";
import drgnSleep from "../assets/drgn-slp.gif";
import drgnTyping from "../assets/drgn_typing.gif";

export const Player: React.FC = () => {
  const { accessories, animationState } = useGame();
  const familiar = accessories.hasFamiliar ? "🐱" : "";
  const hat = accessories.hasHat ? "🧢" : "";
  const wand = accessories.hasWand ? "🪄" : "";

  const [currentGif, setCurrentGif] = useState(drgnIdle);

  useEffect(() => {
    switch (animationState) {
      case 'walking':
        setCurrentGif(drgnWalk);
        break;
      case 'sleeping':
        setCurrentGif(drgnSleep);
        break;
      case 'typing':
        setCurrentGif(drgnTyping);
        break;
      default:
        setCurrentGif(drgnIdle);
    }
  }, [animationState]);

  return (
    <div className="relative inline-block">
      {/* Hat */}
      {hat && (
        <span className="absolute -top-3 left-7 transform -translate-x-1/2 text-m">
          {hat}
        </span>
      )}

      {/* Wand */}
      {wand && (
        <span className="absolute top-12 right-16 text-sm">
          {wand}
        </span>
      )}

      {/* Player Image */}
      <img
        src={currentGif}
        alt="Character Animation"
        className="w-20 h-auto"
      />

      {/* Familiar */}
      {familiar && (
        <span className="absolute top-9 left-16 text-sm">
          {familiar}
        </span>
      )}
    </div>
  );
};
