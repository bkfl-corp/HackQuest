import React from "react";
import { useGame } from "../../context/GameContext";

const items = [
  { name: "Speed Shoes", cost: 50, effect: "Increase speed by 5" },
  { name: "Power Gloves", cost: 75, effect: "Increase strength by 5" },
  { name: "Endurance Potion", cost: 100, effect: "Increase endurance by 5" },
];

export const Shop: React.FC = () => {
  const { coins, setPage, updateAttributes, addCoins } = useGame();

  const handlePurchase = (item: (typeof items)[0]) => {
    if (coins >= item.cost) {
      switch (item.name) {
        case "Speed Shoes":
          updateAttributes("speed", 5);
          break;
        case "Power Gloves":
          updateAttributes("strength", 5);
          break;
        case "Endurance Potion":
          updateAttributes("endurance", 5);
          break;
      }
      addCoins(-item.cost);
    }
  };

  return (
    <div className="shop-container">
      <h2 className="shop-title">Shop</h2>
      <p className="balance">Balance: {coins} coins</p>

      <div className="item-grid">
        {items.map((item) => (
          <div className="item-card" key={item.name}>
            <h3 className="item-name">{item.name}</h3>
            <p className="item-effect">{item.effect}</p>
            <p className="item-cost">Cost: {item.cost} coins</p>
            <button
              onClick={() => handlePurchase(item)}
              disabled={coins < item.cost}
              className={`buy-button ${
                coins >= item.cost ? "enabled" : "disabled"
              }`}
            >
              Buy
            </button>
          </div>
        ))}
      </div>

      <button className="back-button" onClick={() => setPage("main-menu")}>
        Back to Main Menu
      </button>
    </div>
  );
};
