import StoryblokClient from "storyblok-js-client";
import Image from "next/image";
import { notFound } from "next/navigation";

// ✅ Initialize Storyblok
const Storyblok = new StoryblokClient({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN!,
  cache: { clear: "auto", type: "memory" },
});

// ✅ Product type
interface MyProduct {
  name: string;
  description: string;
  Price?: number | string;
  image?: { filename: string } | string;
}

// ✅ Image URL resolver
function getImageUrl(image: MyProduct["image"]): string | null {
  if (typeof image === "string") {
    return image.startsWith("//") ? `https:${image}` : image;
  } else if (image?.filename) {
    return `https://a.storyblok.com${image.filename}`;
  }
  return null;
}

// ✅ Dynamic product page
export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  try {
    const response = await Storyblok.get(`cdn/stories/products/${slug}`, {
      version: "draft",
    });

    const product: MyProduct = response.data.story.content;
    const imageUrl = getImageUrl(product.image);

    return (
      <main className="min-h-screen bg-white px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Product Image */}
          <div className="w-full aspect-[1.618] bg-gray-100 relative mb-8 rounded-xl overflow-hidden shadow-sm">
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

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name || "Unnamed Product"}
            </h1>

            <p className="text-lg text-gray-600 mb-6 whitespace-pre-line">
              {product.description || "No description available."}
            </p>

            <p className="text-xl font-semibold text-green-600">
              ${product.Price ?? "N/A"}
            </p>
          </div>
        </div>
      </main>
    );
  } catch {
    return notFound();
  }
}
