import React from "react";
import { product, products } from "@/lib/fakedata";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { ShoppingCartIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import Rating from "./ratings";

interface ProductCardProps {
  product: product;
}

const Category = ({ title }) => {
  return (
    <section className="container p-4 mx-auto">
      <h1 className="text-3xl font-bold mb-5">{title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      ;
    </section>
  );
};

export default Category;

function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images[0].startsWith("http")
    ? product.images[0]
    : `https://i.imgur.com/${product.images[0]}`;

  return (
    <Card
      key={product.id}
      className="p-0 flex flex-col justify-between border-0"
    >
      <CardHeader className="px-3 pt-3 relative">
        <Image
          src={imageUrl}
          alt={product.title}
          width={250}
          height={250}
          className="w-full h-full object-cover rounded-t-lg"
        />

        <div className="p-3">
          <CardTitle>{product.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col">
        <div className="flex justify-between">
          <p className="text-xl font-bold">${product.price}</p>{" "}
          <div className="flex align-center gap-2">
            <Rating rating={4} long={true} /> <span className="mt-1">4</span>
          </div>
        </div>

        <CardDescription>{product.description.slice(0, 80)}...</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button>
          <ShoppingCartIcon className="size-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
