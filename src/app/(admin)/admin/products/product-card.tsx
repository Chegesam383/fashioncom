"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import Rating from "@/components/rating/ratings";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const image =
    product.imageUrls?.[1] || product.imageUrls?.[0] || "/placeholder.png";

  const priceDiff =
    Number(product?.oldPrice || 0) - Number(product?.price || 0);

  const discount = (priceDiff / Number(product?.price || 0)) * 100;

  return (
    <Card
      key={product.id}
      className="p-2 shadow-none backdrop-blur border-0 relative transition-shadow rounded-xl  hover:shadow-lg"
    >
      <div className="flex flex-col gap-4 h-[370px]">
        {discount && discount > 15 ? (
          <Badge
            variant={"destructive"}
            className="absolute left-1 top-1 z-10 "
          >
            {parseInt(`${discount}`)}% off
          </Badge>
        ) : null}
        <Link href={"product/" + product.id}>
          <img
            src={image}
            alt={product.name}
            width={80}
            height={80}
            className="w-full h-44 object-contain rounded-lg hover:scale-[1.02] transition-transform "
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
        <div>
          <small
            className={`text-sm line-clamp-2 text-muted-foreground text-ellipsis`}
          >
            {product.description}
          </small>
        </div>
      </div>
      <div className="flex gap-2">
        <Button size={"sm"}>Edit</Button>
        <Button size={"sm"} variant={"outline"}>
          View Details
        </Button>
      </div>
    </Card>
  );
}
