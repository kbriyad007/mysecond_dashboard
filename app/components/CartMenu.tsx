"use client";

import { useCart } from "@/lib/CartContext";

export default function CartMenu() {
  const { cartItems, removeFromCart } = useCart();

  return (
    <aside className="bg-white shadow rounded p-4 w-full max-w-xs border border-gray-200">
      <h2 className="text-lg font-semibold mb-3">🛍️ Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-sm">Cart is empty.</p>
      ) : (
        <ul className="space-y-3">
          {cartItems.map((item, i) => (
            <li
              key={i}
              className="flex justify-between items-center text-sm text-gray-800 border-b border-gray-100 pb-2"
            >
              <div className="flex flex-col">
                <span className="font-medium">{item.name}</span>
                <span className="text-gray-500 text-xs">${item.price}</span>
              </div>

              <button
                onClick={() => removeFromCart(item.name)}
                aria-label={`Remove ${item.name}`}
                className="text-red-500 hover:text-red-600 text-xs font-medium px-2 py-1 rounded transition-colors"
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
