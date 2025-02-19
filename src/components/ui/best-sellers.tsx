import React from "react";
import { Trophy } from "lucide-react";
import { ProductCard } from "../Category";
import { products } from "@/lib/fakedata";

export function BestSellers() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center gap-3">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <div>
            <h2 className="text-3xl font-bold">Best Sellers</h2>
            <p className="mt-2 text-gray-600">
              Our most popular products loved by customers
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
