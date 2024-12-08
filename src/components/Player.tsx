import { useGame } from "../context/GameContext";
import { useEffect, useState } from "react";
import drgnIdle from "../assets/drgn_idle.gif";
import drgnWalk from "../assets/drgn_wlk.gif";
import drgnSleep from "../assets/drgn-slp.gif";
import drgnTyping from "../assets/drgn_typing.gif";

export const Player: React.FC = () => {
  const { accessories, animationState } = useGame(); // Corrected spelling
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
    <span>
      <div>{hat}</div>
      <div>
        {wand}
        <img src={currentGif} alt="Character Animation" style={{ width: '100px', height: 'auto' }} /> {/* Ensure fixed width */}
        {familiar}
      </div>
    </span>
  );
};
