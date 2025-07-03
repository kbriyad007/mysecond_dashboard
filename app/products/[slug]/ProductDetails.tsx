"use client";

import { useState } from "react";

interface ProductDetailsProps {
  product: {
    name?: string;
    price?: number | string;
    description?: string;
  };
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);

  const handleBuy = () => {
    alert(`🛒 Added ${quantity} ${product.name || "item"}(s) to cart!`);
  };

  return (
    <div
      style={{
        flex: "1 1 38%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "1.5rem",
        minWidth: "260px",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: 700,
          color: "#1f2937",
          margin: 0,
        }}
      >
        {product.name || "Unnamed Product"}
      </h1>

      <p
        style={{
          fontSize: "1.125rem",
          color: "#4b5563",
          lineHeight: 1.75,
        }}
      >
        {product.description || "No description available."}
      </p>

      {/* Price */}
      {product.price && (
        <p
          style={{
            fontSize: "1.5rem",
            fontWeight: 600,
            color: "#22c55e",
            margin: 0,
          }}
        >
          💰 ${product.price}
        </p>
      )}

      {/* Quantity and Buy Button */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* Quantity */}
        <div
          style={{
            display: "flex",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            overflow: "hidden",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            style={{
              background: "#f3f4f6",
              padding: "0.5rem 0.75rem",
              border: "none",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            −
          </button>
          <div style={{ padding: "0 1rem", minWidth: "2rem", textAlign: "center" }}>
            {quantity}
          </div>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            style={{
              background: "#f3f4f6",
              padding: "0.5rem 0.75rem",
              border: "none",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            ＋
          </button>
        </div>

        {/* Buy Now */}
        <button
          onClick={handleBuy}
          style={{
            backgroundColor: "#2563eb",
            color: "#fff",
            padding: "0.75rem 2rem",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)",
          }}
        >
          🛒 Buy Now
        </button>
      </div>
    </div>
  );
}
