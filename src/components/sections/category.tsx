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

  if (!products || products.length === 0) {
    return (
      <Card className="p-4 lg:container mx-auto mt-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="mt-2 text-slate-600">{description}</p>
        </div>
        <Empty whatsEmpty="products" />
      </Card>
    );
  }

  return (
    <section className={`bg-${bg} py-16`}>
      <div className="p-4 py-6 lg:container mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="mt-2 text-slate-600">{description}</p>
        </div>

        <div>
          <Carousel
            className="relative"
            opts={{
              align: "start",
              slidesToScroll: 3,
              containScroll: "trimSnaps",
            }}
          >
            <div className="flex gap-2 absolute -top-[40px] right-10">
              <CarouselNext />
              <CarouselPrevious />
            </div>

            <CarouselContent className="-ml-4">
              {products.map((product, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
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
