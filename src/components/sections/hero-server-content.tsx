// components/CarouselServer.tsx
import { getCategories } from "@/actions/categoryActions";

import CarouselPlugin from "./hero-client";

export default async function CarouselServer() {
  const categories = await getCategories();

  const filteredCategories = categories.slice(6, 8);

  // Pass filtered data to the client-side  component
  return <CarouselPlugin categories={filteredCategories} />;
}
