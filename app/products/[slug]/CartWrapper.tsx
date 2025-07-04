"use client";

import { useState } from "react";
import CartMenu from "@/app/components/CartMenu"; // adjust path if needed

export default function CartWrapper() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      {/* Cart Icon Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition"
        aria-label="Open cart"
      >
        🛒
      </button>

      {/* Cart Menu Drawer */}
      <CartMenu />
    </>
  );
}
