"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface MyProduct {
  component: string;
  name: string;
  description: string;
  image?: { filename: string } | string;
  price?: number | string;
  slug?: string;
  _version?: number;
}

interface StoryblokStory {
  slug: string;
  content: MyProduct;
  _version?: number;
}

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
      setErrorMsg("❌ Storyblok token not found.");
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
          _version: story._version,
        }));
        setProducts(productList);
      })
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (index: number) => {
    setAddedToCartIndex(index);
    setTimeout(() => setAddedToCartIndex(null), 2000);
  };

  const getImageUrl = (image: MyProduct["image"], version?: number): string | null => {
    if (typeof image === "string") {
      return image.startsWith("//") ? `https:${image}` : image;
    } else if (typeof image === "object" && image?.filename) {
      return `https://a.storyblok.com${image.filename}?v=${version || "1"}`;
    }
    return null;
  };

  if (loading || errorMsg || products.length === 0) {
    return (
      <div className="status-message">
        {errorMsg
          ? `❌ Error: ${errorMsg}`
          : products.length === 0
          ? "No products found."
          : "Loading..."}
        <style jsx>{`
          .status-message {
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1rem;
            font-family: 'Inter', sans-serif;
            color: #475569;
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
          const imageUrl = getImageUrl(product.image, product._version);

          return (
            <Link key={slug} href={`/products/${slug}`} passHref legacyBehavior>
              <a className="card">
                <div className="image-container">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={product.name || "Product image"}
                      fill
                      style={{ objectFit: "cover", borderRadius: "1rem 1rem 0 0" }}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="image"
                      priority={i === 0}
                    />
                  ) : (
                    <div className="no-image">No image available</div>
                  )}
                </div>

                <div className="card-body">
                  <h2 className="card-title">{product.name}</h2>
                  <p className="card-description">{product.description}</p>
                  <p className="card-price">
                    ${product.price ?? "N/A"}
                  </p>
                  <button
                    className={`add-button ${addedToCartIndex === i ? "added" : ""}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(i);
                    }}
                  >
                    {addedToCartIndex === i ? "✔ Added" : "🛒 Add to Cart"}
                  </button>
                </div>
              </a>
            </Link>
          );
        })}
      </main>

      <style jsx>{`
        .product-grid {
          padding: 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 2rem;
          background: #f8fafc;
          font-family: 'Inter', sans-serif;
        }

        .card {
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
        }

        .image-container {
          position: relative;
          width: 100%;
          height: 200px;
          background: #e2e8f0;
        }

        .card-body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
        }

        .card-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }

        .card-description {
          font-size: 0.9rem;
          color: #64748b;
          margin-bottom: 1rem;
          flex-grow: 1;
        }

        .card-price {
          font-size: 1rem;
          font-weight: 600;
          color: #10b981;
          margin-bottom: 1rem;
        }

        .add-button {
          background: linear-gradient(to right, #3b82f6, #2563eb);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 0.6rem 0;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .add-button:hover {
          background: linear-gradient(to right, #2563eb, #1d4ed8);
        }

        .add-button.added {
          background: #22c55e;
        }

        .no-image {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          font-size: 0.85rem;
        }
      `}</style>
    </>
  );
}
