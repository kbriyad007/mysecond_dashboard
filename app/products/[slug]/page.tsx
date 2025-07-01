"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { mockProducts } from "@/lib/mockProducts"; // or use your real data
import { MyProduct } from "@/types";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<MyProduct | null>(null);

  useEffect(() => {
    const found = mockProducts.find((p) => p.slug === slug);
    setProduct(found || null);
  }, [slug]);

  if (!product) {
    return <div className="p-8 text-gray-500">Product not found</div>;
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

      <Image
        src={product.image?.filename || "/fallback.jpg"}
        alt={product.name}
        width={800}
        height={500}
        className="rounded-lg border"
      />

      <p className="text-gray-700">{product.description}</p>

      <p className="text-xl font-semibold text-green-600">
        ${product.price}
      </p>
    </main>
  );
}
