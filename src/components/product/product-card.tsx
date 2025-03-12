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
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";

export default function ProductCard({ product }: { product: Product }) {
  const attributes = product.attributes?.availableAttributes;
  const hasAttributes = !(attributes && JSON.stringify(attributes) === "{}");

  const priceDiff =
    Number(product?.oldPrice || 0) - Number(product?.price || 0);
  const discount = (priceDiff / Number(product?.price || 0)) * 100;

  return (
    <Card
      key={product.id}
      className="p-2 shadow-none backdrop-blur relative transition-shadow rounded-xl  hover:shadow-lg"
    >
      <div className="flex flex-col gap-4 h-[320px]">
        {discount && discount > 15 && (
          <Badge
            variant={"destructive"}
            className="absolute left-1 top-1 z-10 "
          >
            {parseInt(`${discount}`)}% off
          </Badge>
        )}
        <Link href={"product/" + product.id}>
          <Image
            src={product?.imageUrls?.[0] || "/placeholder.png"}
            alt={product.name}
            width={200}
            height={150}
            className="w-full h-44 object-cover rounded-lg hover:scale-[1.02] transition-transform "
          />
        </Link>
        <Link
          href={"product/" + product.id}
          className="line-clamp-2 text-md tracking-tight  text-ellipsis "
        >
          {product.name}
        </Link>
        <div className="flex flex-col-reverse">
          <div className="">
            <span className="text-lg ">{formatPrice(product.price)}</span>
            <small className="hidden md:inline ml-2 text-xs text-muted-foreground line-through">
              {product.oldPrice && formatPrice(product.oldPrice)}
            </small>
          </div>
          <div className="flex align-center gap-2">
            <Rating rating={4} long={true} />
            <span className="mt-1 text-muted-foreground text-sm">
              {product.rating}
            </span>
          </div>
        </div>
        <div className="hidden">
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
    </Card>
  );
}
