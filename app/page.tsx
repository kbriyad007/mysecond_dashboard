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
          fontSize: "0.8rem",
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
          maxWidth: "280px",
          margin: "3rem auto",
          padding: "0.8rem",
          backgroundColor: "#fee2e2",
          borderRadius: "10px",
          color: "#b91c1c",
          fontWeight: "600",
          fontFamily: "'Inter', sans-serif",
          boxShadow: "0 3px 8px rgb(185 28 28 / 0.15)",
          textAlign: "center",
          fontSize: "0.9rem",
        }}
      >
        ❌ <strong>Error:</strong> {errorMsg}
      </div>
    );

  if (products.length === 0)
    return (
      <div
        style={{
          maxWidth: "280px",
          margin: "3rem auto",
          padding: "0.8rem",
          backgroundColor: "#fef3c7",
          borderRadius: "10px",
          color: "#92400e",
          fontWeight: "600",
          fontFamily: "'Inter', sans-serif",
          boxShadow: "0 3px 8px rgb(146 64 14 / 0.15)",
          textAlign: "center",
          fontSize: "0.9rem",
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
          background: "linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)",
          padding: "1rem",
          fontFamily: "'Inter', sans-serif",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        {products.map((product, i) => (
          <div
            key={i}
            style={{
              flex: "1 1 calc(19% - 0.75rem)", // ~5 items per row with gap
              maxWidth: "19%",
              backgroundColor: "white",
              borderRadius: "10px",
              boxShadow: "0 6px 15px rgba(0,0,0,0.07)",
              overflow: "hidden",
              userSelect: "none",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Image
              src={product.image?.filename || fallbackImage}
              alt={product.name || "Product image"}
              width={240}
              height={140}
              style={{ objectFit: "cover", width: "100%", height: "auto" }}
              priority={i === 0}
              quality={75}
            />

            <div style={{ padding: "0.5rem 0.75rem", flexGrow: 1 }}>
              <h2
                style={{
                  fontWeight: "700",
                  fontSize: "1rem",
                  color: "#1e40af",
                  marginBottom: "0.25rem",
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
                  color: "#475569",
                  fontSize: "0.7rem",
                  lineHeight: 1.3,
                  marginBottom: "0.5rem",
                  height: "40px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={product.description}
              >
                {product.description}
              </p>

              <p
                style={{
                  fontWeight: "700",
                  fontSize: "0.85rem",
                  color: "#2563eb",
                  marginBottom: "0.8rem",
                }}
              >
                Price:{" "}
                {product.price !== undefined ? (
                  <span
                    style={{
                      color: "#16a34a",
                      fontWeight: "800",
                      fontSize: "1rem",
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
                  padding: "0.4rem 0",
                  background:
                    "linear-gradient(90deg, #2563eb 0%, #1e40af 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "700",
                  fontSize: "0.85rem",
                  boxShadow: "0 3px 8px rgba(37, 99, 235, 0.5)",
                  cursor: "pointer",
                  transition: "background 0.25s ease, box-shadow 0.25s ease",
                  userSelect: "none",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "0.2rem",
                  letterSpacing: "0.02em",
                }}
                aria-label={`Add ${product.name} to cart`}
                onMouseEnter={(e) => {
                  const btn = e.currentTarget;
                  btn.style.background =
                    "linear-gradient(90deg, #1e40af 0%, #1e3a8a 100%)";
                  btn.style.boxShadow = "0 5px 10px rgba(30, 64, 175, 0.7)";
                }}
                onMouseLeave={(e) => {
                  const btn = e.currentTarget;
                  btn.style.background =
                    "linear-gradient(90deg, #2563eb 0%, #1e40af 100%)";
                  btn.style.boxShadow = "0 3px 8px rgba(37, 99, 235, 0.5)";
                }}
              >
                🛒 Add
              </button>

              {addedToCartIndex === i && (
                <p
                  style={{
                    color: "#16a34a",
                    marginTop: "0.5rem",
                    fontWeight: "700",
                    fontSize: "0.8rem",
                    textAlign: "center",
                    userSelect: "none",
                    animation: "fadeInOut 2s forwards",
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

        @media (max-width: 1200px) {
          main > div {
            flex: 1 1 calc(33.33% - 0.75rem);
            max-width: calc(33.33% - 0.75rem);
          }
        }

        @media (max-width: 768px) {
          main > div {
            flex: 1 1 calc(50% - 0.75rem);
            max-width: calc(50% - 0.75rem);
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
