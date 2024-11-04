import React, { useState } from "react";
import { useGame } from "../../context/GameContext";

const energyDrinks = [
  { name: "Basic Energy Drink", cost: 20, effect: "Increase mana by 5" },
  { name: "Super Energy Drink", cost: 50, effect: "Increase mana by 10" },
  { name: "Mega Energy Drink", cost: 100, effect: "Increase mana by 20" },
];

export const Shop: React.FC = () => {
  const { attributes, setPage, updateAttributes } = useGame();
  const [, setInventory] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePurchase = (item: (typeof energyDrinks)[0]) => {
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
    <div className="shop-container text-gray-800">
      <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
        Energy Drink Shop
      </h2>
      <p className="text-center text-xl mb-4 text-gray-800">
        Balance: {attributes.bread} bread
      </p>
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
            <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
            <p className="mb-2">{item.effect}</p>
            <p className="mb-4">Cost: {item.cost} bread</p>
            <button
              onClick={() => handlePurchase(item)}
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

      <button
        className="mt-6 w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
        onClick={() => setPage("main-menu")}
      >
        Back to Main Menu
      </button>
    </div>
  );
};
