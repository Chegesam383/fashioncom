import ProductCard from "@/components/product/product-card";
import React from "react";
import { getProducts } from "@/actions/productActions";
import Empty from "@/components/shared/empty";
import { Product } from "@/lib/types";
import { getCategoryBySlug } from "@/actions/categoryActions";

interface ShopPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  let products: Product[] = [];
  let errorMessage: string | null = null;
  let loading: boolean = true;

  const resolvedSearchParams = await searchParams;

  try {
    if (resolvedSearchParams.category) {
      const category = await getCategoryBySlug(resolvedSearchParams.category);

      if (!category) {
        errorMessage = "Category not found.";
      } else {
        products = await getProducts({ categoryId: category.id });
      }
    } else {
      products = await getProducts();
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    errorMessage = "An error occurred while fetching products.";
  } finally {
    loading = false;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return <div className="container mx-auto px-4 py-8">{errorMessage}</div>;
  }

  if (!products || products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Empty whatsEmpty="products" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <div className="grid grid-cols-1 xxs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.isArray(products) &&
              products.map((product) => (
                <ProductCard product={product} key={product.id} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
