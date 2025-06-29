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
          padding: "1rem",
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
          padding: "1.5rem 1rem",
          fontFamily: "'Inter', sans-serif",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        {products.map((product, i) => (
          <div
            key={i}
            style={{
              width: "240px",
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.05)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Image
              src={product.image?.filename || fallbackImage}
              alt={product.name || "Product image"}
              width={240}
              height={150}
              style={{ objectFit: "cover", width: "100%", height: "auto" }}
              quality={75}
              priority={i === 0}
            />

            <div style={{ padding: "0.75rem 1rem", flexGrow: 1 }}>
              <h2
                style={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "#0f172a",
                  marginBottom: "0.4rem",
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
                  fontSize: "0.75rem",
                  lineHeight: 1.4,
                  marginBottom: "0.6rem",
                  maxHeight: "40px",
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
                  fontSize: "0.9rem",
                  color: "#2563eb",
                  marginBottom: "0.8rem",
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
                  padding: "0.5rem 0",
                  background: "linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  boxShadow: "0 3px 8px rgba(59, 130, 246, 0.4)",
                }}
                aria-label={`Add ${product.name} to cart`}
              >
                🛒 Add to Cart
              </button>

              {addedToCartIndex === i && (
                <p
                  style={{
                    color: "#22c55e",
                    marginTop: "0.5rem",
                    fontSize: "0.75rem",
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
          0% { opacity: 0; transform: translateY(4px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(4px); }
        }

        @media (max-width: 1280px) {
          main > div {
            width: 22%;
          }
        }

        @media (max-width: 1024px) {
          main > div {
            width: 30%;
          }
        }

        @media (max-width: 768px) {
          main > div {
            width: 46%;
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
