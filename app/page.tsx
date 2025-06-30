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
      <div className="status-message">
        {errorMsg
          ? `❌ Error: ${errorMsg}`
          : products.length === 0
          ? "No products available."
          : "Loading products..."}
        <style jsx>{`
          .status-message {
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1rem;
            font-family: "Inter", sans-serif;
            background-color: #f8fafc;
            color: ${errorMsg ? "#dc2626" : "#6b7280"};
            padding: 1rem;
            text-align: center;
            user-select: none;
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <main className="product-grid">
        {products.map((product, i) => (
          <article key={i} className="card" tabIndex={0}>
            <div className="image-wrapper">
              <Image
                src={product.image?.filename || fallbackImage}
                alt={product.name || "Product image"}
                fill
                style={{ objectFit: "cover" }}
                quality={85}
                priority={i === 0}
                draggable={false}
              />
            </div>

            <div className="card-body">
              <h2 className="card-title">{product.name || "Unnamed Product"}</h2>
              <p className="card-description">{product.description}</p>
              <p className="card-price">Price: <span>${product.price ?? "N/A"}</span></p>

              <button
                onClick={() => handleAddToCart(i)}
                className={`btn-add-cart ${addedToCartIndex === i ? "added" : ""}`}
              >
                🛒 Add to Cart
              </button>

              {addedToCartIndex === i && (
                <p className="added-msg">✔️ Added!</p>
              )}
            </div>
          </article>
        ))}
      </main>

      <style jsx>{`
        .product-grid {
          min-height: 100vh;
          padding: 3rem 1.5rem;
          background-color: #f3f4f6;
          font-family: "Inter", sans-serif;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
        }

        .card {
          background-color: #ffffffcc;
          backdrop-filter: blur(6px);
          border: 1px solid #d1d5db;
          border-radius: 16px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }

        .image-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          overflow: hidden;
        }

        .card-body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
        }

        .card-title {
          font-weight: 600;
          font-size: 1rem;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .card-description {
          font-size: 0.85rem;
          color: #6b7280;
          margin-bottom: 1rem;
          flex-grow: 1;
        }

        .card-price {
          font-size: 0.9rem;
          color: #4b5563;
          margin-bottom: 1rem;
        }

        .card-price span {
          font-weight: 600;
          color: #111827;
        }

        .btn-add-cart {
          padding: 0.6rem 0;
          background-color: #1f2937;
          color: #ffffff;
          font-size: 0.85rem;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .btn-add-cart:hover {
          background-color: #374151;
        }

        .btn-add-cart.added {
          background-color: #16a34a;
        }

        .added-msg {
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: #16a34a;
          text-align: center;
          animation: fadeInOut 2s ease;
        }

        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: translateY(5px);
          }
          10%,
          90% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(5px);
          }
        }

        @media (max-width: 480px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr);
            padding: 1.5rem 1rem;
          }

          .card-title {
            font-size: 0.95rem;
          }

          .card-description {
            font-size: 0.75rem;
          }

          .card-price {
            font-size: 0.8rem;
          }

          .btn-add-cart {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </>
  );
}
