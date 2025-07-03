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
  content: MyProduct;  // Use proper type here instead of any
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
      <div className="min-h-screen flex items-center justify-center text-gray-600 font-medium text-center px-4">
        {errorMsg
          ? `❌ Error: ${errorMsg}`
          : products.length === 0
          ? "No products found."
          : "Loading..."}
      </div>
    );
  }

  return (
    <main className="px-4 py-10 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product, i) => {
          const slug = product.slug || slugify(product.name || `product-${i}`);
          const imageUrl = getImageUrl(product.image, product._version);

          return (
            <Link key={slug} href={`/products/${slug}`} passHref legacyBehavior>
              <a className="group bg-white rounded-xl border border-gray-300 hover:border-blue-500 hover:shadow-lg transition-all overflow-hidden flex flex-col">
                {/* Image area */}
                <div className="relative w-full pt-[61.8%] bg-gray-100">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={product.name || "Product image"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                      No image available
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h2 className="font-semibold text-gray-800 text-lg truncate">
                      {product.name || "Unnamed Product"}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="text-green-600 font-semibold mb-2 text-sm">
                      ${product.price ?? "N/A"}
                    </p>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(i);
                      }}
                      className={`w-full text-sm font-medium px-3 py-2 rounded-md text-white ${
                        addedToCartIndex === i ? "bg-green-500" : "bg-blue-600 hover:bg-blue-700"
                      } transition`}
                    >
                      {addedToCartIndex === i ? "✔ Added" : "🛒 Add to Cart"}
                    </button>
                  </div>
                </div>
              </a>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
