import React from "react";
import { products } from "@/lib/fakedata";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ProductCard from "./product-card";

const Category = ({
  title,
  bg,
  description,
}: {
  title: string;
  bg: string;
  description: string;
}) => {
  return (
    <section className={`bg-${bg} py-16`}>
      <div className="container mx-auto ">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="mt-2 text-gray-600">{description}</p>
        </div>

        <div className="">
          <Carousel
            className="relative"
            opts={{
              align: "start",
            }}
          >
            <div className="flex gap-2 absolute -top-[20px] right-10">
              <CarouselNext className="-" />
              <CarouselPrevious className="" />
            </div>

            <CarouselContent>
              {products.map((product, index) => (
                <CarouselItem
                  key={index}
                  className="xxs:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Category;
