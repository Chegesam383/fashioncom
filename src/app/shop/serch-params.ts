import { SearchParams } from "nuqs/server";

export async function loadSearchParams(searchParams: Promise<SearchParams>) {
  const params = await searchParams;

  const rating = params.rating ? String(params.rating) : undefined;
  const category = params.category ? String(params.category) : undefined;
  const subcategories = params.subcategories
    ? typeof params.subcategories === "string"
      ? params.subcategories.split(",")
      : params.subcategories
    : undefined;
  const sizes = params.sizes
    ? typeof params.sizes === "string"
      ? params.sizes.split(",")
      : params.sizes
    : undefined;
  const minprice =
    params.minprice && typeof params.minprice === "string"
      ? parseFloat(params.minprice)
      : undefined;
  const maxprice =
    params.maxPrice && typeof params.maxprice === "string"
      ? parseFloat(params.maxprice)
      : undefined;
  const colors = params.colors
    ? typeof params.colors === "string"
      ? params.colors.split(",")
      : params.colors
    : undefined;

  return { category, subcategories, sizes, minprice, maxprice, colors, rating };
}
