"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface MyProduct {
  name: string;
  description: string;
  image?: { filename: string };
  price?: number | string;
  // removed 'body' field to avoid 'any' type
}

export default function Page() {
  const [product, setProduct] = useState<MyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const slug = "product"; // your Storyblok story slug, all lowercase

    const token = "UNyEawluuu4UVVnYIBUqPAtt"; // your public API token
    const url = `https://api.storyblok.com/v2/cdn/stories/${slug}?version=draft&token=${token}`;

    console.log(`📦 Fetching Storyblok content from: ${url}`);

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("✅ Storyblok content received:", data);

        const content = data.story?.content;

        if (!content) {
          setErrorMsg("❌ No content found in Storyblok response.");
          setProduct(null);
          return;
        }

        setProduct(content);
      })
      .catch((err) => {
        console.error("🚨 Fetch failed:", err);
        setErrorMsg(err.message);
        setProduct(null);
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
          <Image
            src={product.image.filename}
            alt={product.name || "Product image"}
            width={300}
            height={300}
            style={{ objectFit: "contain" }}
          />
        ) : (
          <p>⚠️ No product image found.</p>
        )}

        <p>{product.description || "No description available."}</p>

        <p>
          <strong>Price:</strong>{" "}
          {product.price !== undefined ? `$${product.price}` : "N/A"}
        </p>
      </div>
    </main>
  );
}
