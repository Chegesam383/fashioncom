"use client";

import { useState, useEffect } from "react";
import { getProductsAndFilters } from "@/actions/productActions"; // Updated import
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
  }); // Initialize products
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
      const result = await getProductsAndFilters(filters); // Use combined action
      setData({
        products: result.products,
        availableAttributes: result.filters.availableAttributes,
        minMaxPrices: result.filters.minMaxPrices,
      }); // Update data state
      setIsLoading(false);
    }
    fetchData();
  }, [
    searchParams.get("category") || "",
    searchParams.get("subcategory") || "",
  ]);

  return {
    filters,
    products: data.products, // Return products
    availableAttributes: data.availableAttributes,
    minMaxPrices: data.minMaxPrices,
    isLoading,
  };
};
