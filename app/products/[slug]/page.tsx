import StoryblokClient from "storyblok-js-client";
import Image from "next/image";
import { notFound } from "next/navigation";
import ProductDetailsClient from "./ProductDetailsClient"; // 👈 new client wrapper

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

export default async function Page({ params }: any) {
  const slug = params.slug;

  try {
    const response = await Storyblok.get(`cdn/stories/products/${slug}`, {
      version: "draft",
    });

    const product: MyProduct = response.data.story.content;
    const imageUrl = getImageUrl(product.image);

    return (
      <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 items-start">
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

          {/* ✅ Pass data to client wrapper */}
          <ProductDetailsClient name={product.name} description={product.description} price={product.Price} />
        </div>
      </main>
    );
  } catch {
    return notFound();
  }
}
