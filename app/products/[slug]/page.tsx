// app/products/[slug]/page.tsx

import StoryblokClient from 'storyblok-js-client';
import { notFound } from 'next/navigation';

const Storyblok = new StoryblokClient({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_API_KEY,
});

export default async function ProductPage({ params }: { params: { slug: string } }) {
  try {
    const { data } = await Storyblok.get(`cdn/stories/products/${params.slug}`, {
      version: 'draft',
    });

    const productName = data.story.content.product_name;

    return <h1>{productName}</h1>;
  } catch {
    return notFound();
  }
}
