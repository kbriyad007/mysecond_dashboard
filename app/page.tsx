"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { renderRichText } from "@storyblok/react";

// Minimal custom type for Storyblok rich text data
type StoryblokRichText = {
  type: string;
  content?: StoryblokRichText[];
  text?: string;
  attrs?: Record<string, unknown>;
};

interface MyProduct {
  component: string;
  name: string;
  description: StoryblokRichText; // Use custom type here
  image?: { filename: string };
  price?: number | string;
}

export default function Page() {
  const [product, setProduct] = useState<MyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const slug = "product";
    const token = process.env.NEXT_PUBLIC_STORYBLOK_TOKEN;

    if (!token) {
      setErrorMsg("❌ Storyblok token not found in environment variables.");
      setLoading(false);
      return;
    }

    const url = `https://api.storyblok.com/v2/cdn/stories/${slug}?version=draft&token=${token}`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const body = data.story?.content?.body;
        if (!body || !Array.isArray(body) || body.length === 0) {
          setErrorMsg("❌ No product block found in content.body.");
          return;
        }
        setProduct(body[0] as MyProduct);
      })
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading product...</div>;

  if (errorMsg)
    return (
      <div style={{ color: "red", padding: "1rem" }}>
        <strong>Error:</strong> {errorMsg}
      </div>
    );

  if (!product) return <div>No product data available.</div>;

  // Use a hardcoded image URL for testing
  const imageUrl =
    "https://a.storyblok.com/f/285405591159825/4032x2688/ca2804d8c3/image-couple-relaxing-tropical-beach-sunset-hotel-vacation-tourism.jpg";

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

        <Image
          src={imageUrl}
          alt={product.name || "Product image"}
          width={1056}
          height={595}
          style={{ objectFit: "cover" }}
        />

        {/* Disable TypeScript error for this line */}
        {/* @ts-expect-error */}
        <div>{renderRichText(product.description)}</div>

        <p>
          <strong>Price:</strong>{" "}
          {product.price !== undefined ? `$${product.price}` : "N/A"}
        </p>
      </div>
    </main>
  );
}
