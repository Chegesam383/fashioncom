"use client";

import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Heart } from "lucide-react";
import Rating from "../rating/ratings";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import AddToCart from "./add-to-cart";
import { Product } from "@/lib/types";
import AddToCartNoAttributes from "./add-to-cart-no-attributes";

export default function ProductCard({ product }: { product: Product }) {
  const attributes = product.attributes?.availableAttributes;
  const hasAttributes = !(attributes && JSON.stringify(attributes) === "{}");

  const discount =
    Number(product.price) > 30
      ? Math.round(((300 - Number(product.price)) / 300) * 100)
      : 0;

  return (
    <div
      key={product.id}
      className="p-3 bg-background/60 backdrop-blur relative transition-shadow rounded-xl border hover:shadow-lg"
    >
      <div className="flex flex-col gap-4 h-[400px]">
        {discount > 0 && (
          <div className="absolute left-4 top-4 z-10 rounded-full bg-red-600 px-3 py-1 text-sm font-semibold text-white">
            {discount}% OFF
          </div>
        )}
        <Link href={"product/" + product.id}>
          <Image
            src={product?.imageUrls?.[0] || "/placeholder.png"}
            alt={product.name}
            width={200}
            height={150}
            className="w-full h-52 object-cover rounded-lg hover:scale-[1.02] transition-transform "
          />
        </Link>
        <Link
          href={"product/" + product.id}
          className="line-clamp-2 text-lg tracking-tight text-gray-900 dark:text-white text-ellipsis"
        >
          {product.name}
        </Link>
        <div className="flex justify-between flex-wrap">
          <div className="">
            <span className="text-xl font-bold">
              {formatPrice(product.price)}
            </span>
            <small className="hidden md:inline ml-2 text-xs text-muted-foreground line-through">
              {product.oldPrice && formatPrice(product.oldPrice)}
            </small>
          </div>
          <div className="flex align-center gap-2">
            <Rating rating={4} long={false} />
            <span className="mt-1 text-muted-foreground">{product.rating}</span>
          </div>
        </div>
        <div className="">
          <small
            className={`text-sm line-clamp-2 text-muted-foreground text-ellipsis`}
          >
            {product.description}
          </small>
        </div>
      </div>
      <div className="flex gap-2">
        {hasAttributes ? (
          <AddToCart
            product={product}
            selectedImage={product?.imageUrls?.[0]}
          />
        ) : (
          <AddToCartNoAttributes product={product} />
        )}

        <Button size={"icon"} variant={"outline"}>
          <Heart className="size-4" />
        </Button>
      </div>
    </div>
  );
}
