import StoryblokClient from "storyblok-js-client";
import Image from "next/image";
import { notFound } from "next/navigation";
import QuantitySelector from "./QuantitySelector"; // Adjust if path differs

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

    if (!response?.data?.story?.content) {
      return notFound();
    }

    const product: MyProduct = response.data.story.content;
    const imageUrl = getImageUrl(product.image);

    return (
      <main className="min-h-screen bg-gradient-to-tr from-white to-gray-100 py-14 px-6 sm:px-10 lg:px-24 xl:px-32">
        <div className="max-w-[1600px] mx-auto grid lg:grid-cols-2 gap-16 items-start">
          {/* Image Section */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl ring-1 ring-gray-200">
            <div className="aspect-[4/3] relative">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={product.name || "Product"}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  unoptimized
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-base font-semibold">
                  No image available
                </div>
              )}
            </div>
          </div>

          {/* Info Section */}
          <section className="flex flex-col justify-between h-full space-y-6">
            <div className="space-y-6">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">
                {product.name || "Unnamed Product"}
              </h1>

              <p className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-line line-clamp-6">
                {product.description || "No description available."}
              </p>

              <p className="text-3xl font-bold text-green-700 drop-shadow">
                {product.Price ? `$${product.Price}` : "Price not available"}
              </p>
            </div>

            {/* Quantity selector + Buy button */}
            <div className="pt-4">
              <QuantitySelector price={product.Price} />
            </div>
          </section>
        </div>
      </main>
    );
  } catch {
    return notFound();
  }
}
