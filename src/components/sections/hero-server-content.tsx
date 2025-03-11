// components/CarouselServer.tsx
import { getCategories } from "@/actions/categoryActions";
import { getProducts } from "@/actions/productActions";

import CarouselPlugin from "./hero-client";

export default async function CarouselServer() {
  const categories = await getCategories();
  const products = await getProducts({ limit: 6 });

  const filteredCategories = categories.slice(6, 8);
  const filteredProducts = products.slice(4, 6);

  // Pass filtered data to the client-side  component
  return (
    <CarouselPlugin
      categories={filteredCategories}
      products={filteredProducts}
    />
  );
}
