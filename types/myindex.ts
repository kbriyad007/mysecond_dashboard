// /types/index.ts

export interface MyProduct {
  component: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image?: {
    filename: string;
  };
}
