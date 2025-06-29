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
          setErrorMsg("❌ No product blocks found in content.body.");
          return;
        }
        setProducts(body as MyProduct[]);
      })
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setLoading(false));
  }, []);

  const fallbackImage =
    "https://a.storyblok.com/f/285405591159825/4032x2688/ca2804d8c3/image-couple-relaxing-tropical-beach-sunset-hotel-vacation-tourism.jpg";

  const handleAddToCart = (index: number) => {
    setAddedToCartIndex(index);
    setTimeout(() => setAddedToCartIndex(null), 2000);
  };

  const cardWidth = 240;
  const cardHeight = cardWidth * 1.618 * 1.2; // 20% taller than golden ratio

  if (loading || errorMsg || products.length === 0) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "0.9rem",
          fontFamily: "'Inter', sans-serif",
          backgroundColor: "#f1f5f9",
          color: errorMsg ? "#b91c1c" : "#64748b",
          padding: "1.5rem",
          textAlign: "center",
        }}
      >
        {errorMsg
          ? `❌ Error: ${errorMsg}`
          : products.length === 0
          ? "No products available."
          : "Loading products..."}
      </div>
    );
  }

  return (
    <>
      <main
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to right, #f8fafc, #e2e8f0)",
          padding: "1.5rem",
          fontFamily: "'Inter', sans-serif",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "1.25rem",
        }}
      >
        {products.map((product, i) => (
          <div
            key={i}
            style={{
              width: `${cardWidth}px`,
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.2s ease",
            }}
          >
            <Image
              src={product.image?.filename || fallbackImage}
              alt={product.name || "Product image"}
              width={cardWidth}
              height={cardHeight}
              style={{ objectFit: "cover", width: "100%", height: "auto" }}
              quality={80}
              priority={i === 0}
            />

            <div style={{ padding: "1rem", flexGrow: 1 }}>
              <h2
                style={{
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  color: "#0f172a",
                  marginBottom: "0.5rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={product.name}
              >
                {product.name || "Unnamed Product"}
              </h2>

              <p
                style={{
                  color: "#64748b",
                  fontSize: "0.8rem",
                  lineHeight: 1.5,
                  marginBottom: "0.75rem",
                  maxHeight: "50px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={product.description}
              >
                {product.description}
              </p>

              <p
                style={{
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  color: "#2563eb",
                  marginBottom: "0.75rem",
                }}
              >
                Price:{" "}
                <span style={{ color: "#16a34a", fontWeight: 700 }}>
                  ${product.price ?? "N/A"}
                </span>
              </p>

              <button
                onClick={() => handleAddToCart(i)}
                style={{
                  width: "100%",
                  padding: "0.55rem 0",
                  background:
                    "linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  boxShadow: "0 4px 10px rgba(59, 130, 246, 0.4)",
                  transition: "all 0.25s ease",
                }}
              >
                🛒 Add to Cart
              </button>

              {addedToCartIndex === i && (
                <p
                  style={{
                    color: "#22c55e",
                    marginTop: "0.6rem",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    textAlign: "center",
                    animation: "fadeInOut 2s ease",
                  }}
                >
                  ✔️ Added!
                </p>
              )}
            </div>
          </div>
        ))}
      </main>

      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(5px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(5px); }
        }

        @media (max-width: 1280px) {
          main > div {
            width: 22%;
          }
        }

        @media (max-width: 1024px) {
          main > div {
            width: 29%;
          }
        }

        @media (max-width: 768px) {
          main > div {
            width: 45%;
          }
        }

        @media (max-width: 480px) {
          main > div {
            width: 90%;
          }
        }
      `}</style>
    </>
  );
}
