import React from "react";
import { Timer } from "lucide-react";
import ProductCard from "./product-card";

import { products } from "@/lib/fakedata";
import CountdownTimer from "./ui/counter-timer";
const endDate = new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000);
export default function FlashSaleDeals() {
  return (
    <section className="bg-red-50 dark:bg-blue-950 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col items-center md:block ">
            <h2 className=" text-3xl font-bold">Flash sale deals</h2>
            <p className="mt-2 text-gray-600">
              Don&apos;t miss out on these amazing deals!
            </p>
          </div>
          <div className="flex items-center rounded-lg bg-red-500 px-4 py-2 text-white">
            <Timer className="mr-2 h-5 w-5" />
            <span className="font-semibold">
              <CountdownTimer endDate={endDate} />
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 xxs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
