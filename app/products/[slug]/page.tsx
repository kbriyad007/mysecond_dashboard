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
      const productSlug = slug.replace(/^products\//, "");
      return { slug: productSlug };
    });

  return productSlugs;
}

// Here is where you put the eslint-disable and use `any` on params
export default async function ProductPage({ params }: any) {
  const { slug } = params;

  try {
    const res = await Storyblok.get(`cdn/stories/products/${slug}`, {
      version: "draft",
    });

    const story = res.data.story;

    if (!story) {
      notFound();
    }

    const product = story.content;

    return (
      <main style={{ padding: "2rem", fontFamily: "'Inter', sans-serif" }}>
        <h1>{product.name || slug}</h1>
        <p>{product.description}</p>

        {product.image?.filename && (
          <Image
            src={product.image.filename}
            alt={product.name || "Product Image"}
            width={800}
            height={600}
            style={{ borderRadius: "12px", marginTop: "1rem" }}
            priority
          />
        )}
      </main>
    );
  } catch {
    notFound();
  }
}
