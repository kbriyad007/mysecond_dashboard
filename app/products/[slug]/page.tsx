/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import Image from "next/image";
import StoryblokClient from "storyblok-js-client";
import ProductDetails from "./ProductDetails";

const Storyblok = new StoryblokClient({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN!,
  cache: { clear: "auto", type: "memory" },
});

export async function generateStaticParams() {
  const res = await Storyblok.get("cdn/links/");
  const links = res.data.links;

  const productSlugs = Object.keys(links)
    .map((key) => links[key].slug)
    .filter((slug: string) => slug.startsWith("products/"))
    .map((slug: string) => {
      const productSlug = slug.replace("products/", "").trim();
      return { slug: productSlug };
    });

  return productSlugs;
}

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const slug = params.slug.trim();

  try {
    const res = await Storyblok.get(
      `cdn/stories/products/${encodeURIComponent(slug)}`,
      { version: "draft" }
    );

    const story = res.data.story;
    if (!story) notFound();

    const product = story.content;

    if (product.Price) {
      product.price = product.Price;
    }

    const imageUrl =
      typeof product.image === "string"
        ? product.image.startsWith("//")
          ? `https:${product.image}`
          : product.image
        : product.image?.filename ?? null;

    return (
      <main
        style={{
          width: "100%",
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "2rem 1rem",
          fontFamily: "'Inter', sans-serif",
          backgroundColor: "#f9fafb",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "2rem",
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
            padding: "2rem",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              flex: "1 1 55%",
              minWidth: "300px",
              maxWidth: "640px",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              overflow: "hidden",
              position: "relative",
              aspectRatio: "4 / 3",
              backgroundColor: "#f3f4f6",
            }}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name || "Product Image"}
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#9ca3af",
                  fontSize: "1rem",
                }}
              >
                No image available
              </div>
            )}
          </div>

          <ProductDetails product={product} />
        </div>
      </main>
    );
  } catch (error) {
    console.error("❌ Failed to fetch product:", error);
    notFound();
  }
}
