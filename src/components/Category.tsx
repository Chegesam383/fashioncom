import React from "react";
import { product, products } from "@/lib/fakedata";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import { Heart, ShoppingCartIcon } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Rating from "./ratings";

interface ProductCardProps {
  product: product;
}

const Category = ({ title }: { title: string }) => {
  return (
    <section className="container mx-auto mt-5 px-4">
      <div className="p-0 m-0 shadow-none">
        <div className="text-3xl font-bold ">{title}</div>

        <div className="border rounded">
          <Carousel
            opts={{
              align: "start",
            }}
          >
            <CarouselContent className="">
              {products.map((product, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="" />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Category;

function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images[0].startsWith("http")
    ? product.images[0]
    : `https://i.imgur.com/${product.images[0]}`;

  return (
    <div key={product.id} className=" p-3">
      <div className="flex flex-col gap-5 justify-between">
        <Image
          src={imageUrl}
          alt={product.title}
          width={200}
          height={150}
          className="w-full h-56 object-cover rounded-lg"
        />

        <h1 className="text-xl ">{product.title}</h1>

        <div className="flex justify-between">
          <p className="text-xl font-bold">${product.price}</p>{" "}
          <div className="flex align-center gap-2">
            <Rating rating={4} long={true} /> <span className="mt-1">4</span>
          </div>
        </div>

        <div className="flex-1">
          <p className="text-muted-foreground">
            {product.description.slice(0, 80)}...
          </p>
        </div>
      </div>
      <div className="flex gap-2 justify-end ">
        <Button>
          <ShoppingCartIcon className="size-4" />
          Add to Cart
        </Button>
        <Button size={"icon"} variant={"outline"}>
          <Heart className="size-4" />
        </Button>
      </div>
    </div>
  );
}
