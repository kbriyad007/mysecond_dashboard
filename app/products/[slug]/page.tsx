// app/products/[slug]/page.tsx

import StoryblokClient from 'storyblok-js-client';
import { notFound } from 'next/navigation';

// Setup client
const Storyblok = new StoryblokClient({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_API_KEY,
});

type PageProps = {
  params: { slug: string };
};

export default async function ProductPage({ params }: PageProps) {
  try {
    // Fetch story by slug
    const { data } = await Storyblok.get(`cdn/stories/products/${params.slug}`, {
      version: 'draft', // or 'published'
    });

    const productName = data.story.content.product_name;

    return <h1>{productName}</h1>;
  } catch (err) {
    return notFound();
  }
}
