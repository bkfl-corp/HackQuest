import { useGame } from "../context/GameContext";


export const Player: React.FC = () => {
	const {acessories} = useGame();
	const familiar = acessories.hasFamiliar ? "🐱" : "";
	const hat = acessories.hasHat ? "🧢" : "";
	const wand = acessories.hasWand ? "🪄" : "";
	return (
		<span><div>{hat}</div><div>{wand}🐉{familiar}</div></span>
	);
};
