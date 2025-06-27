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

  useEffect(() => {
    console.log("📦 Fetching Storyblok content...");
    fetch(
      "https://api.storyblok.com/v2/cdn/stories/product?version=draft&token=UNyEawluuu4UVVnYIBUqPAtt"
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Storyblok content received:", data);
        const content = data?.story?.content;
        const myProductBlock = content?.body?.[0]; // 👈 your MyProduct block
        setProduct(myProductBlock || null);
      })
      .catch((err) => {
        console.error("❌ Error fetching Storyblok content:", err);
        setProduct(null);
      });
  }, []);

  if (!product) return <div>Loading product...</div>;

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
        <h2>{product.name || "Unnamed Product"}</h2>
        {product.image?.filename ? (
          <img
            src={product.image.filename}
            alt={product.name}
            style={{ width: "100%", maxWidth: "300px" }}
          />
        ) : (
          <p>⚠️ No product image found.</p>
        )}
        <p>{product.description || "No description available."}</p>
        <p>
          <strong>Price:</strong> ${product.price ?? "N/A"}
        </p>
      </div>
    </main>
  );
}
