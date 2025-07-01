"use client";

import { useCart } from "@/lib/CartContext";
import { Trash2 } from "lucide-react";

export default function CartMenu() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  // Calculate grand total
  const grandTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    alert("Proceeding to checkout...");
  };

  return (
    <aside className="bg-white shadow rounded p-4 w-full max-w-xs border border-gray-200 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">🛍️ Cart</h2>
        {cartItems.length > 0 && (
          <button
            onClick={clearCart}
            aria-label="Clear cart"
            title="Clear cart"
            className="text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <p className="text-gray-500 flex-grow">Cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-4 max-h-72 overflow-y-auto flex-grow">
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
            onClick={handleCheckout}
            className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-md font-semibold shadow-md"
            aria-label="Proceed to checkout"
          >
            Checkout
          </button>
        </>
      )}
    </aside>
  );
}
