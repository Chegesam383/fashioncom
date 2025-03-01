/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, use } from "react";
import { getProductById } from "@/actions/productActions";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Rating from "@/components/rating/ratings";
import Image from "next/image";
import { Product } from "@/lib/types";
import Empty from "@/components/shared/empty";
import { LoaderCircle } from "lucide-react";
import AddToCartNoModal from "../_components/add-to-cart2";
import { formatPrice } from "@/lib/utils";

export default function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setselectedImage] = useState("");

  const [currentPrice, setCurrentPrice] = useState<string | number | undefined>(
    undefined
  );

  const resolvedParams = use(params);
  const id = resolvedParams.productId;

  useEffect(() => {
    async function fetchProduct() {
      try {
        const fetchedProduct = await getProductById(id);
        setProduct(fetchedProduct);
        setCurrentPrice(fetchedProduct?.price);
      } catch (err) {
        setError("Failed to load product.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container flex flex-col items-center mx-auto px-4 py-8 h-[80vh] justify-center">
        <p className=" text-muted-foreground">Loading product details...</p>
        <LoaderCircle className="animate-spin " />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container flex flex-col items-center mx-auto px-4 py-8 h-[80vh] justify-center">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

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
        <div className="flex gap-2 flex-row-reverse">
          <div className="flex-1 aspect-square min-h-[500px] w-full rounded-2xl overflow-hidden bg-secondary/20 ">
            <Image
              key={
                selectedImage || product?.imageUrls?.[0] || "/placeholder.png"
              }
              src={
                selectedImage || product?.imageUrls?.[0] || "/placeholder.png"
              }
              alt={product?.name}
              height={500}
              width={500}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col overflow-y-auto  gap-3">
            {product?.imageUrls?.map((image: string) => (
              <Image
                key={image}
                onClick={() => setselectedImage(image)}
                height={100}
                width={100}
                src={image}
                alt={image}
                className={`${
                  selectedImage == image
                    ? "border-4 border-primary opacity-100 p-1"
                    : "opacity-70"
                } rounded-2xl h-14 w-14 object-cover cursor-pointer`}
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
            <h1 className="text-4xl font-medium">{product.name}</h1>
            <p className="text-2xl font-medium">
              ${formatPrice(currentPrice || 0)}
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
            <Rating rating={4} long />
            <span className="text-muted-foreground">
              {product.rating} out of 5
            </span>
          </div>
        </div>

        <ScrollArea className="h-[600px] rounded-lg">
          <div className="grid gap-6">
            {/* reviews will be rendered here */}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
