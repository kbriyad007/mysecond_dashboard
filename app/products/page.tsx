"use client";

import { useState } from "react";
import ProductGrid from "./ProductGrid";
import CartMenu from "../components/CartMenu";
import "./ProductsPage.css"; // Make sure this file exists

export default function ProductsPage() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <main className="page-container">
      {/* Cart toggle for mobile */}
      <div className="cart-toggle-button">
        <button onClick={() => setIsCartOpen(true)}>🛒 View Cart</button>
      </div>

      <div className="product-cart-layout">
        {/* Products section */}
        <div className="product-section">
          <ProductGrid />
        </div>

        {/* Cart (desktop view only) */}
        <div className="cart-section desktop-only">
          <CartMenu />
        </div>
      </div>

      {/* Mobile cart drawer */}
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
