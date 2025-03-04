import ProductCard from "@/components/product/product-card";
import React from "react";
import { getProducts } from "@/actions/productActions";

import { Product } from "@/lib/types";
import { getCategoryBySlug } from "@/actions/categoryActions";
import { Filters, MobileFilters } from "./_components/filters";
import { SearchParams } from "nuqs/server";
import { loadSearchParams } from "./serch-params";

interface ShopPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  let products: Product[] = [];
  let errorMessage: string | null = null;
  let loading: boolean = true;

  try {
    const { category, ...rest } = await loadSearchParams(searchParams);

    if (category) {
      const categoryData = await getCategoryBySlug(
        Array.isArray(category) ? category[0] : category
      );

      products = await getProducts({
        categoryId: categoryData?.id,
        ...rest,
      });
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
        <div className="flex flex-col md:flex-row gap-8">
          <div className="hidden md:block">
            <Filters />
          </div>
          <MobileFilters />
          <div className="flex-1">No Products</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="hidden md:block">
          <Filters />
        </div>
        <MobileFilters />
        <div className="flex-1">
          <div className="grid grid-cols-1 xxs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
