"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { mockProducts } from "@/lib/mockProducts";
import { MyProduct } from "@/types";
import Image from "next/image";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : "";

  const [product, setProduct] = useState<MyProduct | null>(null);

  useEffect(() => {
    if (slug) {
      const found = mockProducts.find((p) => p.slug === slug);
      setProduct(found || null);
    }
  }, [slug]);

  if (!product) {
    return <div className="p-6 text-center text-gray-500">❌ Product not found</div>;
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">{product.name}</h1>
      <Image
        src={product.image?.filename || "/fallback.jpg"}
        alt={product.name}
        width={800}
        height={500}
        className="rounded mb-6"
      />
      <p className="text-gray-700 text-sm mb-3">{product.description}</p>
      <p className="text-lg font-bold text-green-600">Price: ${product.price}</p>
    </main>
  );
}
