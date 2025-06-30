import ProductGrid from "./ProductGrid";
import CartMenu from "../components/CartMenu";

export default function ProductsPage() {
  return (
    <main className="bg-gray-100 min-h-screen p-6 grid lg:grid-cols-4 gap-6">
      {/* Product listing on the left (3/4) */}
      <div className="lg:col-span-3">
        <ProductGrid />
      </div>

      {/* Cart menu on the right (1/4) */}
      <div className="lg:col-span-1">
        <CartMenu />
      </div>
    </main>
  );
}
