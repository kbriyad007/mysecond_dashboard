"use client";

import { useState } from "react";

interface QuantitySelectorProps {
  price?: number | string;
}

export default function QuantitySelector({ price }: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(1);

  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val > 0) setQuantity(val);
  };

  const handleBuy = () => {
    alert(`Buying ${quantity} item${quantity > 1 ? "s" : ""} for $${price ?? "N/A"}`);
    // TODO: Implement real buy/cart logic here
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleBuy();
      }}
      className="flex flex-col sm:flex-row sm:items-center gap-3 max-w-xs"
    >
      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
        <button
          type="button"
          onClick={decrease}
          className="px-2 py-1 bg-gray-200 hover:bg-gray-300 transition text-gray-700 font-semibold text-sm"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={onInputChange}
          className="w-14 text-center border-l border-r border-gray-300 focus:outline-none text-sm"
          aria-label="Quantity"
        />
        <button
          type="button"
          onClick={increase}
          className="px-2 py-1 bg-gray-200 hover:bg-gray-300 transition text-gray-700 font-semibold text-sm"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <button
        type="submit"
        className="flex-1 bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-1.5 rounded-md shadow-md text-sm"
      >
        Buy Now
      </button>
    </form>
  );
}
