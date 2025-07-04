import StoryblokClient from "storyblok-js-client";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useState } from "react";

const Storyblok = new StoryblokClient({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN!,
  cache: { clear: "auto", type: "memory" },
});

interface MyProduct {
  name: string;
  description: string;
  Price?: number | string;
  image?: { filename: string } | string;
}

function getImageUrl(image: MyProduct["image"]): string | null {
  if (typeof image === "string") {
    return image.startsWith("//") ? `https:${image}` : image;
  } else if (image?.filename) {
    return `https://a.storyblok.com${image.filename}`;
  }
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function Page({ params }: any) {
  if (
    typeof params !== "object" ||
    params === null ||
    typeof params.slug !== "string"
  ) {
    return notFound();
  }

  const slug = params.slug;

  try {
    const response = await Storyblok.get(`cdn/stories/products/${slug}`, {
      version: "draft",
    });

    const product: MyProduct = response.data.story.content;
    const imageUrl = getImageUrl(product.image);

    return (
      <main className="min-h-screen bg-gray-50 py-14 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
          {/* Image */}
          <div className="w-full bg-white rounded-2xl overflow-hidden shadow-md">
            <div className="aspect-[1.4] relative">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={product.name || "Product"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  No image available
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                {product.name || "Unnamed Product"}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
                {product.description || "No description available."}
              </p>
            </div>

            <div>
              <p className="text-3xl font-semibold text-green-600">
                {product.Price ? `$${product.Price}` : "Price not available"}
              </p>
            </div>

            {/* Quantity Selector */}
            <form action="#" method="POST" className="space-y-4">
              <div className="flex items-center space-x-4">
                <label
                  htmlFor="quantity"
                  className="text-gray-700 font-medium text-base"
                >
                  Quantity:
                </label>
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button
                    type="button"
                    className="w-10 h-10 text-xl font-bold text-gray-600 hover:bg-gray-100"
                    onClick={() =>
                      document.getElementById("qty") &&
                      ((document.getElementById("qty") as HTMLInputElement).value = String(
                        Math.max(
                          1,
                          Number((document.getElementById("qty") as HTMLInputElement).value) - 1
                        )
                      ))
                    }
                  >
                    −
                  </button>
                  <input
                    id="qty"
                    name="quantity"
                    type="number"
                    defaultValue={1}
                    min={1}
                    className="w-16 h-10 text-center border-x border-gray-200 focus:outline-none"
                  />
                  <button
                    type="button"
                    className="w-10 h-10 text-xl font-bold text-gray-600 hover:bg-gray-100"
                    onClick={() =>
                      document.getElementById("qty") &&
                      ((document.getElementById("qty") as HTMLInputElement).value = String(
                        Number((document.getElementById("qty") as HTMLInputElement).value) + 1
                      ))
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Buy Now Button */}
              <button
                type="submit"
                className="mt-6 w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-lg font-semibold rounded-xl shadow-lg"
              >
                🛒 Buy Now
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  } catch {
    return notFound();
  }
}
