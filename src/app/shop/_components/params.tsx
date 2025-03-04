"use client";
import React from "react";
import { useSearchParams } from "next/navigation";

export function ShopURLParams() {
  const searchParams = useSearchParams();

  // Get individual parameters
  const category = searchParams.get("category");
  const subcategoriesString = searchParams.get("subcategories");
  const sizesString = searchParams.get("sizes");
  const minprice = searchParams.get("minprice");
  const maxprice = searchParams.get("maxprice");
  const colorsString = searchParams.get("colors");
  const rating = searchParams.get("rating");

  // Parse arrays (comma-separated strings to arrays)
  const subcategories = subcategoriesString
    ? subcategoriesString.split(",")
    : [];
  const sizes = sizesString ? sizesString.split(",") : [];
  const colors = colorsString ? colorsString.split(",") : [];

  return (
    <div>
      <h2>Shop URL Parameters</h2>
      {category && <p>Category: {category}</p>}
      {subcategories.length > 0 && (
        <p>Subcategories: {subcategories.join(", ")}</p>
      )}
      {sizes.length > 0 && <p>Sizes: {sizes}</p>}
      {minprice && <p>Min Price: {minprice}</p>}
      {maxprice && <p>Max Price: {maxprice}</p>}
      {colors.length > 0 && <p>Colors: {colors.join(", ")}</p>}
      {rating && <p>Rating: {rating}</p>}

      <h3>All Parameters:</h3>
      <pre>
        {JSON.stringify(Object.fromEntries(searchParams.entries()), null, 2)}
      </pre>
    </div>
  );
}
