"use client";

import { useState } from "react";

interface QuantitySelectorProps {
  onBuy: (quantity: number) => void;
  price?: number | string;
}

export default function QuantitySelector({ onBuy, price }: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(1);

  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => setQuantity((q) => Math.max(1, q - 1));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onBuy(quantity);
      }}
      className="space-y-4"
    >
      <div className="flex items-center space-x-4">
        <label htmlFor="quantity" className="text-gray-700 font-medium text-base">
          Quantity:
        </label>

        <div className="flex items-center border rounded-lg overflow-hidden">
          <button
            type="button"
            className="w-10 h-10 text-xl font-bold text-gray-600 hover:bg-gray-100"
            onClick={decrease}
          >
            −
          </button>

          <input
            id="quantity"
            name="quantity"
            type="number"
            value={quantity}
            onChange={(e) => {
              let val = Number(e.target.value);
              if (val < 1 || isNaN(val)) val = 1;
              setQuantity(val);
            }}
            min={1}
            className="w-16 h-10 text-center border-x border-gray-200 focus:outline-none"
          />

          <button
            type="button"
            className="w-10 h-10 text-xl font-bold text-gray-600 hover:bg-gray-100"
            onClick={increase}
          >
            +
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-lg font-semibold rounded-xl shadow-lg"
      >
        🛒 Buy Now {price ? `- $${price}` : ""}
      </button>
    </form>
  );
}
