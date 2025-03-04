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
} from "@/components/ui/carousel";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getCategories } from "@/actions/categoryActions";
import { getProducts } from "@/actions/productActions";
import type { Product, ProductCategory } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function CarouselPlugin() {
  const plugin1 = React.useRef(Autoplay({ delay: 5000, playOnInit: true }));
  const plugin2 = React.useRef(Fade());
  const [categories, setCategories] = React.useState<ProductCategory[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories.slice(4, 7));
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts.slice(0, 2));
      } finally {
        setLoading(false);
      }
    };
    fetchCategoriesAndProducts();
  }, []);

  if (loading) {
    return (
      <React.Suspense fallback={<CarouselSkeleton />}>
        <CarouselSkeleton />
      </React.Suspense>
    );
  }

  return (
    <div className="lg:container p-4 mx-auto lg:grid grid-cols-3 gap-6 rounded-xl ">
      <div className="col-span-2 bg-muted/40 rounded-xl p-8 relative">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[plugin1.current, plugin2.current]}
          onMouseEnter={() => plugin1.current.stop()}
          onMouseLeave={() => plugin1.current.reset()}
        >
          <CarouselContent>
            {categories.map((category) => (
              <CarouselItem key={category.id}>
                <div className="flex gap-3  items-center justify-center h-[50vh]">
                  <Image
                    src={category.imageUrl || "/placeholder.png"}
                    alt={category.name}
                    height={600}
                    width={600}
                    className="rounded-xl pointer-events-none w-96 object-cover h-96"
                  />
                  <div className=" mt-4">
                    <h2 className="text-4xl font-bold mb-4">
                      Shop {category.name}
                    </h2>
                    <Button className="">
                      <Link href={`/shop?category=${category.slug}`}>
                        Explore
                      </Link>
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute top-[50%] right-4 transform -translate-y-1/2">
            <CarouselNext />
          </div>
          <div className="absolute top-[50%] left-4 transform -translate-y-1/2">
            <CarouselPrevious />
          </div>
        </Carousel>
      </div>

      <div className="mt-4 lg:mt-0 flex flex-col md:flex-row lg:flex-col gap-6 w-full mx-auto">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-4 bg-muted/40 rounded-xl p-4 flex-1"
          >
            <div>
              <h3 className="text-xl font-semibold">{product.name}</h3>
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
              className="rounded-xl object-cover w-full h-40"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function CarouselSkeleton() {
  return (
    <div className="lg:container p-4 mx-auto lg:grid grid-cols-3 gap-6 rounded-xl ">
      <div className="col-span-2 bg-muted/40 rounded-xl p-8 relative">
        <div className="flex gap-3 items-center justify-center h-[50vh]">
          <Skeleton className="w-full h-52 rounded-xl" />
          <div className="mt-4">
            <Skeleton className="w-64 h-8 mx-auto" />
            <Skeleton className="w-32 h-6 mt-4 mx-auto" />
          </div>
        </div>
      </div>

      <div className="mt-4 lg:mt-0 flex flex-col md:flex-row lg:flex-col gap-6 w-full mx-auto">
        <div className="flex items-center gap-4 bg-muted/40 rounded-xl p-4 flex-1">
          <div className="space-y-2">
            <Skeleton className="w-48 h-6" />
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-24 h-8 mt-4" />
          </div>
          <Skeleton className="w-40 h-40 rounded-xl" />
        </div>
        <div className="flex items-center gap-4 bg-muted/40 rounded-xl p-4 flex-1">
          <div className="space-y-2">
            <Skeleton className="w-48 h-6" />
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-24 h-8 mt-4" />
          </div>
          <Skeleton className="w-40 h-40 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
