"use client";

import { useCart } from "@/context/CartContext"; // adjust path
import { X } from "lucide-react"; // optional icon

export default function CartMenu() {
  const { cart, removeFromCart, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 text-sm">
        Your cart is empty.
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-md shadow-md max-w-md mx-auto space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">🛒 Your Cart</h2>

      {cart.map((item) => (
        <div
          key={item.name}
          className="flex justify-between items-center border-b pb-2 text-sm"
        >
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-gray-600">Qty: {item.quantity}</p>
            <p className="text-green-600 font-semibold">${item.price}</p>
          </div>

          <button
            onClick={() => removeFromCart(item.name)}
            className="text-red-500 hover:text-red-600 text-xs"
          >
            <X className="w-4 h-4 inline-block mr-1" />
            Remove
          </button>
        </div>
      ))}

      <button
        onClick={clearCart}
        className="mt-3 w-full text-sm text-red-500 hover:underline"
      >
        Clear All
      </button>
    </div>
  );
}
