import type { MyProduct } from "@/types";

export const mockProducts: MyProduct[] = [
  {
    component: "ProductCard",
    name: "Luxury Template",
    slug: "luxury-template", // 👈 Must match URL
    description: "A premium modern Webflow-style template for creatives.",
    price: 49,
    image: {
      filename: "https://via.placeholder.com/800x500?text=Luxury+Template",
    },
  },
  {
    component: "ProductCard",
    name: "Business Template",
    slug: "business-template",
    description: "Professional template for SaaS and startups.",
    price: 69,
    image: {
      filename: "https://via.placeholder.com/800x500?text=Business+Template",
    },
  },
];
