"use client";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";

//import { extractColors } from "extract-colors";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Image from "next/image";

import { Button } from "./ui/button";

import { cn } from "@/lib/utils";

export default function CarouselPlugin() {
  const plugin1 = React.useRef(Autoplay({ delay: 5000, playOnInit: true }));
  const plugin2 = React.useRef(Fade());

  const banners = [
    {
      title: "New Watch arrivals",
      imageURL: "/banner2.jpg",
      buttonCaption: "Explore",
    },
    {
      title: "Running shoes available",
      imageURL: "/banner3.jpg",
      buttonCaption: "Explore",
    },
  ];

  // const [colors, setColors] = React.useState<string[]>([]);

  // Prefetch colors
  // React.useEffect(() => {
  //  const fetchColors = async () => {
  //   const colorPromises = products.map(async (product) => {
  //     const pl = await extractColors(product.images[0]);
  //     return pl ? pl.reverse()[0]?.hex : "";
  //   });
  //   const resolvedColors = await Promise.all(colorPromises);
  //   setColors(resolvedColors);
  // };

  //  fetchColors();
  // }, []);

  return (
    <section className="container p-4 mx-auto">
      <Carousel
        plugins={[plugin1.current, plugin2.current]}
        className="w-full "
        onMouseEnter={plugin1.current.stop}
        onMouseLeave={plugin1.current.reset}
      >
        <CarouselContent>
          {banners.map((item, index) => (
            <CarouselItem key={index}>
              <div className="relative w-full h-full">
                <Image
                  src={item.imageURL}
                  height={300}
                  width={600}
                  alt={item.imageURL}
                  className="w-full rounded-xl pointer-events-none"
                />
                <div className="absolute w-1/3 left-16 md:left-32 top-1/2 transform -translate-y-1/2">
                  <h2
                    className={cn(
                      "text-xl md:text-6xl font-bold mb-4   dark:text-slate-900"
                    )}
                  >
                    {item.title}
                  </h2>
                  <Button className="hidden md:block dark:text-slate-950 ">
                    {item.buttonCaption || "Explore"}
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext className="mr-7" />
        <CarouselPrevious className="ml-7" />
      </Carousel>
    </section>
  );
}
