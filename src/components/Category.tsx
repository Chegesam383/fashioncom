import React from "react";
import { product, products } from "@/lib/fakedata";
import Image from "next/image";

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
import Link from "next/link";

interface ProductCardProps {
  product: product;
}

const Category = ({ title }: { title: string }) => {
  return (
    <section className="section">
      <div className="p-0 m-0 shadow-none">
        <div className="text-3xl font-bold my-3">{title}</div>

        <div className="">
          <Carousel
            className="relative"
            opts={{
              align: "start",
            }}
          >
            <div className="flex gap-2 absolute -top-4 right-10">
              <CarouselNext className="-" />
              <CarouselPrevious className="" />
            </div>

            <CarouselContent>
              {products.map((product, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
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

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images[0].startsWith("http")
    ? product.images[0]
    : `https://i.imgur.com/${product.images[0]}`;

  return (
    <div
      key={product.id}
      className="group rounded transition-all duration-300  p-3 hover:shadow-xl"
    >
      <div className="flex flex-col gap-3 justify-between h-[400px]">
        <Link href={`/product/${product.id}`}>
          <Image
            src={imageUrl}
            alt={product.title}
            width={200}
            height={150}
            className="w-full h-56 object-cover rounded-lg"
          />
        </Link>
        <Link
          href={`/product/${product.id}`}
          className="line-clamp-2 text-lg  tracking-tight text-gray-900 dark:text-white text-ellipsis "
        >
          {product.title}
        </Link>
        <div className="flex justify-between">
          <p className="text-xl font-bold">${product.price}</p>{" "}
          <div className="flex align-center gap-2">
            <Rating rating={4} long={false} /> <span className="mt-1">4</span>
          </div>
        </div>
        <div className="flex-1">
          <small className="  text-sm line-clamp-2 text-muted-foreground  text-ellipsis ">
            {product.description}
          </small>
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        <Button className="flex-1">
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
