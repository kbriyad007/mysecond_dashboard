// app/products/[slug]/page.tsx
import StoryblokClient from "storyblok-js-client";
import Image from "next/image";
import { notFound } from "next/navigation";

const storyblok = new StoryblokClient({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN!,
  cache: { type: "memory" },
});

interface MyProduct {
  component: string;
  name: string;
  description: string;
  image?: { filename: string } | string;
  Price?: number | string;
}

export async function generateStaticParams() {
  const res = await storyblok.get("cdn/stories", {
    starts_with: "product",
    version: "draft",
  });

  return res.data.stories.map((story: any) => ({
    slug: story.slug,
  }));
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  try {
    const res = await storyblok.get(`cdn/stories/product/${params.slug}`, {
      version: "draft",
    });

    const product: MyProduct = res.data.story.content;
    const imageUrl =
      typeof product.image === "string"
        ? product.image
        : product.image?.filename
        ? `https://a.storyblok.com${product.image.filename}`
        : null;

    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{product.name}</h1>

        {imageUrl && (
          <div className="relative w-full h-96 mb-6 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        <p className="text-gray-700 text-lg mb-4">{product.description}</p>

        <p className="text-xl font-semibold text-green-600">
          Price: ${product.Price ?? "N/A"}
        </p>
      </main>
    );
  } catch (err) {
    return notFound(); // fallback for 404
  }
}
