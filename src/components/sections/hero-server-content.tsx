// CarouselContentComponent.tsx

import * as React from "react";
import { CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getCategories } from "@/actions/categoryActions";
import { getProducts } from "@/actions/productActions";

export async function CarouselContentComponent() {
  // Make it default and async
  const categories = await getCategories();
  const limitedCategories = categories.slice(4, 7); // Limit to 3 categories

  return (
    <CarouselContent>
      {limitedCategories.map((category) => (
        <CarouselItem key={category.id}>
          <div className="sm:flex gap-3 items-center justify-center lg:h-[50vh] py-2">
            <Image
              src={category.imageUrl || "/placeholder.png"}
              alt={category.name}
              height={600}
              width={600}
              className="rounded-xl pointer-events-none w-96 object-cover h-96"
            />
            <div className="mt-4 px-8 ">
              <h2 className="text-4xl font-bold mb-4">Shop {category.name}</h2>
              <Button className="">
                <Link href={`/shop?category=${category.slug}`}>Explore</Link>
              </Button>
            </div>
          </div>
        </CarouselItem>
      ))}
    </CarouselContent>
  );
}

export async function ProductListComponent() {
  // Make it default and async
  const products = await getProducts({});
  const limitedProducts = products.slice(0, 2); // Limit to 2 products

  return (
    <div className="mt-4 lg:mt-0 flex flex-col md:flex-row lg:flex-col gap-6 w-full mx-auto">
      {limitedProducts.map((product) => (
        <div
          key={product.id}
          className="flex items-center gap-4 bg-white dark:bg-gray-950 border rounded-xl p-4 flex-1"
        >
          <div>
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="mt-2">${product.price}</p>
            <Button className="mt-4">
              <Link href={`/product/${product.id}`}>View Product</Link>
            </Button>
          </div>
          <Image
            src={
              product.imageUrls && product.imageUrls.length > 0
                ? product.imageUrls[0]
                : "/placeholder.png"
            }
            alt={product.name}
            width={200}
            height={200}
            className="rounded-xl object-cover w-full h-40"
          />
        </div>
      ))}
    </div>
  );
}
