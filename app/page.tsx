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
                Price: <span>${product.price ?? "N/A"}</span>
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
          padding: 2rem 1rem;
          background: linear-gradient(90deg, #f9fafb, #e4e7ec);
          font-family: "Inter", sans-serif;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 1.2rem;
          justify-content: center;
          align-content: start;
        }

        .card {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
          outline-offset: 4px;
          cursor: pointer;
        }

        .card:focus,
        .card:hover {
          box-shadow: 0 10px 24px rgba(37, 99, 235, 0.2);
          transform: translateY(-3px);
        }

        .image-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          border-radius: 16px 16px 0 0;
          overflow: hidden;
        }

        .card-body {
          padding: 1rem 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .card-title {
          font-weight: 700;
          font-size: 1rem;
          color: #0f172a;
          margin: 0 0 0.4rem 0;
          line-height: 1.3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-description {
          font-size: 0.82rem;
          line-height: 1.4;
          color: #475569;
          flex-grow: 1;
          margin: 0 0 0.8rem 0;
          overflow-wrap: anywhere;
        }

        .card-price {
          font-weight: 600;
          font-size: 0.95rem;
          color: #2563eb;
          margin-bottom: 1rem;
        }

        .card-price span {
          color: #16a34a;
          font-weight: 700;
        }

        .btn-add-cart {
          padding: 0.55rem 0;
          background: linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%);
          color: #ffffff;
          font-weight: 600;
          font-size: 0.85rem;
          border: none;
          border-radius: 8px;
          box-shadow: 0 3px 10px rgba(37, 99, 235, 0.4);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-add-cart:hover {
          background: linear-gradient(90deg, #1d4ed8 0%, #2563eb 100%);
          transform: translateY(-1px);
        }

        .btn-add-cart:active {
          transform: scale(0.98);
        }

        .btn-add-cart.added {
          background-color: #22c55e;
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.6);
        }

        .added-msg {
          margin-top: 0.4rem;
          font-size: 0.75rem;
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
            transform: translateY(5px);
          }
        }

        /* Show 2 cards per row even on smaller devices */
        @media (max-width: 480px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr);
            padding: 1rem;
            gap: 1rem;
          }

          .card-title {
            font-size: 0.95rem;
          }

          .card-description {
            font-size: 0.75rem;
          }

          .card-price {
            font-size: 0.85rem;
          }

          .btn-add-cart {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </>
  );
}
