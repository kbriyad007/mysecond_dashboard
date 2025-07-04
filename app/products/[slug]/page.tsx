import StoryblokClient from "storyblok-js-client";
import Image from "next/image";
import { notFound } from "next/navigation";
import ProductDetailsClient from "./ProductDetailsClient"; // <-- use this instead of QuantitySelector

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
  if (!params?.slug || typeof params.slug !== "string") {
    return notFound();
  }

  try {
    const response = await Storyblok.get(`cdn/stories/products/${params.slug}`, {
      version: "draft",
    });

    const product: MyProduct | undefined = response?.data?.story?.content;
    if (!product) return notFound();

    const imageUrl = getImageUrl(product.image);

    return (
      <main className="min-h-screen bg-gray-100 py-14 px-6 sm:px-10 lg:px-24 xl:px-32">
        <div className="max-w-[1600px] mx-auto grid lg:grid-cols-2 gap-16 items-start">
          {/* Image Section */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl ring-1 ring-gray-200">
            <div className="aspect-[4/3] relative">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={product.name || "Product"}
                  fill
                  className="object-cover"
                  unoptimized
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  No image available
                </div>
              )}
            </div>
          </div>

          {/* Client Component */}
          <ProductDetailsClient
            name={product.name}
            description={product.description}
            price={product.Price}
          />
        </div>
      </main>
    );
  } catch {
    return notFound();
  }
}
