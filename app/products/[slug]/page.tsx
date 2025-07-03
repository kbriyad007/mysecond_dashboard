/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import Image from "next/image";
import StoryblokClient from "storyblok-js-client";
import { useState } from "react";

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

    // Since this is an async server component, to add interactivity like quantity input, we need a Client Component.
    // We'll create a Client Component inside this file below and render it with product props.

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
          {/* Left - Product Image */}
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

          {/* Right - Product Info with Quantity and Buy Now */}
          <ProductDetails product={product} slug={slug} />
        </div>
      </main>
    );
  } catch (error) {
    console.error("❌ Failed to fetch product:", error);
    notFound();
  }
}

// Client Component for interactive parts
function ProductDetails({ product, slug }: { product: any; slug: string }) {
  const [quantity, setQuantity] = useState(1);

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleBuyNow = () => {
    alert(
      `You clicked Buy Now for "${product.name || slug}" with quantity ${quantity}!`
    );
    // Replace alert with your real payment/cart logic
  };

  return (
    <div
      style={{
        flex: "1 1 38%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "1.5rem",
        minWidth: "280px",
        maxWidth: "600px",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: 700,
          color: "#1f2937",
          margin: 0,
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
            margin: 0,
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
        }}
      >
        {product.description || "No description available."}
      </p>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          marginTop: "1rem",
        }}
      >
        {/* Quantity selector */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            overflow: "hidden",
            width: "130px",
          }}
        >
          <button
            onClick={decrement}
            style={{
              backgroundColor: "#e2e8f0",
              border: "none",
              padding: "0.5rem 0.75rem",
              cursor: "pointer",
              fontSize: "1.25rem",
              userSelect: "none",
              color: "#475569",
            }}
            aria-label="Decrease quantity"
          >
            –
          </button>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => {
              let val = parseInt(e.target.value);
              if (isNaN(val) || val < 1) val = 1;
              setQuantity(val);
            }}
            style={{
              width: "50px",
              textAlign: "center",
              border: "none",
              fontSize: "1rem",
              padding: "0.5rem 0",
              outline: "none",
              userSelect: "none",
            }}
            aria-label="Quantity"
          />
          <button
            onClick={increment}
            style={{
              backgroundColor: "#e2e8f0",
              border: "none",
              padding: "0.5rem 0.75rem",
              cursor: "pointer",
              fontSize: "1.25rem",
              userSelect: "none",
              color: "#475569",
            }}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        {/* Buy Now button */}
        <button
          onClick={handleBuyNow}
          style={{
            backgroundColor: "#2563eb",
            color: "#fff",
            padding: "0.75rem 2rem",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            opacity: 1,
            boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#1d4ed8")
          }
          onMouseLeave={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#2563eb")
          }
          aria-label="Buy Now"
        >
          🛒 Buy Now
        </button>
      </div>
    </div>
  );
}
