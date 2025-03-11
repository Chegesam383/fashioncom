import ProductCard from "@/components/product/product-card";
import React from "react";
import { getProductsAndFilters } from "@/actions/productActions";
import { Product } from "@/lib/types";
import { Filters, MobileFilters } from "./_components/filters";
import { SearchParams } from "nuqs/server";
import { loadSearchParams } from "./serch-params";
import { Skeleton } from "@/components/ui/skeleton";
import { ShopPagination } from "./_components/pagination";
import FilterControls from "./_components/topfilter";

interface ShopPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  let products: Product[] = [];
  let errorMessage: string | null = null;
  let loading: boolean = true;
  let totalCount: number = 0;
  const params = await loadSearchParams(searchParams);

  let filtersData: {
    availableAttributes: { [key: string]: string[] };
    minMaxPrices: { minPrice: number; maxPrice: number };
  } = {
    availableAttributes: {},
    minMaxPrices: { minPrice: 0, maxPrice: 100 },
  };

  console.log("p", params);

  try {
    const result = await getProductsAndFilters(params);
    products = result.products;
    filtersData = result.filters; // Extract filters data
    totalCount = result.totalCount;
  } catch (error) {
    console.error("Error fetching products:", error);
    errorMessage = "An error occurred while fetching products.";
  } finally {
    loading = false;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="hidden md:block">
            <div className="space-y-4">
              <Skeleton className="w-full h-8 rounded-md" />
              <Skeleton className="w-full h-32 rounded-md" />
              <Skeleton className="w-full h-16 rounded-md" />
              <Skeleton className="w-full h-24 rounded-md" />
            </div>
          </div>
          <MobileFilters
            initialProducts={JSON.parse(JSON.stringify(products))}
            filtersData={filtersData} // Pass filters data
          />
          <div className="flex-1">
            <div className="grid grid-cols-1 xxs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index}>
                  <Skeleton className="w-full h-64 rounded-md" />
                  <div className="mt-2">
                    <Skeleton className="w-3/4 h-4 rounded-md" />
                    <Skeleton className="w-1/2 h-4 mt-1 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return <div className="container mx-auto px-4 py-8">{errorMessage}</div>;
  }

  return (
    <section className="lg:container mx-auto px-4 mt-1">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* filters */}
        <div>
          <div className="hidden lg:block">
            <Filters
              initialProducts={JSON.parse(JSON.stringify(products))}
              filtersData={filtersData} // Pass filters data
            />
          </div>
          <MobileFilters
            initialProducts={JSON.parse(JSON.stringify(products))}
            filtersData={filtersData} // Pass filters data
          />
        </div>

        {/* products */}
        <div className="flex-1">
          <FilterControls />
          <div className="grid grid-cols-2  md:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.isArray(products) && products.length > 0 ? (
              products.map((product) => (
                <ProductCard product={product} key={product.id} />
              ))
            ) : (
              <div className="col-span-4 flex flex-col text-center">
                <p className="text-semibold text-xl mt-52">
                  No products found!
                </p>
                <p className="text-muted-foreground ">
                  Try adjusting your filters
                </p>
              </div>
            )}
          </div>
          <ShopPagination
            totalPages={Math.round(totalCount / (params.limit || 10))}
          />
        </div>
      </div>
    </section>
  );
}
