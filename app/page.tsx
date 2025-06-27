"use client";

import { useEffect, useState } from "react";

interface MyProduct {
  name: string;
  description: string;
  image: { filename: string };
  price: number;
}

export default function Page() {
  const [product, setProduct] = useState<MyProduct | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url =
      "https://api.storyblok.com/v2/cdn/stories/product?version=draft&token=UNyEawluuu4UVVnYIBUqPAtt";

    console.log("📦 Fetching Storyblok content from:", url);

    fetch(url)
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          console.error("❌ Response error:", res.status, errorText);
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("✅ Storyblok content received:", data);
        setProduct(data.story.content);
      })
      .catch((err) => {
        console.error("🚨 Fetch failed:", err.message);
        setError(err.message);
        setProduct(null);
      });
  }, []);

  if (error) {
    return (
      <div style={{ color: "red", padding: "1rem" }}>
        <h2>⚠️ Error loading product</h2>
        <p>{error}</p>
        <p>
          Please check:
          <ul>
            <li>✅ Your Story slug is correct (e.g. `Product` vs `product`)</li>
            <li>✅ The Story is published</li>
            <li>✅ The token is valid</li>
          </ul>
        </p>
      </div>
    );
  }

  if (!product) return <div>⏳ Loading product...</div>;

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>🛍️ Product Details</h1>
      <div
        style={{
          border: "1px solid #ddd",
          padding: "1rem",
          borderRadius: "8px",
          maxWidth: "400px",
        }}
      >
        <h2>{product.name}</h2>
        <img
          src={product.image.filename}
          alt={product.name}
          style={{ width: "100%", maxWidth: "300px" }}
        />
        <p>{product.description}</p>
        <p>
          <strong>Price:</strong> ${product.price}
        </p>
      </div>
    </main>
  );
}
