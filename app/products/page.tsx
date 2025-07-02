"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface MyProduct {
  component: string;
  name: string;
  description: string;
  image?: { filename: string };
  price?: number | string;
  slug?: string;
  _version?: number; // optional version for cache busting
}

interface StoryblokStory {
  slug: string;
  content: MyProduct;
}

// Slugify helper for fallback URL creation
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export default function Page() {
  const [products, setProducts] = useState<MyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [addedToCartIndex, setAddedToCartIndex] = useState<number | null>(null);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_STORYBLOK_TOKEN;
    if (!token) {
      setErrorMsg("❌ Storyblok token not found in environment variables.");
      setLoading(false);
      return;
    }

    const url = `https://api.storyblok.com/v2/cdn/stories?starts_with=product&version=draft&token=${token}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const stories: StoryblokStory[] = data.stories || [];
        const productList = stories.map((story) => ({
          ...story.content,
          slug: story.slug,
          _version: story._version, // get version for cache busting if available
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
          const slug = product.slug || slugify(product.name || `product-${i}`);

          // Construct full image URL with optional cache busting
          const imageUrl = product.image?.filename
            ? `https://a.storyblok.com/${product.image.filename}?v=${product._version || "1"}`
            : fallbackImage;

          return (
            <Link
              key={slug}
              href={`/products/${slug}`}
              passHref
              legacyBehavior
            >
              <a
                className="card"
                aria-label={`View details for ${product.name || "product"}`}
              >
                <div className="image-wrapper">
                  <Image
                    src={imageUrl}
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

                  {addedToCartIndex === i && (
                    <p className="added-msg">✔️ Added!</p>
                  )}
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
          justify-content: center;
          align-content: start;
        }

        .card {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.07);
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
        }

        .card-body {
          padding: 1.25rem 1.5rem 1.5rem;
          display: flex;
          flex-direction: column;
        }

        .card-title {
          font-weight: 700;
          font-size: 1.15rem;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }

        .card-description {
          font-size: 0.875rem;
          color: #475569;
          flex-grow: 1;
          margin-bottom: 1rem;
        }

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

        .btn-add-cart {
          padding: 0.65rem 0;
          background: linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%);
          color: #ffffff;
          font-weight: 600;
          font-size: 0.9rem;
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
          color: #22c55e;
          text-align: center;
        }
      `}</style>
    </>
  );
}
