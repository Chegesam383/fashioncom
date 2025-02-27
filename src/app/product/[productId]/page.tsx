"use client";
import { useState } from "react";

import { use } from "react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Rating from "@/components/rating/ratings";

const SIZES = ["XS", "S", "M", "L", "XL"];

const COLORS = [
  {
    name: "Midnight Black",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&fit=crop",
  },
  {
    name: "Arctic White",
    image:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&fit=crop",
  },
  {
    name: "Ocean Blue",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&fit=crop",
  },
];

const REVIEWS = [
  {
    id: 1,
    author: "Sarah M.",
    rating: 5,
    date: "2 weeks ago",
    content:
      "Absolutely love this product. The quality is outstanding and it fits perfectly.",
    helpful: 24,
  },
  {
    id: 2,
    author: "James R.",
    rating: 4.5,
    date: "1 month ago",
    content: "Great design and comfortable fit. Would definitely recommend.",
    helpful: 18,
  },
  {
    id: 3,
    author: "Emma L.",
    rating: 5,
    date: "2 months ago",
    content:
      "Perfect fit and exactly what I was looking for. The color is beautiful in person.",
    helpful: 15,
  },
];
function ProductPage({ params }: { params: Promise<{ productId: string }> }) {
  const resolvedParams = use(params); // Unwrapping the Promise

  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedSize, setSelectedSize] = useState(SIZES[2]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="flex gap-2 flex-row-reverse">
          <div className="flex-1 aspect-square min-h-[500px] w-full rounded-2xl overflow-hidden bg-secondary/20 ">
            <img
              src={selectedColor.image}
              alt={selectedColor.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col overflow-y-auto  gap-3">
            {COLORS.map((color) => (
              <img
                key={color.name}
                onClick={() => setSelectedColor(color)}
                src={color.image}
                alt={color.name}
                className={` ${
                  selectedColor.name === color.name
                    ? "border-4 border-primary opacity-100"
                    : "opacity-70"
                } rounded-xl h-20`}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div className="space-y-4">
            <Badge className="bg-secondary text-secondary-foreground">
              New Arrival
            </Badge>
            <h1 className="text-4xl font-medium">
              Premium Product {resolvedParams.productId}
            </h1>
            <p className="text-2xl font-medium">$199.99</p>
            <p className="text-muted-foreground">
              Experience ultimate comfort and style with our premium product,
              crafted with the finest materials.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              Color - {selectedColor.name}
            </h3>
            <div className="flex flex-wrap gap-4">
              {COLORS.map((color) => (
                <img
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  src={color.image}
                  alt={color.name}
                  className={` ${
                    selectedColor.name === color.name
                      ? "border-4 border-primary"
                      : ""
                  } rounded-xl h-14`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Size</h3>
            <div className="flex flex-wrap gap-3">
              {SIZES.map((size) => (
                <Button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  variant={`${selectedSize === size ? "default" : "outline"}`}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          <Button className="w-full" size="lg">
            Add to Cart
          </Button>
        </div>
      </div>

      <Separator className="my-12" />

      {/* Reviews Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-medium">Customer Reviews</h2>
          <div className="flex items-center space-x-2">
            <Rating rating={4} long />
            <span className="text-muted-foreground">4.8 out of 5</span>
          </div>
        </div>

        <ScrollArea className="h-[600px] rounded-lg">
          <div className="grid gap-6">
            {REVIEWS.map((review) => (
              <Card key={review.id} className="review-card p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{review.author}</p>
                      <p className="text-sm text-muted-foreground">
                        {review.date}
                      </p>
                    </div>
                    <div className="star-rating">
                      <Rating rating={4} long />
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.content}</p>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Helpful ({review.helpful})
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

export default ProductPage;
