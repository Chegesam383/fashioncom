import { getCategories } from "@/actions/categoryActions";

import CarouselPlugin from "./hero-client";

export default async function CarouselServer() {
  const categories = await getCategories();

  const filteredCategories = categories.slice(7, 11);

  return <CarouselPlugin categories={filteredCategories} />;
}
