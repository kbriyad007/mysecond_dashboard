"use client";

import { useState } from "react";

export default function ProductDetails({
  product,
  slug,
}: {
  product: any;
  slug: string;
}) {
  const [quantity, setQuantity] = useState(1);

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleBuyNow = () => {
    alert(
      `You clicked Buy Now for "${product.name || slug}" with quantity ${quantity}!`
    );
    // Replace alert with your actual checkout or cart logic
  };

  return (
    <div
      style={{
        flex: "1 1 38%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "1.5rem",
        minWidth: "280px",
        maxWidth: "600px",
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
        {product.name || slug}
      </h1>

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

      <p
        style={{
          fontSize: "1.125rem",
          color: "#4b5563",
          lineHeight: 1.75,
        }}
      >
        {product.description || "No description available."}
      </p>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          marginTop: "1rem",
        }}
      >
        {/* Quantity selector */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            overflow: "hidden",
            width: "130px",
          }}
        >
          <button
            onClick={decrement}
            style={{
              backgroundColor: "#e2e8f0",
              border: "none",
              padding: "0.5rem 0.75rem",
              cursor: "pointer",
              fontSize: "1.25rem",
              userSelect: "none",
              color: "#475569",
            }}
            aria-label="Decrease quantity"
          >
            –
          </button>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => {
              let val = parseInt(e.target.value);
              if (isNaN(val) || val < 1) val = 1;
              setQuantity(val);
            }}
            style={{
              width: "50px",
              textAlign: "center",
              border: "none",
              fontSize: "1rem",
              padding: "0.5rem 0",
              outline: "none",
              userSelect: "none",
            }}
            aria-label="Quantity"
          />
          <button
            onClick={increment}
            style={{
              backgroundColor: "#e2e8f0",
              border: "none",
              padding: "0.5rem 0.75rem",
              cursor: "pointer",
              fontSize: "1.25rem",
              userSelect: "none",
              color: "#475569",
            }}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        {/* Buy Now button */}
        <button
          onClick={handleBuyNow}
          style={{
            backgroundColor: "#2563eb",
            color: "#fff",
            padding: "0.75rem 2rem",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            opacity: 1,
            boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#1d4ed8")
          }
          onMouseLeave={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#2563eb")
          }
          aria-label="Buy Now"
        >
          🛒 Buy Now
        </button>
      </div>
    </div>
  );
}
