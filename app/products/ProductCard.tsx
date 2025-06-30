"use client";

import Image from "next/image";
import { MyProduct } from "@/types";

interface Props {
  product: MyProduct;
  isAdded: boolean;
  onAdd: () => void;
}

const fallbackImage =
  "https://a.storyblok.com/f/285405591159825/4032x2688/ca2804d8c3/image-couple-relaxing-tropical-beach-sunset-hotel-vacation-tourism.jpg";

export default function ProductCard({ product, isAdded, onAdd }: Props) {
  return (
    <article className="bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden">
      <div className="relative w-full aspect-[4/3] border-b border-gray-200">
        <Image
          src={product.image?.filename || fallbackImage}
          alt={product.name}
          fill
          style={{ objectFit: "cover" }}
          quality={85}
          className="rounded-t-xl"
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-gray-900 text-sm font-semibold mb-1">{product.name}</h2>
        <p className="text-gray-600 text-sm mb-3 flex-grow">{product.description}</p>
        <p className="text-gray-800 text-sm font-medium mb-3">
          Price: <span className="font-semibold">${product.price ?? "N/A"}</span>
        </p>
        <button
          onClick={onAdd}
          className={`py-2 text-sm font-semibold text-white rounded-md ${
            isAdded ? "bg-green-600" : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          🛒 {isAdded ? "Added!" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
}
