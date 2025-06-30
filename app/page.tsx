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
            font-size: 1.1rem;
            font-family: "Inter", sans-serif;
            background: linear-gradient(to right, #f8fafc, #e2e8f0);
            color: ${errorMsg ? "#dc2626" : "#64748b"};
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
          <article key={i} className="card" tabIndex={0} aria-label={product.name || "Product"}>
            <div className="image-wrapper">
              <Image
                src={product.image?.filename || fallbackImage}
                alt={product.name || "Product image"}
                fill
                style={{ objectFit: "cover" }}
                quality={80}
                priority={i === 0}
                draggable={false}
              />
            </div>

            <div className="card-body">
              <h2 title={product.name} className="card-title">
                {product.name || "Unnamed Product"}
              </h2>

              <p title={product.description} className="card-description">
                {product.description}
              </p>

              <p className="card-price">
                💵 <span>${product.price ?? "N/A"}</span>
              </p>

              <button
                onClick={() => handleAddToCart(i)}
                className={`btn-add-cart ${addedToCartIndex === i ? "added" : ""}`}
                aria-label={`Add ${product.name} to cart`}
              >
                🛒 Add to Cart
              </button>

              {addedToCartIndex === i && <p className="added-msg">✔️ Added!</p>}
            </div>
          </article>
        ))}
      </main>

      <style jsx>{`
        .product-grid {
          min-height: 100vh;
          padding: 3rem 1.5rem;
          background: linear-gradient(to right, #f0f4f8, #e0f2fe);
          font-family: "Inter", sans-serif;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.6rem;
        }

        .card {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(12px);
          border-radius: 20px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 32px rgba(37, 99, 235, 0.15);
        }

        .image-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          border-radius: 20px 20px 0 0;
          overflow: hidden;
        }

        .card-body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .card-title {
          font-weight: 700;
          font-size: 1.1rem;
          color: #1e293b;
          margin: 0 0 0.5rem 0;
          line-height: 1.3;
        }

        .card-description {
          font-size: 0.9rem;
          line-height: 1.5;
          color: #475569;
          flex-grow: 1;
          margin-bottom: 1rem;
        }

        .card-price {
          font-weight: 500;
          font-size: 0.95rem;
          color: #2563eb;
          margin-bottom: 1rem;
        }

        .card-price span {
          color: #16a34a;
          font-weight: 700;
        }

        .btn-add-cart {
          padding: 0.6rem 0;
          background: linear-gradient(to right, #3b82f6, #2563eb);
          color: #ffffff;
          font-weight: 600;
          font-size: 0.88rem;
          border: none;
          border-radius: 10px;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-add-cart:hover {
          transform: translateY(-2px);
          background: linear-gradient(to right, #2563eb, #1d4ed8);
        }

        .btn-add-cart.added {
          background-color: #22c55e;
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.6);
        }

        .added-msg {
          margin-top: 0.6rem;
          font-size: 0.78rem;
          font-weight: 600;
          color: #22c55e;
          text-align: center;
          animation: fadeInOut 2s ease forwards;
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
            padding: 1.5rem;
            gap: 1rem;
          }

          .card-title {
            font-size: 1rem;
          }

          .card-description {
            font-size: 0.8rem;
          }

          .card-price {
            font-size: 0.9rem;
          }

          .btn-add-cart {
            font-size: 0.78rem;
          }
        }
      `}</style>
    </>
  );
}
