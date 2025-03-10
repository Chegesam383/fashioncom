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

  const minprice =
    params.minprice && typeof params.minprice === "string"
      ? parseFloat(params.minprice)
      : undefined;
  const maxprice =
    params.maxprice && typeof params.maxprice === "string"
      ? parseFloat(params.maxprice)
      : undefined;

  return { category, subcategories, minprice, maxprice, rating };
}
