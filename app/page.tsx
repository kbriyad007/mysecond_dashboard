"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface MyProduct {
  component: string;
  name: string;
  description: string;
  image?: { filename: string };
  price?: number | string;
}

export default function Page() {
  const [products, setProducts] = useState<MyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [addedToCartIndex, setAddedToCartIndex] = useState<number | null>(null);

  useEffect(() => {
    const slug = "product"; // or your story slug with multiple products in content.body
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
          setErrorMsg("❌ No product blocks found in content.body.");
          return;
        }
        setProducts(body as MyProduct[]);
      })
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "1rem",
          color: "#6b7280",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          backgroundColor: "#f3f4f6",
        }}
      >
        Loading products...
      </div>
    );

  if (errorMsg)
    return (
      <div
        style={{
          maxWidth: "360px",
          margin: "3rem auto",
          padding: "1rem",
          backgroundColor: "#fee2e2",
          borderRadius: "8px",
          color: "#b91c1c",
          fontWeight: "600",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          boxShadow: "0 4px 8px rgb(185 28 28 / 0.1)",
          textAlign: "center",
        }}
      >
        ❌ <strong>Error:</strong> {errorMsg}
      </div>
    );

  if (products.length === 0)
    return (
      <div
        style={{
          maxWidth: "360px",
          margin: "3rem auto",
          padding: "1rem",
          backgroundColor: "#fef3c7",
          borderRadius: "8px",
          color: "#92400e",
          fontWeight: "600",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          boxShadow: "0 4px 8px rgb(146 64 14 / 0.1)",
          textAlign: "center",
        }}
      >
        No products available.
      </div>
    );

  // Fallback image URL for all products (replace with your product.image.filename if available)
  const fallbackImage =
    "https://a.storyblok.com/f/285405591159825/4032x2688/ca2804d8c3/image-couple-relaxing-tropical-beach-sunset-hotel-vacation-tourism.jpg";

  function handleAddToCart(index: number) {
    setAddedToCartIndex(index);
    setTimeout(() => setAddedToCartIndex(null), 2000);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
        padding: "1.5rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: "1.5rem",
      }}
    >
      {products.map((product, i) => (
        <div
          key={i}
          style={{
            maxWidth: "360px",
            width: "100%",
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow:
              "0 15px 25px rgba(14, 165, 233, 0.15), 0 7px 15px rgba(14, 165, 233, 0.1)",
            overflow: "hidden",
            userSelect: "none",
            flex: "1 1 360px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Image
            src={product.image?.filename || fallbackImage}
            alt={product.name || "Product image"}
            width={360}
            height={215}
            style={{ objectFit: "cover", width: "100%", height: "auto" }}
            priority={i === 0}
          />

          <div style={{ padding: "1rem 1.5rem", flexGrow: 1 }}>
            <h2
              style={{
                fontWeight: "700",
                fontSize: "1.4rem",
                color: "#0369a1",
                marginBottom: "0.4rem",
              }}
            >
              {product.name || "Unnamed Product"}
            </h2>

            <p
              style={{
                color: "#475569",
                fontSize: "0.9rem",
                lineHeight: 1.5,
                marginBottom: "1rem",
                minHeight: "60px",
                userSelect: "text",
              }}
            >
              {product.description}
            </p>

            <p
              style={{
                fontWeight: "700",
                fontSize: "1.1rem",
                color: "#0284c7",
                marginBottom: "1.25rem",
              }}
            >
              Price:{" "}
              {product.price !== undefined ? (
                <span
                  style={{
                    color: "#059669",
                    fontWeight: "800",
                    fontSize: "1.3rem",
                  }}
                >
                  ${product.price}
                </span>
              ) : (
                "N/A"
              )}
            </p>

            <button
              onClick={() => handleAddToCart(i)}
              style={{
                width: "100%",
                padding: "0.7rem 0",
                background:
                  "linear-gradient(90deg, #0ea5e9 0%, #0284c7 100%)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontWeight: "700",
                fontSize: "1.1rem",
                boxShadow: "0 6px 12px rgba(14, 165, 233, 0.5)",
                cursor: "pointer",
                transition: "background 0.3s ease, box-shadow 0.3s ease",
                userSelect: "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.4rem",
                letterSpacing: "0.02em",
              }}
              aria-label={`Add ${product.name} to cart`}
              onMouseEnter={(e) => {
                const btn = e.currentTarget;
                btn.style.background =
                  "linear-gradient(90deg, #0284c7 0%, #0369a1 100%)";
                btn.style.boxShadow = "0 8px 18px rgba(2, 132, 199, 0.7)";
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget;
                btn.style.background =
                  "linear-gradient(90deg, #0ea5e9 0%, #0284c7 100%)";
                btn.style.boxShadow = "0 6px 12px rgba(14, 165, 233, 0.5)";
              }}
            >
              🛒 Add to Cart
            </button>

            {addedToCartIndex === i && (
              <p
                style={{
                  color: "#059669",
                  marginTop: "0.9rem",
                  fontWeight: "700",
                  fontSize: "1rem",
                  textAlign: "center",
                  userSelect: "none",
                  animation: "fadeInOut 2s forwards",
                }}
              >
                ✔️ Added to cart!
              </p>
            )}
          </div>
        </div>
      ))}

      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(6px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(6px); }
        }
      `}</style>
    </main>
  );
}
