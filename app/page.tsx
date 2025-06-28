"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { renderRichText } from "@storyblok/react";

interface MyProduct {
  component: string;
  name: string;
  description: unknown; // loose typing for compatibility
  image?: { filename: string }; // expects hashed filename, e.g. "73e848c834"
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
    console.log(`📦 Fetching Storyblok content from: ${url}`);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("✅ Storyblok content received:", data);

        const body = data.story?.content?.body;
        if (!body || !Array.isArray(body) || body.length === 0) {
          setErrorMsg("❌ No product block found in content.body.");
          return;
        }

        setProduct(body[0] as MyProduct);
      })
      .catch((err) => {
        console.error("🚨 Fetch failed:", err);
        setErrorMsg(err.message);
      })
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

  // Storyblok base URL and desired image size
  const baseUrl = "https://a.storyblok.com/f/285405591159825";
  const width = 1056; // adjust as needed
  const height = 595; // adjust as needed

  // Build full image URL only if image.filename exists
  const imageUrl = product.image?.filename
    ? `${baseUrl}/${width}x${height}/${product.image.filename}`
    : null;

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

        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name || "Product image"}
            width={width}
            height={height}
            style={{ objectFit: "contain" }}
          />
        ) : (
          <p>⚠️ No product image found.</p>
        )}

        {/* Rich Text Render */}
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <div>{renderRichText(product.description as any)}</div>

        <p>
          <strong>Price:</strong>{" "}
          {product.price !== undefined ? `$${product.price}` : "N/A"}
        </p>
      </div>
    </main>
  );
}
