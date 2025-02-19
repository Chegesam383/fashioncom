"use client";

import { useRef, useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { categories } from "@/lib/fakedata";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ShopByCategory() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10); // 10px threshold
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []); // Removed carouselRef from dependencies

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.8;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <section className="bg-slate-50 dark:bg-slate-950 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Shop by categories</h2>
          <p className="mt-2 text-gray-600">Explore popular categories</p>
        </div>
        <div className="relative">
          <div
            ref={carouselRef}
            className="flex overflow-x-auto py-4 snap-x snap-mandatory scrollbar-hide"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {categories.slice(0, 8).map((category, index) => (
              <div
                key={category.name}
                className={`flex-none w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 px-0 snap-start ${
                  index === categories.length - 1 ? "mr-[100vw]" : ""
                }`}
              >
                <div className="group rounded-xl shadow-none p-0 m-0 hover:shadow-lg transition-all duration-300 h-full">
                  <div className="flex flex-col items-center justify-center">
                    <div className="h-40 w-40">
                      <img
                        src={category.image}
                        width={400}
                        height={400}
                        alt={category.image}
                        className="aspect-square rounded-xl h-full w-full object-cover m-0"
                      />
                    </div>
                    <span className="text-sm font-medium text-center">
                      {category.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {canScrollLeft && (
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2  backdrop-blur-sm"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          {canScrollRight && (
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2  backdrop-blur-sm"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
