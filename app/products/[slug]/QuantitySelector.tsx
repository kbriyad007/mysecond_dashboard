"use client";

import { useState } from "react";
import { useCart } from "@/lib/CartContext";

interface QuantitySelectorProps {
  name: string;
  price?: number | string;
}

export default function QuantitySelector({ name, price }: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val > 0) setQuantity(val);
  };

  const handleAddToCart = () => {
    addToCart({ name, price, quantity });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleAddToCart();
      }}
      className="flex flex-col sm:flex-row sm:items-center gap-4 max-w-xs text-sm"
    >
      {/* Quantity Selector */}
      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={decrease}
          aria-label="Decrease quantity"
          className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 transition text-gray-700 font-semibold"
        >
          −
        </button>

        <input
          type="number"
          min={1}
          value={quantity}
          onChange={onInputChange}
          className="w-14 text-center border-l border-r border-gray-300 focus:outline-none"
          aria-label="Product quantity"
        />

        <button
          type="button"
          onClick={increase}
          aria-label="Increase quantity"
          className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 transition text-gray-700 font-semibold"
        >
          +
        </button>
      </div>

      {/* Add to Cart Button */}
      <button
        type="submit"
        className="flex-1 bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 px-4 rounded-md shadow-md"
        aria-label={`Add ${quantity} ${name} to cart`}
      >
        Add to Cart
      </button>
    </form>
  );
}
