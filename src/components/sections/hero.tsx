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

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CarouselPlugin() {
  const plugin1 = React.useRef(Autoplay({ delay: 5000, playOnInit: true }));
  const plugin2 = React.useRef(Fade());

  const banners = [
    {
      title: "New Watch arrivals",
      imageURL: "/banner2.jpg",
      buttonCaption: "Explore",
      href: "/shop?category=watches",
    },
    {
      title: "Running shoes available",
      imageURL: "/banner3.jpg",
      buttonCaption: "Explore",
      href: "/shop?category=running-shoes",
    },
  ];

  return (
    <section className=" lg:container rounded-xl mx-auto border ">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[plugin1.current, plugin2.current]}
        onMouseEnter={() => plugin1.current.stop}
        onMouseLeave={() => plugin1.current.reset}
      >
        <CarouselContent>
          {banners.map((item, index) => (
            <CarouselItem key={index}>
              <div className="relative">
                <Image
                  src={`${item.imageURL}`}
                  alt={item.imageURL}
                  height={300}
                  width={600}
                  className=" rounded-xl pointer-events-none w-full"
                />
                <div className="absolute w-1/3 left-10 text-black top-1/2 transform -translate-y-1/2">
                  <h2 className="leading-tight  text-black text-2xl md:text-6xl font-bold mb-4 ">
                    {item.title.substring(0, 80)}
                  </h2>
                  <Button className="bg-black text-white">
                    <Link href={item.href}>
                      {item.buttonCaption || "Explore"}
                    </Link>
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute top-[50%] right-12">
          <CarouselNext className="-" />
        </div>
        <div className="absolute top-[50%] left-12">
          <CarouselPrevious className="-" />
        </div>
      </Carousel>
    </section>
  );
}
