"use client";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Rating from "@/components/rating/ratings";
import Image from "next/image";

import Empty from "@/components/shared/empty";

import AddToCartNoModal from "../_components/add-to-cart2";
import { formatPrice } from "@/lib/utils";
import { Product, Review } from "@/lib/types";

export interface ProductWithReviews extends Product {
  reviews: Review[];
}

export default function ProductPageClient({
  product,
}: {
  product: ProductWithReviews;
}) {
  const [selectedImage, setSelectedImage] = useState("");
  const [currentPrice, setCurrentPrice] = useState<string | number | undefined>(
    product.price
  );

  const priceDiff =
    Number(product?.oldPrice || 0) - Number(product?.price || 0);
  const discount = (priceDiff / Number(product?.price || 0)) * 100;

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Empty whatsEmpty="product" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="md:flex gap-2 flex-row-reverse">
          <div className="flex-1 aspect-square min-h-[400px] w-full rounded-2xl overflow-hidden ">
            <Image
              key={
                selectedImage || product?.imageUrls?.[0] || "/placeholder.png"
              }
              src={
                selectedImage || product?.imageUrls?.[0] || "/placeholder.png"
              }
              alt={product?.name}
              height={400}
              width={500}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-row md:flex-col overflow-y-auto gap-3">
            {product?.imageUrls?.map((image: string) => (
              <Image
                key={image}
                onClick={() => setSelectedImage(image)}
                height={100}
                width={100}
                src={image}
                alt={image}
                className={`${
                  selectedImage === image
                    ? "border-2 border-primary/50 opacity-100 p-1"
                    : "opacity-70"
                } rounded-2xl h-16 w-16 object-cover cursor-pointer`}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div className="space-y-4">
            {discount && discount > 0 && (
              <Badge variant={"destructive"}>
                {parseInt(`${discount}`)}% off
              </Badge>
            )}
            <h1 className="text-4xl font-medium">{product.name}</h1>
            <p className="text-2xl font-medium">
              {formatPrice(currentPrice || 0)}
            </p>
            <p className="text-muted-foreground line-clamp-4">
              {product.description}
            </p>
          </div>

          <div className="w-full">
            <AddToCartNoModal
              product={product}
              setCurrentPrice={setCurrentPrice}
              currentPrice={currentPrice}
            />
          </div>
        </div>
      </div>

      <Separator className="my-12" />

      {/* Reviews Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-medium">Customer Reviews</h2>
          <div className="flex items-center space-x-2">
            <Rating rating={Number(product.rating)} long />
            <span className="text-muted-foreground">
              {product.rating} out of 5
            </span>
          </div>
        </div>

        <ScrollArea className="h-[600px] rounded-lg">
          <div className="grid gap-6">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4 ">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{review.reviewerName}</p>
                    <Rating rating={review.rating} />
                  </div>
                  <p className="text-muted-foreground text-sm mt-1">
                    {review.createdAt &&
                      new Date(review.createdAt).toLocaleDateString()}
                  </p>
                  <p className="mt-2">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">
                No reviews yet for this product.
              </p>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
