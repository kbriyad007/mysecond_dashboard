"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Update the type to reflect plain text, not rich text
interface MyProduct {
  component: string;
  name: string;
  description: string; // ✅ plain text instead of StoryblokRichText
  image?: { filename: string };
  price?: number | string;
}

export default function Page() {
  const [product, setProduct] = useState<MyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);

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

  // Handler for Add to Cart button
  function handleAddToCart() {
    setAddedToCart(true);
    // Reset message after 2 seconds
    setTimeout(() => setAddedToCart(false), 2000);
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: "1rem", color: "#111827" }}>🛍️ Product Details</h1>
      <div
        style={{
          border: "1px solid #e5e7eb",
          padding: "1.5rem",
          borderRadius: "12px",
          maxWidth: "400px",
          backgroundColor: "white",
          boxShadow: "0 4px 8px rgb(0 0 0 / 0.05)",
        }}
      >
        <h2 style={{ fontWeight: "700", fontSize: "1.5rem", marginBottom: "0.75rem", color: "#111827" }}>
          {product.name || "Unnamed Product"}
        </h2>

        <Image
          src={imageUrl}
          alt={product.name || "Product image"}
          width={1056}
          height={595}
          style={{ objectFit: "cover", borderRadius: "8px", marginBottom: "1rem" }}
        />

        <p style={{ color: "#4b5563", lineHeight: "1.5", marginBottom: "1rem" }}>
          {product.description}
        </p>

        <p style={{ fontWeight: "600", fontSize: "1.125rem", marginBottom: "1.5rem", color: "#111827" }}>
          Price:{" "}
          {product.price !== undefined ? (
            <span style={{ color: "#10b981" }}>${product.price}</span>
          ) : (
            "N/A"
          )}
        </p>

        <button
          onClick={handleAddToCart}
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "1.125rem",
            boxShadow: "0 4px 6px rgba(59, 130, 246, 0.5)",
            transition: "background-color 0.3s ease, box-shadow 0.3s ease",
          }}
          aria-label="Add to cart"
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#2563eb";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 12px rgba(37, 99, 235, 0.6)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#3b82f6";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 6px rgba(59, 130, 246, 0.5)";
          }}
        >
          Add to Cart
        </button>

        {addedToCart && (
          <p style={{ color: "#10b981", marginTop: "0.75rem", fontWeight: "600", textAlign: "center" }}>
            ✔️ Added to cart!
          </p>
        )}
      </div>
    </main>
  );
}
