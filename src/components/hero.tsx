"use client";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";

import { extractColors } from "extract-colors";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { products } from "@/lib/fakedata";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import Rating from "./ratings";

export default function CarouselPlugin() {
  const plugin1 = React.useRef(Autoplay({ delay: 5000, playOnInit: true }));
  const plugin2 = React.useRef(Fade());

  const [colors, setColors] = React.useState<string[]>([]);

  // Prefetch colors
  React.useEffect(() => {
    const fetchColors = async () => {
      const colorPromises = products.map(async (product) => {
        const pl = await extractColors(product.images[0]);
        return pl ? pl.reverse()[0]?.hex : "";
      });
      const resolvedColors = await Promise.all(colorPromises);
      setColors(resolvedColors);
    };

    fetchColors();
  }, []);

  return (
    <section className="container p-4 mx-auto">
      <Carousel
        plugins={[plugin1.current, plugin2.current]}
        className="w-full "
        onMouseEnter={plugin1.current.stop}
        onMouseLeave={plugin1.current.reset}
      >
        <CarouselContent>
          {products.map((product, index) => (
            <CarouselItem key={product.id}>
              <div className=" flex gap-0 p-0">
                <div>
                  <Image
                    src={product.images[0]}
                    height={100}
                    width={100}
                    className="h-80 w-80 aspect-square rounded-tl-2xl rounded-bl-2xl"
                    alt={product.title}
                  />
                </div>

                <div
                  className="flex-1 flex-grow p-4 pl-20 rounded-tr-2xl rounded-br-2xl"
                  style={{
                    background: `linear-gradient(to right, ${
                      colors[index] || ""
                    }, ${colors[index + 1] || ""}`,
                  }}
                >
                  <h3 className="text-2xl font-bold text-slate-950 mb-5">
                    {product.title}
                  </h3>
                  <p className="text-ellipsis max-w-100 text-black/70">
                    {product.description.slice(0, 350)}
                  </p>

                  <div className=" mt-4">
                    <p className="text-xl font-bold">${product.price}</p>{" "}
                    <div className="flex align-center gap-2">
                      <Rating rating={4} long={true} />{" "}
                      <span className="mt-1">4</span>
                    </div>
                  </div>

                  <Button className="mt-10">
                    Add to cart <ShoppingCart />
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
