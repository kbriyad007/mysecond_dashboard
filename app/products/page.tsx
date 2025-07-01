"use client";

import { useState } from "react";
import ProductGrid from "./ProductGrid";
import CartMenu from "../components/CartMenu";
import "./ProductsPage.css"; // Updated styles below

export default function ProductsPage() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <main className="page-container">
      {/* Mobile Cart Toggle */}
      <div className="cart-toggle-button">
        <button onClick={() => setIsCartOpen(true)}>🛒 View Cart</button>
      </div>

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
        <div
          className="cart-drawer-overlay"
          onClick={() => setIsCartOpen(false)}
        >
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
