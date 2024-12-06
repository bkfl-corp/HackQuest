import React, { useState } from "react";
import { useGame, PlayerAcessories } from "../../context/GameContext";

const energyDrinks = [
  { name: "Basic Energy Drink", cost: 20, effect: "+5 mana" },
  { name: "Super Energy Drink", cost: 50, effect: "+10 mana" },
  { name: "Mega Energy Drink", cost: 100, effect: "+20 mana" },
];

const shopAcessories = [
  { id: "hat", name: "A Really Cool Hat", cost: 50, graphic: "🧢"},
  { id: "familiar", name: "Mysterious Familiar", cost: 100, graphic: "🐱"},
  { id: "wand", name: "Magic Wand", cost: 10000, graphic: "🪄" },
];

function hasBought(acessories: PlayerAcessories, id: string) : boolean | null {
	switch(id) {
		case "hat":
			return acessories.hasHat;
			break;
		case "familiar":
			return acessories.hasFamiliar;
			break;
		case "wand":
			return acessories.hasWand;
			break;
	}
	return null;
}

export const Shop: React.FC = () => {
  const { attributes, acessories, setPage, updateAttributes, buyAcessory} = useGame();
  const [, setInventory] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAcessoryPurchase = (item: (typeof shopAcessories)[0]) => {
    if (attributes.bread >= item.cost) {
     switch(item.id) {
		case "hat":
			if(acessories.hasHat) {
				break;
			}
			buyAcessory("hasHat");				
			updateAttributes("bread", -item.cost); // Deduct bread
			break;
		case "wand":
			if(acessories.hasWand) {
				break;
			}
			buyAcessory("hasWand");				
			updateAttributes("bread", -item.cost); // Deduct bread
			break;
		case "familiar":
			if(acessories.hasFamiliar) {
				break;
			}
			buyAcessory("hasFamiliar");				
			updateAttributes("bread", -item.cost); // Deduct bread
			break;

		}
setErrorMessage(null); // Clear any previous error message
} else {
setErrorMessage("Insufficient bread to purchase this item."); // Set error message
}
};

  const handleDrinkPurchase = (item: (typeof energyDrinks)[0]) => {
    if (attributes.bread >= item.cost) {
      const manaIncrease = parseInt(item.effect.match(/\d+/)?.[0] || "0");
      updateAttributes("mana", manaIncrease); // Update mana based on effect
      updateAttributes("bread", -item.cost); // Deduct bread
      setInventory((prev) => [...prev, item.name]); // Add to inventory
      setErrorMessage(null); // Clear any previous error message
    } else {
      setErrorMessage("Insufficient bread to purchase this item."); // Set error message
    }
  };


  return (
    <div className="shop-container text-white-800">
      <p className="text-center text-xl mb-4 text-white-800">
        Balance: {attributes.bread} bread 🍞
      </p>
      <h2 className="text-3xl font-bold text-center mb-4 text-white-800">
        Energy Drink Shop 🧋
      </h2>
      {/* Display Error Message */}
      {errorMessage && (
        <p className="text-center text-red-500 mb-4">{errorMessage}</p>
      )}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {energyDrinks.map((item) => (
          <div
            className="border rounded-lg p-4 bg-gray-100 shadow-lg text-center text-gray-800"
            key={item.name}
          >
            <p className="font-semibold mb-1">{item.name}</p>
            <p className="mb-1">{item.effect}</p>
            <p className="mb-1">Cost: {item.cost} bread</p>
            <button
              onClick={() => handleDrinkPurchase(item)}
              disabled={attributes.bread < item.cost}
              className={`w-full py-2 rounded ${
                attributes.bread >= item.cost
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
            >
              Buy
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-3xl font-bold text-center text-white-800 py-4 ">
        Accessory Shop ✨
      </h2>
	<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {shopAcessories.map((item) => (
          <div
            className="border rounded-lg p-4 bg-gray-100 shadow-lg text-center text-gray-800"
            key={item.name}
          >
            <p className="font-semibold mb-1">{item.name}</p>
            <p className="mb-1">{item.graphic}</p>
            <p className="mb-1">Cost: {item.cost} bread</p>
            <button
              onClick={() => handleAcessoryPurchase(item)}
              disabled={attributes.bread < item.cost}
              className={`w-full py-2 rounded ${
                attributes.bread >= item.cost && ! hasBought(acessories, item.id) 
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
            >
              Buy
            </button>
          </div>
        ))}
      </div>


      <button
        className="mt-6 w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
        onClick={() => setPage("main-menu")}
      >
        Back to Main Menu
      </button>
    </div>
  );
};
