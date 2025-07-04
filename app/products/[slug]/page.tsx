import StoryblokClient from "storyblok-js-client";
import Image from "next/image";
import { notFound } from "next/navigation";

// Storyblok client config
const Storyblok = new StoryblokClient({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN!,
  cache: { clear: "auto", type: "memory" },
});

// Product data interface
interface MyProduct {
  name: string;
  description: string;
  Price?: number | string;
  image?: { filename: string } | string;
}

// Params type interface for Next.js dynamic route
interface PageProps {
  params: {
    slug: string;
  };
}

// Image helper
function getImageUrl(image: MyProduct["image"]): string | null {
  if (typeof image === "string") {
    return image.startsWith("//") ? `https:${image}` : image;
  } else if (image?.filename) {
    return `https://a.storyblok.com${image.filename}`;
  }
  return null;
}

// ✅ Page Component with type-safe params
export default async function Page({ params }: PageProps) {
  const { slug } = params;

  try {
    const response = await Storyblok.get(`cdn/stories/products/${slug}`, {
      version: "draft",
    });

    if (!response?.data?.story?.content) return notFound();

    const product: MyProduct = response.data.story.content;
    const imageUrl = getImageUrl(product.image);

    return (
      <main className="min-h-screen bg-white px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="w-full aspect-[1.618] bg-gray-100 relative mb-10 rounded-2xl overflow-hidden shadow-md">
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

          <div>
            <h1 className="text-4xl font-semibold text-gray-900 mb-3">
              {product.name || "Unnamed Product"}
            </h1>

            <p className="text-base text-gray-600 mb-5 whitespace-pre-line leading-relaxed">
              {product.description || "No description available."}
            </p>

            <p className="text-2xl font-bold text-green-600">
              {product.Price ? `$${product.Price}` : "Price not available"}
            </p>
          </div>
        </div>
      </main>
    );
  } catch {
    return notFound();
  }
}
