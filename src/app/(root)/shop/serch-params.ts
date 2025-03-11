import { SearchParams } from "nuqs/server";

export async function loadSearchParams(searchParams: Promise<SearchParams>) {
  const params = await searchParams;
  const rating = params.rating ? String(params.rating) : undefined;
  const limit = params.limit ? Number(params.limit) : undefined;
  const sort = params.sort ? String(params.sort) : undefined;
  const page = params.page ? Number(params.page) : undefined;
  const category = params.category ? String(params.category) : undefined;
  const subcategories = params.subcategories
    ? typeof params.subcategories === "string"
      ? params.subcategories.split(",")
      : params.subcategories
    : undefined;

  const minprice = params.minprice ? Number(params.minprice) : undefined;
  const maxprice = params.maxprice ? Number(params.maxprice) : undefined;

  // Parse the attributes parameter
  let attributes = undefined;
  if (params.attributes && typeof params.attributes === "string") {
    try {
      attributes = JSON.parse(params.attributes);
    } catch (error) {
      console.error("Error parsing attributes:", error);
      // Handle the error appropriately, e.g., set attributes to an empty object or undefined
      attributes = {}; // or undefined, depending on your needs.
    }
  }

  return {
    category,
    subcategories,
    minprice,
    maxprice,
    rating,
    attributes,
    page,
    limit,
    sort,
  };
}
