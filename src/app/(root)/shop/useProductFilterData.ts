"use client";

import { useState, useEffect } from "react";
import { getProductsAndFilters } from "@/actions/productActions";
import { useSearchParams } from "next/navigation";
import { Product } from "@/lib/types";

interface ProductFilters {
  categoryId?: string;
  minprice?: number;
  maxprice?: number;
  rating?: string;
  subcategories?: string[];
  [key: string]: string[] | string | number | undefined;
}

export const useProductFiltersData = () => {
  const [filters, setFilters] = useState<ProductFilters>({});
  const [data, setData] = useState<{
    products: Product[];
    availableAttributes: { [key: string]: string[] };
    minMaxPrices: { minPrice: number; maxPrice: number };
  }>({
    products: [],
    availableAttributes: {},
    minMaxPrices: { minPrice: 0, maxPrice: 100 },
  });
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  const getFiltersFromParams = (): ProductFilters => {
    const filters: ProductFilters = {};
    searchParams.forEach((value, key) => {
      if (key === "subcategory") {
        filters.subcategories = [value];
      } else {
        filters[key] = value;
      }
    });
    return filters;
  };

  useEffect(() => {
    const filters = getFiltersFromParams();
    setFilters(filters);
  }, [searchParams]);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const result = await getProductsAndFilters(filters);
      let minPrice = 0;
      let maxPrice = 100;

      if (result.products && result.products.length > 0) {
        const prices = result.products
          .map((product) => Number(product.price))
          .filter((price) => !isNaN(price));

        if (prices.length > 0) {
          minPrice = Math.min(...prices);
          maxPrice = Math.max(...prices);
        }
      }

      setData({
        products: result.products,
        availableAttributes: result.filters.availableAttributes,
        minMaxPrices: { minPrice, maxPrice },
      });
      setIsLoading(false);
    }
    fetchData();
  }, [
    searchParams.get("category") || "",
    searchParams.get("subcategory") || "",
  ]);

  return {
    filters,
    products: data.products,
    availableAttributes: data.availableAttributes,
    minMaxPrices: data.minMaxPrices,
    isLoading,
  };
};
