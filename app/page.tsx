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

  if (loading)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "1.25rem",
          color: "#6b7280",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          backgroundColor: "#f3f4f6",
        }}
      >
        Loading product...
      </div>
    );

  if (errorMsg)
    return (
      <div
        style={{
          maxWidth: "400px",
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

  if (!product)
    return (
      <div
        style={{
          maxWidth: "400px",
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
        No product data available.
      </div>
    );

  const imageUrl =
    "https://a.storyblok.com/f/285405591159825/4032x2688/ca2804d8c3/image-couple-relaxing-tropical-beach-sunset-hotel-vacation-tourism.jpg";

  function handleAddToCart() {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "420px",
          width: "100%",
          backgroundColor: "white",
          borderRadius: "20px",
          boxShadow:
            "0 20px 30px rgba(14, 165, 233, 0.15), 0 10px 15px rgba(14, 165, 233, 0.1)",
          overflow: "hidden",
          transition: "transform 0.3s ease",
          cursor: "default",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "scale(1.02)";
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 30px 40px rgba(14, 165, 233, 0.25), 0 15px 25px rgba(14, 165, 233, 0.2)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 20px 30px rgba(14, 165, 233, 0.15), 0 10px 15px rgba(14, 165, 233, 0.1)";
        }}
      >
        <Image
          src={imageUrl}
          alt={product.name || "Product image"}
          width={420}
          height={250}
          style={{ objectFit: "cover", width: "100%", height: "auto" }}
          priority
        />

        <div style={{ padding: "1.5rem 2rem" }}>
          <h2
            style={{
              fontWeight: "800",
              fontSize: "1.75rem",
              color: "#0369a1",
              marginBottom: "0.5rem",
              userSelect: "none",
            }}
          >
            {product.name || "Unnamed Product"}
          </h2>

          <p
            style={{
              color: "#475569",
              fontSize: "1rem",
              lineHeight: 1.6,
              marginBottom: "1.25rem",
              minHeight: "70px",
              userSelect: "text",
            }}
          >
            {product.description}
          </p>

          <p
            style={{
              fontWeight: "700",
              fontSize: "1.25rem",
              color: "#0284c7",
              marginBottom: "1.75rem",
              userSelect: "none",
            }}
          >
            Price:{" "}
            {product.price !== undefined ? (
              <span
                style={{
                  color: "#059669",
                  fontWeight: "900",
                  fontSize: "1.5rem",
                }}
              >
                ${product.price}
              </span>
            ) : (
              "N/A"
            )}
          </p>

          <button
            onClick={handleAddToCart}
            style={{
              width: "100%",
              padding: "0.85rem 0",
              background:
                "linear-gradient(90deg, #0ea5e9 0%, #0284c7 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontWeight: "700",
              fontSize: "1.25rem",
              boxShadow:
                "0 8px 15px rgba(14, 165, 233, 0.5)",
              cursor: "pointer",
              transition:
                "background 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease",
              userSelect: "none",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "0.5rem",
              letterSpacing: "0.02em",
            }}
            aria-label="Add to cart"
            onMouseEnter={(e) => {
              const btn = e.currentTarget;
              btn.style.background =
                "linear-gradient(90deg, #0284c7 0%, #0369a1 100%)";
              btn.style.boxShadow =
                "0 12px 25px rgba(2, 132, 199, 0.7)";
              btn.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget;
              btn.style.background =
                "linear-gradient(90deg, #0ea5e9 0%, #0284c7 100%)";
              btn.style.boxShadow =
                "0 8px 15px rgba(14, 165, 233, 0.5)";
              btn.style.transform = "scale(1)";
            }}
          >
            🛒 Add to Cart
          </button>

          {addedToCart && (
            <p
              style={{
                color: "#059669",
                marginTop: "1rem",
                fontWeight: "700",
                fontSize: "1.125rem",
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

      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(10px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(10px); }
        }
      `}</style>
    </main>
  );
}
