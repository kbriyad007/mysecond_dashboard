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
          maxWidth: "860px",
          margin: "0 auto",
          padding: "2rem 1rem",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Image */}
        {product.image?.filename && (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "0",
              paddingBottom: "56.25%",
              borderRadius: "16px",
              overflow: "hidden",
              marginBottom: "2rem",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
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

        {/* Title */}
        <h1
          style={{
            fontSize: "2.25rem",
            fontWeight: 700,
            color: "#1f2937",
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          {product.name || slug}
        </h1>

        {/* Price */}
        {product.price && (
          <p
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              color: "#22c55e",
              textAlign: "center",
              marginBottom: "1.5rem",
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
            marginBottom: "3rem",
            textAlign: "center",
          }}
        >
          {product.description || "No description available."}
        </p>

        {/* Buy Now / CTA */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            style={{
              backgroundColor: "#2563eb",
              color: "#fff",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              transition: "background-color 0.3s ease",
              cursor: "pointer",
              border: "none",
            }}
            onClick={() => alert("Buy Now clicked!")}
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
