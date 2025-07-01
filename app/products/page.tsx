"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { mockProducts } from "@/lib/mockProducts";
import { MyProduct } from "@/types";
import Image from "next/image";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  const [product, setProduct] = useState<MyProduct | null>(null);

  useEffect(() => {
    if (slug) {
      const found = mockProducts.find((p) => p.slug === slug);
      setProduct(found || null);
    }
  }, [slug]);

  if (!product) {
    return <div className="p-6 text-gray-600 text-center">❌ Product not found.</div>;
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">{product.name}</h1>
      <Image
        src={product.image?.filename || "/fallback.jpg"}
        alt={product.name}
        width={800}
        height={500}
        className="rounded-lg mb-6"
      />
      <p className="text-gray-700 text-sm mb-2">{product.description}</p>
      <p className="text-lg font-bold text-green-600">Price: ${product.price}</p>
    </main>
  );
}
