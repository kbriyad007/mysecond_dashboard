"use client";

import { useCart } from "@/app/context/CartContext";
import { X } from "lucide-react";
import { useState } from "react";

export default function CartMenu() {
  const { cart, removeFromCart, clearCart, addToCart } = useCart();

  // Handle quantity change for a specific item
  const handleQuantityChange = (name: string, newQuantity: number) => {
    if (newQuantity < 1) return; // Optional: no zero or negative quantities

    // Update quantity by adding the difference
    const existingItem = cart.find((item) => item.name === name);
    if (!existingItem) return;

    const diff = newQuantity - existingItem.quantity;

    if (diff === 0) return; // No change

    // Reuse addToCart to update quantity by diff (as addToCart adds quantity)
    addToCart({ name, price: existingItem.price, quantity: diff });
  };

  if (cart.length === 0) {
    return (
      <div className="fixed right-0 top-20 w-80 h-60 bg-white rounded-l-md shadow-lg p-4 text-center text-gray-500 text-sm flex items-center justify-center">
        Your cart is empty.
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-20 w-80 max-h-[70vh] bg-white rounded-l-md shadow-lg p-4 overflow-auto flex flex-col">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex justify-between items-center">
        🛒 Your Cart
        <button
          onClick={clearCart}
          className="text-red-500 hover:text-red-600 text-xs font-semibold"
          aria-label="Clear cart"
        >
          Clear All
        </button>
      </h2>

      <div className="flex-grow space-y-4 overflow-auto">
        {cart.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between border-b pb-2"
          >
            <div className="flex flex-col">
              <p className="font-medium text-gray-900">{item.name}</p>
              <p className="text-green-600 font-semibold">${item.price}</p>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) =>
                  handleQuantityChange(item.name, Number(e.target.value))
                }
                className="w-16 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                aria-label={`Quantity for ${item.name}`}
              />

              <button
                onClick={() => removeFromCart(item.name)}
                className="text-red-500 hover:text-red-600 text-xs font-semibold"
                aria-label={`Remove ${item.name} from cart`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
