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
            background-color: #f9fafb;
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
                width={320}
                height={200}
                style={{ objectFit: "cover", borderRadius: "12px 12px 0 0" }}
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
                Price:{" "}
                <span>${product.price ?? "N/A"}</span>
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
        /* Container grid */
        .product-grid {
          min-height: 100vh;
          padding: 2rem 1.5rem;
          background: linear-gradient(90deg, #f9fafb, #e4e7ec);
          font-family: "Inter", sans-serif;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem 2rem;
          justify-content: center;
          align-content: start;
        }

        /* Card style */
        .card {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.3s ease, transform 0.3s ease;
          outline-offset: 4px;
          cursor: pointer;
        }
        .card:focus,
        .card:hover {
          box-shadow: 0 12px 32px rgba(59, 130, 246, 0.3);
          transform: translateY(-4px);
        }

        .image-wrapper {
          border-radius: 16px 16px 0 0;
          overflow: hidden;
          flex-shrink: 0;
        }

        /* Card body */
        .card-body {
          padding: 1.25rem 1.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        /* Title */
        .card-title {
          font-weight: 700;
          font-size: 1.15rem;
          color: #0f172a;
          margin: 0 0 0.5rem 0;
          line-height: 1.3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          user-select: text;
        }

        /* Description */
        .card-description {
          font-size: 0.875rem;
          line-height: 1.5;
          color: #475569;
          flex-grow: 1;
          margin: 0 0 1rem 0;
          user-select: text;
          overflow-wrap: anywhere;
        }

        /* Price */
        .card-price {
          font-weight: 600;
          font-size: 1rem;
          color: #2563eb;
          margin-bottom: 1.2rem;
        }
        .card-price span {
          color: #16a34a;
          font-weight: 700;
        }

        /* Button */
        .btn-add-cart {
          padding: 0.65rem 0;
          background: linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%);
          color: #ffffff;
          font-weight: 600;
          font-size: 0.9rem;
          border: none;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.45);
          cursor: pointer;
          transition: background 0.3s ease, box-shadow 0.3s ease, transform 0.15s ease;
          user-select: none;
        }
        .btn-add-cart:hover {
          background: linear-gradient(90deg, #1d4ed8 0%, #2563eb 100%);
          box-shadow: 0 6px 18px rgba(37, 99, 235, 0.65);
          transform: translateY(-2px);
        }
        .btn-add-cart:active {
          transform: translateY(0);
          box-shadow: 0 3px 9px rgba(37, 99, 235, 0.5);
        }
        .btn-add-cart.added {
          background-color: #22c55e;
          box-shadow: 0 4px 14px rgba(34, 197, 94, 0.6);
        }

        /* Added message */
        .added-msg {
          margin-top: 0.5rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: #22c55e;
          text-align: center;
          animation: fadeInOut 2s ease forwards;
          user-select: none;
        }

        /* Fade in/out animation */
        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: translateY(6px);
          }
          10% {
            opacity: 1;
            transform: translateY(0);
          }
          90% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(6px);
          }
        }

        /* Responsive tweaks */
        @media (max-width: 480px) {
          .product-grid {
            padding: 1rem 1rem 2rem;
            gap: 1.25rem 1.25rem;
          }
          .card {
            border-radius: 12px;
          }
          .btn-add-cart {
            border-radius: 8px;
          }
        }
      `}</style>
    </>
  );
}
