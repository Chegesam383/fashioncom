// components/CarouselServer.tsx
import { getCategories } from "@/actions/categoryActions";
import { getProducts } from "@/actions/productActions";

import CarouselPlugin from "./hero-client";

export default async function CarouselServer() {
  const categories = await getCategories();
  const products = await getProducts({ limit: 5 });

  const filteredCategories = categories.slice(4, 7);
  const filteredProducts = products.slice(0, 2);

  // Pass filtered data to the client-side  component
  return (
    <CarouselPlugin
      categories={filteredCategories}
      products={filteredProducts}
    />
  );
}
