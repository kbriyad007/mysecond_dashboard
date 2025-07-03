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

    const imageUrl =
      typeof product.image === "string"
        ? product.image.startsWith("//")
          ? `https:${product.image}`
          : product.image
        : product.image?.filename ?? null;

    return (
      <main
        style={{
          maxWidth: "1080px",
          margin: "0 auto",
          padding: "2rem 1rem",
          fontFamily: "'Inter', sans-serif",
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
          display: "flex",
          flexDirection: "column",
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
          }}
        >
          {/* Left Side - Image */}
          <div
            style={{
              flex: "1 1 58%",
              minWidth: "300px",
              position: "relative",
              aspectRatio: "4 / 3",
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid #e5e7eb",
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

          {/* Right Side - Info */}
          <div
            style={{
              flex: "1 1 40%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minWidth: "260px",
            }}
          >
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                color: "#1f2937",
                marginBottom: "1rem",
              }}
            >
              {product.name || slug}
            </h1>

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

            <button
              style={{
                backgroundColor: "#2563eb",
                color: "#fff",
                padding: "0.75rem 2rem",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: 600,
                border: "none",
                cursor: "not-allowed",
                opacity: 0.9,
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)",
              }}
              disabled
            >
              🛒 Buy Now
            </button>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error("❌ Failed to fetch product:", error);
    notFound();
  }
}
