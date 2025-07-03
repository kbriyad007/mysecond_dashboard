// app/products/[slug]/page.tsx
import { notFound } from 'next/navigation';

const mockProducts = [
  { slug: 'orange', name: 'Orange', price: 200 },
  { slug: 'banana', name: 'Banana', price: 100 },
];

export default function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = mockProducts.find((p) => p.slug === params.slug);

  if (!product) return notFound();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">{product.name}</h1>
      <p>Price: ${product.price}</p>
    </div>
  );
}

// ✅ Sync function (no `async`)
export function generateStaticParams() {
  return [
    { params: { slug: 'orange' } },
    { params: { slug: 'banana' } },
  ];
}

