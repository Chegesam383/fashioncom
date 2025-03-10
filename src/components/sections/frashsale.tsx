import React from "react";
import ProductCard from "../product/product-card";
import CountdownTimer from "../ui/counter-timer";
import { Card } from "../ui/card";
import { getProducts } from "@/actions/productActions";
import Empty from "@/components/shared/empty";

export default async function FlashSaleDeals() {
  const products = await getProducts({});

  if (!products || products.length === 0) {
    return (
      <Card className="p-4 lg:container mx-auto mt-6">
        <div className="flex flex-col items-center md:block ">
          <h2 className=" text-3xl font-bold">Flash sale deals</h2>
          <p className="mt-2 text-gray-600">
            Don&apos;t miss out on these amazing deals!
          </p>
        </div>
        <Empty whatsEmpty="products" />
      </Card>
    );
  }
  return (
    <section className=" mt-6  py-10">
      <div className="p-4 lg:container mx-auto ">
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col items-center md:block ">
            <h2 className=" text-3xl font-bold">Flash sale deals</h2>
            <p className="mt-2 text-gray-600">
              Don&apos;t miss out on these amazing deals!
            </p>
          </div>
          <CountdownTimer />
        </div>
        <div className="grid gap-4 xxs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ">
          {products.slice(0, 10).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
