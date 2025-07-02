/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import Image from "next/image";
import StoryblokClient from "storyblok-js-client";

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
      const productSlug = slug.replace(/^products\//, "").trim();
      return { slug: productSlug };
    });

  return productSlugs;
}

export default async function ProductPage({ params }: any) {
  let { slug } = params;
  slug = slug.trim();

  try {
    const res = await Storyblok.get(
      `cdn/stories/products/${encodeURIComponent(slug)}`,
      {
        version: "draft",
      }
    );

    const story = res.data.story;

    if (!story) notFound();

    const product = story.content;

    return (
      <main
        style={{
          maxWidth: "768px",
          margin: "0 auto",
          padding: "2rem",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            marginBottom: "1rem",
          }}
        >
          {product.name || slug}
        </h1>

        <p
          style={{
            fontSize: "1rem",
            color: "#475569",
            marginBottom: "1.5rem",
            lineHeight: 1.6,
          }}
        >
          {product.description}
        </p>

        {product.image?.filename && (
          <Image
            src={product.image.filename}
            alt={product.name || "Product Image"}
            width={800}
            height={500}
            style={{ borderRadius: "12px", marginBottom: "2rem" }}
            priority
          />
        )}

        {product.price && (
          <p
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#16a34a",
            }}
          >
            💰 Price: ${product.price}
          </p>
        )}
      </main>
    );
  } catch (error) {
    console.error("Failed to fetch product from Storyblok:", error);
    notFound();
  }
}
