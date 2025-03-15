import React from "react";
import ProductPageClient, { ProductWithReviews } from "./page-client";
import { getProductById } from "@/actions/productActions";

const Page = async ({ params }: { params: Promise<{ productId: string }> }) => {
  const id = (await params).productId;

  const product: ProductWithReviews | null = await getProductById(id);

  return (
    <ProductPageClient
      product={
        product || {
          id: "",
          attributes: { availableAttributes: [] },
          name: "",
          imageUrls: [],
          price: "",
          reviews: [],
        }
      }
    />
  );
};

export default Page;
