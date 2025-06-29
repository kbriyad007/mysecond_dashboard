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
    const slug = "product"; // your story slug
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
          fontSize: "0.9rem",
          color: "#9ca3af",
          fontFamily: "'Inter', sans-serif",
          backgroundColor: "#f8fafc",
        }}
      >
        Loading products...
      </div>
    );

  if (errorMsg)
    return (
      <div
        style={{
          maxWidth: "320px",
          margin: "3rem auto",
          padding: "1rem",
          backgroundColor: "#fee2e2",
          borderRadius: "10px",
          color: "#b91c1c",
          fontWeight: "600",
          fontFamily: "'Inter', sans-serif",
          boxShadow: "0 3px 8px rgb(185 28 28 / 0.15)",
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
          maxWidth: "320px",
          margin: "3rem auto",
          padding: "1rem",
          backgroundColor: "#fef3c7",
          borderRadius: "10px",
          color: "#92400e",
          fontWeight: "600",
          fontFamily: "'Inter', sans-serif",
          boxShadow: "0 3px 8px rgb(146 64 14 / 0.15)",
          textAlign: "center",
        }}
      >
        No products available.
      </div>
    );

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
        background: "linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)",
        padding: "1rem",
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: "1rem",
      }}
    >
      {products.map((product, i) => (
        <div
          key={i}
          style={{
            maxWidth: "320px",
            width: "100%",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.05)",
            overflow: "hidden",
            userSelect: "none",
            flex: "1 1 320px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Image
            src={product.image?.filename || fallbackImage}
            alt={product.name || "Product image"}
            width={320}
            height={190}
            style={{ objectFit: "cover", width: "100%", height: "auto" }}
            priority={i === 0}
          />

          <div style={{ padding: "0.75rem 1.25rem", flexGrow: 1 }}>
            <h2
              style={{
                fontWeight: "700",
                fontSize: "1.25rem",
                color: "#1e40af",
                marginBottom: "0.35rem",
              }}
            >
              {product.name || "Unnamed Product"}
            </h2>

            <p
              style={{
                color: "#475569",
                fontSize: "0.85rem",
                lineHeight: 1.4,
                marginBottom: "0.9rem",
                minHeight: "55px",
                userSelect: "text",
              }}
            >
              {product.description}
            </p>

            <p
              style={{
                fontWeight: "700",
                fontSize: "1rem",
                color: "#2563eb",
                marginBottom: "1rem",
              }}
            >
              Price:{" "}
              {product.price !== undefined ? (
                <span
                  style={{
                    color: "#16a34a",
                    fontWeight: "800",
                    fontSize: "1.15rem",
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
                padding: "0.55rem 0",
                background:
                  "linear-gradient(90deg, #2563eb 0%, #1e40af 100%)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "700",
                fontSize: "1rem",
                boxShadow: "0 4px 10px rgba(37, 99, 235, 0.5)",
                cursor: "pointer",
                transition: "background 0.25s ease, box-shadow 0.25s ease",
                userSelect: "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.3rem",
                letterSpacing: "0.02em",
              }}
              aria-label={`Add ${product.name} to cart`}
              onMouseEnter={(e) => {
                const btn = e.currentTarget;
                btn.style.background =
                  "linear-gradient(90deg, #1e40af 0%, #1e3a8a 100%)";
                btn.style.boxShadow = "0 6px 14px rgba(30, 64, 175, 0.7)";
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget;
                btn.style.background =
                  "linear-gradient(90deg, #2563eb 0%, #1e40af 100%)";
                btn.style.boxShadow = "0 4px 10px rgba(37, 99, 235, 0.5)";
              }}
            >
              🛒 Add to Cart
            </button>

            {addedToCartIndex === i && (
              <p
                style={{
                  color: "#16a34a",
                  marginTop: "0.7rem",
                  fontWeight: "700",
                  fontSize: "0.9rem",
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
