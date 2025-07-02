"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface MyProduct {
  name: string;
  description: string;
  price?: number | string;
  image?: { filename: string };
  slug?: string; // added for linking
}

export default function Page() {
  const [products, setProducts] = useState<MyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [addedToCartIndex, setAddedToCartIndex] = useState<number | null>(null);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_STORYBLOK_TOKEN;

    if (!token) {
      setErrorMsg("❌ Storyblok token not found in env variables.");
      setLoading(false);
      return;
    }

    const url = `https://api.storyblok.com/v2/cdn/stories?starts_with=products/&version=draft&token=${token}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const stories = data.stories || [];
        const productList = stories.map((story: any) => ({
          ...story.content,
          slug: story.slug,
        }));
        setProducts(productList);
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
        {products.map((product, i) => {
          const slug = product.slug || `product-${i}`;
          return (
            <Link key={slug} href={`/products/${slug}`} passHref legacyBehavior>
              <a className="card" aria-label={`View details for ${product.name}`}>
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
                  <h2 className="card-title">{product.name || "Unnamed Product"}</h2>
                  <p className="card-description">{product.description}</p>
                  <p className="card-price">
                    Price: <span>${product.price ?? "N/A"}</span>
                  </p>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(i);
                    }}
                    className={`btn-add-cart ${addedToCartIndex === i ? "added" : ""}`}
                  >
                    🛒 Add to Cart
                  </button>
                  {addedToCartIndex === i && <p className="added-msg">✔️ Added!</p>}
                </div>
              </a>
            </Link>
          );
        })}
      </main>

      <style jsx>{`
        .product-grid {
          min-height: 100vh;
          padding: 2rem 1.5rem;
          background: linear-gradient(90deg, #f9fafb, #e4e7ec);
          font-family: "Inter", sans-serif;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem 2rem;
        }
        .card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.07);
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
        }
        .image-wrapper {
          border-radius: 16px 16px 0 0;
          overflow: hidden;
        }
        .card-body {
          padding: 1.25rem 1.5rem;
        }
        .card-title {
          font-weight: 700;
          font-size: 1.15rem;
          color: #0f172a;
        }
        .card-description {
          font-size: 0.875rem;
          color: #475569;
          margin: 0.5rem 0;
        }
        .card-price {
          font-weight: 600;
          color: #2563eb;
        }
        .card-price span {
          color: #16a34a;
          font-weight: 700;
        }
        .btn-add-cart {
          margin-top: 1rem;
          padding: 0.65rem;
          background: linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%);
          color: white;
          font-weight: 600;
          border: none;
          border-radius: 10px;
          cursor: pointer;
        }
        .btn-add-cart.added {
          background-color: #22c55e;
        }
        .added-msg {
          margin-top: 0.5rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: #22c55e;
        }
      `}</style>
    </>
  );
}
