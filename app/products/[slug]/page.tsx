/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import Image from "next/image";
import StoryblokClient from "storyblok-js-client";

// Setup Storyblok Client
const Storyblok = new StoryblokClient({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN!,
  cache: { clear: "auto", type: "memory" },
});

// Generate Static Paths
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

// Product Page Component
export default async function ProductPage({ params }: any) {
  let { slug } = params;
  slug = slug.trim();

  try {
    const res = await Storyblok.get(
      `cdn/stories/products/${encodeURIComponent(slug)}`,
      { version: "draft" }
    );

    const story = res.data.story;
    if (!story) notFound();

    const product = story.content;

    return (
      <main
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: "2rem 1rem",
          fontFamily: "'Inter', sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#f9fafb",
          minHeight: "100vh",
        }}
      >
        {/* Image */}
        {product.image?.filename && (
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "720px",
              height: 0,
              paddingBottom: "56.25%",
              borderRadius: "16px",
              overflow: "hidden",
              marginBottom: "2rem",
              border: "1px solid #e5e7eb",
              backgroundColor: "#f3f4f6",
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
            }}
          >
            <Image
              src={product.image.filename}
              alt={product.name || "Product Image"}
              fill
              style={{
                objectFit: "cover",
              }}
              priority
            />
          </div>
        )}

        {/* Product Info Card */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
            padding: "2rem",
            width: "100%",
            maxWidth: "720px",
            textAlign: "center",
          }}
        >
          {/* Title */}
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "#1f2937",
              marginBottom: "0.75rem",
            }}
          >
            {product.name || slug}
          </h1>

          {/* Price */}
          {product.price && (
            <p
              style={{
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "#22c55e",
                marginBottom: "1.25rem",
              }}
            >
              💰 ${product.price}
            </p>
          )}

          {/* Description */}
          <p
            style={{
              fontSize: "1.125rem",
              color: "#4b5563",
              lineHeight: 1.75,
              marginBottom: "2rem",
            }}
          >
            {product.description || "No description available."}
          </p>

          {/* Buy Button (disabled placeholder) */}
          <button
            style={{
              backgroundColor: "#2563eb",
              color: "#fff",
              padding: "0.75rem 2rem",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "not-allowed",
              opacity: 0.9,
              border: "none",
              boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)",
            }}
            disabled
          >
            🛒 Buy Now
          </button>
        </div>
      </main>
    );
  } catch (error) {
    console.error("❌ Failed to fetch product:", error);
    notFound();
  }
}
