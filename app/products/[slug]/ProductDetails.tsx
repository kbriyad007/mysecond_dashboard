/* eslint-disable react/prop-types */
"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductImage {
  filename?: string;
}

interface Product {
  name: string;
  description: string;
  price?: number | string;
  image?: ProductImage | string;
}

interface ProductDetailsClientProps {
  product: Product;
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const [quantity, setQuantity] = useState(1);

  const imageUrl =
    typeof product.image === "string"
      ? product.image.startsWith("//")
        ? `https:${product.image}`
        : product.image
      : product.image?.filename ?? null;

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleBuyNow = () => {
    alert(`You bought ${quantity} × ${product.name}`);
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "2rem",
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
        padding: "2rem",
        maxWidth: "1280px",
        margin: "0 auto",
      }}
    >
      {/* Left - Image */}
      <div
        style={{
          flex: "1 1 60%",
          minWidth: "300px",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          overflow: "hidden",
          position: "relative",
          aspectRatio: "4 / 3",
          backgroundColor: "#f3f4f6",
        }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name || "Product Image"}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9ca3af",
              fontSize: "1rem",
            }}
          >
            No image available
          </div>
        )}
      </div>

      {/* Right - Info */}
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
          {product.name}
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

        {/* Quantity and Buy Now */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            onClick={decrement}
            aria-label="Decrease quantity"
            style={{
              fontSize: "1.5rem",
              padding: "0.25rem 0.75rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              backgroundColor: "#f3f4f6",
              cursor: "pointer",
            }}
          >
            −
          </button>

          <input
            type="text"
            value={quantity}
            readOnly
            aria-label="Quantity"
            style={{
              width: "3rem",
              textAlign: "center",
              fontSize: "1.25rem",
              fontWeight: "600",
              borderRadius: "6px",
              border: "1px solid #ccc",
              padding: "0.25rem",
              userSelect: "none",
            }}
          />

          <button
            onClick={increment}
            aria-label="Increase quantity"
            style={{
              fontSize: "1.5rem",
              padding: "0.25rem 0.75rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              backgroundColor: "#f3f4f6",
              cursor: "pointer",
            }}
          >
            +
          </button>

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
              boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)",
              marginLeft: "auto",
            }}
          >
            🛒 Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
