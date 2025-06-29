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
          color: "#94a3b8",
          fontFamily: "'Inter', sans-serif",
          backgroundColor: "#f1f5f9",
        }}
      >
        Loading products...
      </div>
    );

  if (errorMsg)
    return (
      <div
        style={{
          maxWidth: "300px",
          margin: "3rem auto",
          padding: "1rem",
          backgroundColor: "#fee2e2",
          borderRadius: "10px",
          color: "#b91c1c",
          fontWeight: "600",
          fontFamily: "'Inter', sans-serif",
          textAlign: "center",
          fontSize: "0.95rem",
        }}
      >
        ❌ <strong>Error:</strong> {errorMsg}
      </div>
    );

  if (products.length === 0)
    return (
      <div
        style={{
          maxWidth: "300px",
          margin: "3rem auto",
          padding: "1rem",
          backgroundColor: "#fef3c7",
          borderRadius: "10px",
          color: "#92400e",
          fontWeight: "600",
          fontFamily: "'Inter', sans-serif",
          textAlign: "center",
          fontSize: "0.95rem",
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
          gap: "1rem",
        }}
      >
        {products.map((product, i) => (
          <div
            key={i}
            style={{
              flex: "1 1 calc(19% - 1rem)",
              maxWidth: "19%",
              backgroundColor: "#fff",
              borderRadius: "14px",
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
              width={320}
              height={200}
              style={{ objectFit: "cover", width: "100%", height: "auto" }}
              quality={75}
              priority={i === 0}
            />

            <div style={{ padding: "1rem", flexGrow: 1 }}>
              <h2
                style={{
                  fontWeight: "700",
                  fontSize: "1.1rem",
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
                  fontSize: "0.8rem",
                  lineHeight: 1.5,
                  marginBottom: "0.8rem",
                  maxHeight: "60px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={product.description}
              >
                {product.description}
              </p>

              <p
                style={{
                  fontWeight: "600",
                  fontSize: "1rem",
                  color: "#2563eb",
                  marginBottom: "1rem",
                }}
              >
                Price:{" "}
                <span style={{ color: "#16a34a", fontWeight: "700" }}>
                  ${product.price ?? "N/A"}
                </span>
              </p>

              <button
                onClick={() => handleAddToCart(i)}
                style={{
                  width: "100%",
                  padding: "0.6rem 0",
                  background: "linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  boxShadow: "0 4px 10px rgba(59, 130, 246, 0.4)",
                }}
                aria-label={`Add ${product.name} to cart`}
              >
                🛒 Add to Cart
              </button>

              {addedToCartIndex === i && (
                <p
                  style={{
                    color: "#22c55e",
                    marginTop: "0.6rem",
                    fontSize: "0.8rem",
                    fontWeight: "600",
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
            flex: 1 1 calc(25% - 1rem);
            max-width: calc(25% - 1rem);
          }
        }

        @media (max-width: 1024px) {
          main > div {
            flex: 1 1 calc(33.33% - 1rem);
            max-width: calc(33.33% - 1rem);
          }
        }

        @media (max-width: 768px) {
          main > div {
            flex: 1 1 calc(50% - 1rem);
            max-width: calc(50% - 1rem);
          }
        }

        @media (max-width: 480px) {
          main > div {
            flex: 1 1 100%;
            max-width: 100%;
          }
        }
      `}</style>
    </>
  );
}
