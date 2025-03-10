import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ProductCard from "../product/product-card";
import { Card } from "../ui/card";
import { getProducts } from "@/actions/productActions";
import Empty from "../shared/empty";

const Category = async ({
  title,
  bg,
  description,
}: {
  title: string;
  bg: string;
  description: string;
}) => {
  const products = await getProducts({});

  if (!products || products.length === 0)
    return (
      <Card className="p-4  lg:container mx-auto mt-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="mt-2 text-gray-600">{description}</p>
        </div>
        <Empty whatsEmpty="products" />
      </Card>
    );
  return (
    <section className={`bg-${bg} py-16`}>
      <div className="p-4 py-6 lg:container mx-auto ">
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
            <div className="flex gap-2 absolute -top-[40px] right-10">
              <CarouselNext className="-" />
              <CarouselPrevious className="" />
            </div>

            <CarouselContent>
              {products.map((product, index) => (
                <CarouselItem
                  key={index}
                  className="xxs:basis-1/2  md:basis-1/3  lg:basis-1/4 xl:basis-1/5"
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
