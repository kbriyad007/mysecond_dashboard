import { notFound } from "next/navigation";
import StoryblokClient from "storyblok-js-client";

const Storyblok = new StoryblokClient({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN!,
  cache: { clear: "auto", type: "memory" },
});

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const res = await Storyblok.get("cdn/links/");
  const links = res.data.links;

  // Filter only products paths
  const productSlugs = Object.keys(links)
    .map((key) => links[key].slug)
    .filter((slug: string) => slug.startsWith("products/"))
    .map((slug: string) => {
      // remove "products/" prefix
      const productSlug = slug.replace(/^products\//, "");
      return { slug: productSlug };
    });

  return productSlugs;
}

export default async function ProductPage({ params }: Props) {
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
        {/* Render product image */}
        {product.image?.filename && (
          <img
            src={product.image.filename}
            alt={product.name || "Product Image"}
            style={{ maxWidth: "100%", borderRadius: "12px", marginTop: "1rem" }}
          />
        )}
        {/* Add more product details here */}
      </main>
    );
  } catch (e) {
    notFound();
  }
}
