"use client";

import { useCart } from "@/lib/CartContext";

export default function CartMenu() {
  const { cartItems } = useCart();

  return (
    <aside className="bg-white shadow rounded p-4 w-full max-w-xs border border-gray-200">
      <h2 className="text-lg font-semibold mb-3">🛍️ Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-500">Cart is empty.</p>
      ) : (
        <ul className="space-y-2">
          {cartItems.map((item, i) => (
            <li key={i} className="flex justify-between text-sm text-gray-800">
              <span>{item.name}</span>
              <span>${item.price}</span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
