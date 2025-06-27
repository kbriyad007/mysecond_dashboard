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
    fetch(
      "https://api.storyblok.com/v2/cdn/stories/Product?version=draft&token=SySd6YFXHDQzNOBoSFcvrQtt"
    )
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.story.content);
      })
      .catch(() => setProduct(null));
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
