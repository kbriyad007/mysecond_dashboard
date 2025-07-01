"use client";

import { useState } from "react";
import ProductGrid from "./ProductGrid";
import CartMenu from "../components/CartMenu";
import { ShoppingBag } from "lucide-react"; // Modern icon
import { useCart } from "@/lib/CartContext";
import "./ProductsPage.css";

export default function ProductsPage() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems } = useCart();

  return (
    <main className="page-container">
      {/* Product Section */}
      <div className="product-section">
        <ProductGrid />
      </div>

      {/* Floating Cart Icon - Bottom Right */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="cart-fab"
        aria-label="Open cart"
      >
        <ShoppingBag size={24} />
        {cartItems.length > 0 && (
          <span className="cart-badge">{cartItems.length}</span>
        )}
      </button>

      {/* Slide-in Cart Drawer */}
      {isCartOpen && (
        <div
          className="cart-drawer-overlay"
          onClick={() => setIsCartOpen(false)}
        >
          <div
            className="cart-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cart-drawer-header">
              <h2>🛍️ Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)}>✕</button>
            </div>
            <CartMenu />
          </div>
        </div>
      )}
    </main>
  );
}
