// app/products/[slug]/page.tsx
import { notFound } from 'next/navigation';

interface Props {
  params: {
    slug: string;
  };
}

const mockProducts = [
  { slug: 'orange', name: 'Orange', price: 200 },
  { slug: 'banana', name: 'Banana', price: 100 },
];

export default function ProductPage({ params }: Props) {
  const product = mockProducts.find(p => p.slug === params.slug);

  if (!product) return notFound();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">{product.name}</h1>
      <p>Price: ${product.price}</p>
    </div>
  );
}

