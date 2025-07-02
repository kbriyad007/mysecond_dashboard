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
      setErrorMsg("❌ Storyblok token not found in env.");
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
      <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 py-8 bg-gray-50">
        {products.map((product, i) => {
          const slug = product.slug || slugify(product.name || `product-${i}`);
          const imageUrl = getImageUrl(product.image, product._version);

          return (
            <Link key={slug} href={`/products/${slug}`} passHref legacyBehavior>
              <a className="bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 transition-colors overflow-hidden">
                <div className="relative w-full h-44 bg-gray-100">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={product.name || "Product image"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      No image available
                    </div>
                  )}
                </div>

                <div className="p-3 text-sm">
                  <h2 className="font-medium text-gray-800 truncate">
                    {product.name || "Unnamed Product"}
                  </h2>
                  <p className="text-gray-500 line-clamp-2 mt-1">
                    {product.description}
                  </p>
                  <p className="text-green-600 font-semibold mt-2">
                    ${product.price ?? "N/A"}
                  </p>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(i);
                    }}
                    className={`w-full mt-3 text-xs font-medium px-3 py-2 rounded-md text-white ${
                      addedToCartIndex === i ? "bg-green-500" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {addedToCartIndex === i ? "✔ Added" : "🛒 Add to Cart"}
                  </button>
                </div>
              </a>
            </Link>
          );
        })}
      </main>
    </>
  );
}
