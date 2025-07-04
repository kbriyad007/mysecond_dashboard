import StoryblokClient from "storyblok-js-client";
import Image from "next/image";
import { notFound } from "next/navigation";
import QuantitySelector from "./QuantitySelector"; // Adjust path if needed

// Storyblok client config
const Storyblok = new StoryblokClient({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN!,
  cache: { clear: "auto", type: "memory" },
});

// Interface for product data
interface MyProduct {
  name: string;
  description: string;
  Price?: number | string;
  image?: { filename: string } | string;
}

// Interface for page props
interface PageProps {
  params: {
    slug: string;
  };
}

// Helper to format image
function getImageUrl(image: MyProduct["image"]): string | null {
  if (typeof image === "string") {
    return image.startsWith("//") ? `https:${image}` : image;
  } else if (image?.filename) {
    return `https://a.storyblok.com${image.filename}`;
  }
  return null;
}

// ✅ Page component using interface
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
      <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
          {/* Image */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md">
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
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                  No image available
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 truncate">
                {product.name || "Unnamed Product"}
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line line-clamp-6">
                {product.description || "No description available."}
              </p>
            </div>

            <p className="text-2xl font-semibold text-green-600">
              {product.Price ? `$${product.Price}` : "Price not available"}
            </p>

            <QuantitySelector name={product.name} price={product.Price} />
          </div>
        </div>
      </main>
    );
  } catch {
    return notFound();
  }
}
