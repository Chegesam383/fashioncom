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
import type { ProductCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

import { ArrowRightCircle } from "lucide-react";
import { Card } from "../ui/card";

interface CarouselPluginProps {
  categories: ProductCategory[];
}

export default function CarouselPlugin({
  categories = [],
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
    <section className="lg:container max-w-5xl mx-auto p-4">
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
                <Card className="flex items-center shadow-none bg-gray-100 dark:bg-gray-800 justify-around h-full pb-4">
                  <div className=" md:h-[330px] flex-1">
                    <Image
                      src={category.imageUrl || "/placeholder.png"}
                      alt={category.name}
                      height={900}
                      width={900}
                      className="rounded-xl pointer-events-none w-full h-full object-contain flex-1"
                    />
                  </div>

                  <div className="mt-4 px-8  flex-1">
                    <h2 className=" text-xl md:text-2xl lg:text-4xl mb-4 font-semibold">
                      Shop {category.name.toLowerCase()}
                    </h2>
                    <p className="hidden md:block mb-4 text-muted-foreground line-clamp-2 h-[50px] max-w-[420px] text-ellipsis">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Delectus, rerum dolore. Quia, ipsum quidem deserunt quo
                      cumque, mollitia veniam impedit alias beatae architecto
                      minima, enim quam magnam! Harum, voluptates porro.
                    </p>
                    <Button>
                      <Link href={`/shop?category=${category.slug}`}>
                        Explore
                      </Link>
                      <ArrowRightCircle />
                    </Button>
                  </div>
                </Card>
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
    </section>
  );
}

export function CarouselSkeleton() {
  return (
    <div className="lg:container p-4 mx-auto ">
      <Skeleton className="h-[200px] md:h-[330px]" />
    </div>
  );
}
