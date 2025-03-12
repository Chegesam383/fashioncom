"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Product, ProductCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

interface CarouselPluginProps {
  categories: ProductCategory[];
  products: Product[];
}

export default function CarouselPlugin({
  categories = [],
  products = [],
}: CarouselPluginProps) {
  const plugin1 = React.useRef(Autoplay({ delay: 5000, playOnInit: true }));
  const plugin2 = React.useRef(Fade());
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [current, setCurrent] = React.useState(0);

  // Update current slide when carousel changes
  React.useEffect(() => {
    if (!api) return;

    const updateCurrent = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", updateCurrent);
    updateCurrent(); // Set initial slide

    return () => {
      api.off("select", updateCurrent);
    };
  }, [api]);

  return (
    <div className="lg:container mx-auto lg:grid grid-cols-3 gap-4 rounded-xl">
      <div className="col-span-2 bg-white dark:bg-slate-950 border rounded-xl relative">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[plugin1.current, plugin2.current]}
          onMouseEnter={() => plugin1.current.stop()}
          onMouseLeave={() => plugin1.current.reset()}
          setApi={setApi} // Connect Carousel API
        >
          <CarouselContent>
            {categories.length > 0 ? (
              categories.map((category) => (
                <CarouselItem key={category.id}>
                  <div className="sm:flex gap-3 items-center justify-center lg:h-[50vh] py-2">
                    <Image
                      src={category.imageUrl || "/placeholder.png"}
                      alt={category.name}
                      height={600}
                      width={600}
                      className="rounded-xl pointer-events-none w-full md:w-96 object-cover h-96"
                    />
                    <div className="mt-4 px-8 text-center md:text-left">
                      <h2 className="text-4xl mb-4">
                        Shop {category.name.toLowerCase()}
                      </h2>
                      <p className="mb-4 text-muted-foreground line-clamp-2 text-ellipsis">
                        {category.description}
                      </p>
                      <Button className="mb-8">
                        <Link href={`/shop?category=${category.slug}`}>
                          Explore
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              ))
            ) : (
              <CarouselItem>
                <div className="text-center py-10">
                  <p>No categories available</p>
                </div>
              </CarouselItem>
            )}
          </CarouselContent>
          <div className="absolute top-[50%] right-14 transform -translate-y-1/2">
            <CarouselNext />
          </div>
          <div className="absolute top-[50%] left-14 transform -translate-y-1/2">
            <CarouselPrevious />
          </div>
          {/* Pagination Dots */}
          {categories.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {categories.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all duration-300",
                    current === index
                      ? "bg-gray-800 dark:bg-gray-200 scale-125"
                      : "bg-gray-400 dark:bg-gray-600"
                  )}
                  onClick={() => api?.scrollTo(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </Carousel>
      </div>

      <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row lg:flex-col gap-4 w-full mx-auto">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 justify-between border rounded-xl p-4 w-full bg-white dark:bg-slate-950"
            >
              <div className="flex-1">
                <h3 className="text-xl">{product.name}</h3>
                <p className="mt-2">${product.price}</p>
                <Button className="mt-4">
                  <Link href={`/product/${product.id}`}>View Product</Link>
                </Button>
              </div>
              <Image
                src={
                  product.imageUrls && product.imageUrls.length > 0
                    ? product.imageUrls[0]
                    : "/placeholder.png"
                }
                alt={product.name}
                width={200}
                height={200}
                className="rounded-xl object-cover w-40 h-40"
              />
            </div>
          ))
        ) : (
          <div className="text-center p-4 w-full">
            <p>No products available</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function CarouselSkeleton() {
  return (
    <div className="lg:container p-4 mx-auto lg:grid grid-cols-3 gap-6 rounded-xl">
      <div className="col-span-2 bg-muted/40 rounded-xl relative">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-center lg:h-[50vh] py-2">
          <Skeleton className="rounded-xl w-96 h-96" />
          <div className="mt-4 px-8 flex flex-col items-start">
            <Skeleton className="w-80 h-12 mb-4" />
            <Skeleton className="w-32 h-10" />
          </div>
        </div>
      </div>
      <div className="mt-4 lg:mt-0 flex flex-col md:flex-row lg:flex-col gap-6 w-full mx-auto">
        <div className="flex items-center gap-4 bg-muted/40 rounded-xl p-4 flex-1">
          <div className="flex flex-col items-start">
            <Skeleton className="w-48 h-8 mb-2" />
            <Skeleton className="w-32 h-6 mb-4" />
            <Skeleton className="w-24 h-10" />
          </div>
          <Skeleton className="w-40 h-40 rounded-xl" />
        </div>
        <div className="flex items-center gap-4 bg-muted/40 rounded-xl p-4 flex-1">
          <div className="flex flex-col items-start">
            <Skeleton className="w-48 h-8 mb-2" />
            <Skeleton className="w-32 h-6 mb-4" />
            <Skeleton className="w-24 h-10" />
          </div>
          <Skeleton className="w-40 h-40 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
