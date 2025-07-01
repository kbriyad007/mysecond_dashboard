"use client";

import { useCart } from "@/lib/CartContext";

export default function CartMenu() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  // Calculate grand total
  const grandTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <aside className="bg-white shadow rounded p-4 w-full max-w-xs border border-gray-200">
      <h2 className="text-lg font-semibold mb-3">🛍️ Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-4 max-h-72 overflow-y-auto">
            {cartItems.map((item) => (
              <li
                key={item.name}
                className="flex items-center justify-between gap-2 text-gray-800"
              >
                <div className="flex-grow">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    ${item.price.toFixed(2)} ×{" "}
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.name, Number(e.target.value))
                      }
                      className="w-12 p-1 border rounded text-center text-sm"
                    />{" "}
                    = ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.name)}
                  aria-label={`Remove ${item.name}`}
                  className="text-red-500 hover:text-red-700 font-bold px-2"
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4 border-t pt-3 font-semibold text-gray-900">
            Grand Total: ${grandTotal.toFixed(2)}
          </div>

          <button
            onClick={() => clearCart()}
            className="mt-4 w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded"
          >
            Clear Cart
          </button>
        </>
      )}
    </aside>
  );
}
