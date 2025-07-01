"use client";

import { useState } from "react";
import ProductGrid from "./ProductGrid";
import CartMenu from "../components/CartMenu";
import { ShoppingCart } from "lucide-react"; // modern icon
import { useCart } from "@/lib/CartContext";
import "./ProductsPage.css";

export default function ProductsPage() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems } = useCart();

  return (
    <main className="page-container">
      {/* Cart Toggle Button (shown on all screens now) */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="cart-toggle-icon"
        aria-label="Open cart"
      >
        <ShoppingCart size={24} />
        {cartItems.length > 0 && (
          <span className="cart-badge">{cartItems.length}</span>
        )}
      </button>

      {/* Product Section */}
      <div className="product-section">
        <ProductGrid />
      </div>

      {/* Floating Cart (Desktop Only) */}
      <div className="floating-cart desktop-only">
        <CartMenu />
      </div>

      {/* Mobile Slide-in Cart */}
      {isCartOpen && (
        <div className="cart-drawer-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
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
