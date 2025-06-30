"use client";

import { useState } from "react";
import ProductGrid from "./ProductGrid";
import CartMenu from "../components/CartMenu";
import "./ProductsPage.css"; // Custom CSS file

export default function ProductsPage() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <main className="page-container">
      {/* Mobile cart toggle */}
      <div className="cart-toggle-button">
        <button onClick={() => setIsCartOpen(true)}>🛒 View Cart</button>
      </div>

      <div className="product-cart-layout">
        {/* Product section */}
        <div className="product-section">
          <ProductGrid />
        </div>

        {/* Cart (desktop) */}
        <div className="cart-section desktop-only">
          <CartMenu />
        </div>
      </div>

      {/* Mobile slide-in cart */}
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
