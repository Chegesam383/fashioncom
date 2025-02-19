import React from "react";
import { product } from "@/lib/fakedata";
import Image from "next/image";

import { Button } from "./ui/button";
import { Heart, ShoppingCartIcon, Timer } from "lucide-react";

import Rating from "./ratings";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: product;
}
export default function ProductCard({ product }: ProductCardProps) {
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;
  const imageUrl = product.images[0].startsWith("http")
    ? product.images[0]
    : `https://i.imgur.com/${product.images[0]}`;

  return (
    <div
      key={product.id}
      className=" p-3 bg-white shadow-none dark:bg-slate-950 relative transition-shadow rounded-xl hover:shadow-lg"
    >
      <div className="flex flex-col gap-3 justify-between h-[430px] ">
        {!product.flashSale && (
          <div className="absolute left-4 top-4 z-10 rounded-full bg-red-600 px-3 py-1 text-sm font-semibold text-white">
            {discount}% OFF
          </div>
        )}
        {product.bestSeller && (
          <div className="absolute right-4 top-4 z-10 rounded-full bg-yellow-500 px-3 py-1 text-sm font-semibold text-white">
            Best Seller
          </div>
        )}
        <Image
          src={imageUrl}
          alt={product.title}
          width={200}
          height={150}
          className="w-full h-56 object-cover rounded-lg"
        />
        <Link
          href=""
          className="line-clamp-2 text-lg  tracking-tight text-gray-900 dark:text-white text-ellipsis "
        >
          {product.title}
        </Link>
        <div className="flex justify-between flex-wrap">
          <div className="">
            <span className="text-xl font-bold">
              {formatPrice(product.price)}
            </span>
            {!product.originalPrice && (
              <span className="hidden md:inline ml-2 text-sm text-gray-500 line-through">
                {formatPrice(600)}
              </span>
            )}
          </div>
          <div className="flex align-center gap-2">
            <Rating rating={4} long={false} /> <span className="mt-1">4</span>
          </div>
        </div>
        <div className="">
          <small className="  text-sm line-clamp-2 text-muted-foreground  text-ellipsis ">
            {product.description}
          </small>
        </div>
        {!product.flashSale && !product.saleEnds && (
          <div className="mt-2 flex items-center text-sm text-red-600 mb-4">
            <Timer className="mr-1 h-4 w-4" />
            <span>Sale ends soon!</span>
          </div>
        )}
      </div>
      <div className="flex gap-2 justify-end ">
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
