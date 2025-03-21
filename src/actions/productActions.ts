"use server";

import { db } from "@/db";
import {
  products,
  productSubcategories,
  productCategories,
  reviews,
} from "@/db/schema";
import { Product } from "@/lib/types";
import {
  and,
  inArray,
  sql,
  gte,
  ilike,
  or,
  SQL,
  eq,
  lte,
  asc,
  desc,
} from "drizzle-orm";

import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi(); // Uses UPLOADTHING_SECRET from .env

interface ProductFilters {
  category?: string;
  categoryId?: string;
  subcategories?: string[];
  minprice?: number;
  maxprice?: number;
  rating?: string;
  attributes?: { [key: string]: string[] };
  limit?: number;
  page?: number;
  sort?: string;
}

export async function addProductAction(formData: FormData) {
  try {
    // Extract data dynamically from FormData
    const data: Record<string, unknown> = {};
    const images: File[] = [];

    for (const [key, value] of formData.entries()) {
      if (key === "images" && value instanceof File) {
        images.push(value);
      } else {
        data[key] = value;
      }
    }

    // Parse core fields
    const name = data.name as string;
    const description = data.description as string;
    const price = parseFloat(data.price as string);
    const categoryId = data.category as string;
    const subcategories = data.subcategories
      ? JSON.parse(data.subcategories as string)
      : [];
    const stock = parseInt(data.stock as string, 10);
    const sku = (data.sku as string) || null;
    const attributes = data.attributes
      ? JSON.parse(data.attributes as string)
      : { availableAttributes: {}, attributeCombination: {} };

    // Upload images to Uploadthing
    let imageUrls: string[] = [];
    if (images.length > 0) {
      // Ensure images is treated as FileEsque[]
      const uploadResults = await utapi.uploadFiles(images); // No options object needed here

      // Extract URLs and handle errors
      imageUrls = uploadResults
        .map((result) => {
          if (result.error) {
            console.error(`Upload failed: ${result.error.message}`);
            return null;
          }
          return result.data?.url;
        })
        .filter((url): url is string => url !== null);

      if (imageUrls.length !== images.length) {
        throw new Error("Some images failed to upload");
      }
    }

    // Construct product object
    const product = {
      name,
      description,
      price: price.toString(),
      categoryId,
      subcategories,
      stock,
      sku,
      attributes,
      imageUrls,
    };

    const savedProduct = await db
      .insert(products)
      .values(product)
      .returning({ id: products.id });

    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/admin/products");
    return {
      success: true,
      product: savedProduct,
      message: "Product added successfully",
    };
  } catch (error) {
    console.error("Error in addProductAction:", error);
    throw new Error("Failed to add product");
  }
}

export async function getProducts(filters: ProductFilters) {
  try {
    let whereConditions: SQL<unknown> | undefined = undefined;

    // Handle category slug
    if (filters?.category) {
      const categoryData = await db
        .select({ id: productCategories.id })
        .from(productCategories)
        .where(eq(productCategories.slug, filters.category));

      if (categoryData && categoryData.length > 0) {
        const categoryId = categoryData[0].id;
        whereConditions = whereConditions
          ? and(whereConditions, eq(products.categoryId, categoryId))
          : eq(products.categoryId, categoryId);
      } else {
        return [];
      }
    }

    if (filters?.categoryId) {
      whereConditions = whereConditions
        ? and(whereConditions, eq(products.categoryId, filters.categoryId))
        : eq(products.categoryId, filters.categoryId);
    }

    if (filters?.minprice) {
      whereConditions = whereConditions
        ? and(
            whereConditions,
            gte(sql<number>`CAST(${products.price} AS REAL)`, filters.minprice)
          )
        : gte(sql<number>`CAST(${products.price} AS REAL)`, filters.minprice);
    }

    if (filters?.maxprice) {
      whereConditions = whereConditions
        ? and(
            whereConditions,
            lte(sql<number>`CAST(${products.price} AS REAL)`, filters.maxprice)
          )
        : lte(sql<number>`CAST(${products.price} AS REAL)`, filters.maxprice);
    }

    if (filters?.rating) {
      whereConditions = whereConditions
        ? and(
            whereConditions,
            gte(sql<number>`CAST(${products.rating} AS REAL)`, filters.rating)
          )
        : gte(sql<number>`CAST(${products.rating} AS REAL)`, filters.rating);
    }

    if (filters?.subcategories && filters?.subcategories.length > 0) {
      const subcategoryIds = await db
        .select({ id: productSubcategories.id })
        .from(productSubcategories)
        .where(inArray(productSubcategories.slug, filters.subcategories));

      const ids = subcategoryIds.map((sub) => sub.id);

      if (ids.length > 0) {
        whereConditions = whereConditions
          ? and(
              whereConditions,
              sql`${products.subcategories} @> ${JSON.stringify(ids)}::jsonb`
            )
          : sql`${products.subcategories} @> ${JSON.stringify(ids)}::jsonb`;
      }
    }

    // Handle attribute filters
    if (filters?.attributes) {
      Object.entries(filters.attributes).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          const attributeFilter = sql`${
            products.attributes
          } -> 'availableAttributes' ->> ${key} IN (${value
            .map((val) => `'${val}'`)
            .join(", ")})`;
          whereConditions = whereConditions
            ? and(whereConditions, attributeFilter)
            : attributeFilter;
        }
      });
    }

    const filteredProducts = await db.query.products.findMany({
      where: whereConditions,
    });

    return filteredProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductById(productId: string) {
  const product = await db
    .select()
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);

  if (!product.length) return null;

  const productReviews = await db
    .select()
    .from(reviews)
    .where(eq(reviews.productId, productId));

  return {
    ...product[0],
    reviews: productReviews,
  };
}

export async function getProductsBySearchTerm(
  searchTerm: string
): Promise<Product[]> {
  try {
    const results = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        imageUrls: products.imageUrls,
        categoryId: products.categoryId,
        subcategories: products.subcategories,
        categorySlug: productCategories.slug,
        categoryImage: productCategories.imageUrl,
        categoryName: productCategories.name,
        attributes: products.attributes,
      })
      .from(products)
      .leftJoin(
        productCategories,
        eq(products.categoryId, productCategories.id)
      )
      .where(
        or(
          ilike(products.name, `%${searchTerm}%`),
          ilike(products.description, `%${searchTerm}%`)
        )
      )
      .limit(10);

    return results;
  } catch (error) {
    console.error("Error fetching products by search term:", error);
    return [];
  }
}

export async function getProductsAndFilters(filters: ProductFilters) {
  try {
    const whereClauses: SQL[] = []; //tracks everything
    const categorySubcategoryClauses: SQL[] = []; //tracks items that should only change if category or subcategory change eg pricerange
    let productQuery = db.select().from(products);

    // Handle category slug
    if (filters?.category) {
      const categoryData = await db
        .select({ id: productCategories.id })
        .from(productCategories)
        .where(eq(productCategories.slug, filters.category));

      if (categoryData && categoryData.length > 0) {
        const categoryId = categoryData[0].id;
        whereClauses.push(eq(products.categoryId, categoryId));
        categorySubcategoryClauses.push(eq(products.categoryId, categoryId));
      }
    }

    if (filters?.categoryId) {
      whereClauses.push(eq(products.categoryId, filters.categoryId));
      categorySubcategoryClauses.push(
        eq(products.categoryId, filters.categoryId)
      );
    }

    if (filters?.subcategories && filters?.subcategories.length > 0) {
      const subcategoryIds = await db
        .select({ slug: productSubcategories.slug })
        .from(productSubcategories)
        .where(inArray(productSubcategories.slug, filters.subcategories));

      const slugs = subcategoryIds.map((sub) => sub.slug);

      if (slugs.length > 0) {
        whereClauses.push(
          sql`${products.subcategories} @> ${JSON.stringify(slugs)}::jsonb`
        );
        categorySubcategoryClauses.push(
          sql`${products.subcategories} @> ${JSON.stringify(slugs)}::jsonb`
        );
      }
    }

    // Calculate availableAttributes based on category and subcategory
    //attributes should only be caculated based on category & subcategory. what sets clothes diffrent is diffrent from what sets electronics diffrent
    let attributesBaseQuery = db
      .select({ attributes: products.attributes })
      .from(products);

    if (categorySubcategoryClauses.length > 0) {
      attributesBaseQuery = attributesBaseQuery.where(
        and(...categorySubcategoryClauses)
      ) as typeof attributesBaseQuery;
    }

    const attributesBaseResults = await attributesBaseQuery;
    const allAvailableAttributes: Record<string, string[]> = {};

    //convert it to an array of available attributes from material:['cotton','silk'...] color:[ 'red', 'blue'...]... t0  availablAttributes=[cotton','silk','red', 'blue'...]
    attributesBaseResults.forEach((product) => {
      if (product.attributes && product.attributes.availableAttributes) {
        Object.entries(product.attributes.availableAttributes).forEach(
          ([key, values]) => {
            if (!allAvailableAttributes[key]) {
              allAvailableAttributes[key] = [];
            }
            values.forEach((value) => {
              if (!allAvailableAttributes[key].includes(value)) {
                allAvailableAttributes[key].push(value);
              }
            });
          }
        );
      }
    });

    // MinMax Calculation Query
    //base query
    //next time we treat prices an number as postgress is ok with it & we dont need to cast as below
    let minMaxQuery = db
      .select({
        minPrice: sql<number>`min(${products.price})`.as("minPrice"),
        maxPrice: sql<number>`max(${products.price})`.as("maxPrice"),
      })
      .from(products);

    //we want to change the min & max price based on category or subcategory pricerange for electonics and groceries are way too diffrent
    if (categorySubcategoryClauses.length > 0) {
      minMaxQuery = minMaxQuery.where(
        and(...categorySubcategoryClauses)
      ) as typeof minMaxQuery;
    }

    const minMaxResult = await minMaxQuery;
    const minMaxPrices = minMaxResult[0] || { minPrice: 0, maxPrice: 500 };

    // Product and Attributes Queries

    if (filters.minprice) {
      whereClauses.push(
        gte(products.price, Number(filters.minprice).toFixed(2))
      );
    }

    if (filters.maxprice) {
      whereClauses.push(
        lte(products.price, Number(filters.maxprice).toFixed(2))
      );
    }

    if (filters.rating) {
      whereClauses.push(gte(products.rating, filters.rating));
    }

    if (filters?.attributes) {
      Object.entries(filters.attributes).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          whereClauses.push(
            sql`${
              products.attributes
            } -> 'availableAttributes' -> ${key} @> ${JSON.stringify(
              value
            )}::jsonb`
          );
        }
      });
    }

    if (whereClauses.length > 0) {
      productQuery = productQuery.where(
        and(...whereClauses)
      ) as typeof productQuery;
    }

    // Sorting //works on the product query(all products)
    if (filters.sort === "asc") {
      //@ts-expect-error works well for now
      productQuery = productQuery.orderBy(asc(products.price));
    } else if (filters.sort === "desc") {
      //@ts-expect-error works well for now
      productQuery = productQuery.orderBy(desc(products.price));
    }

    // Total Count Calculation (BEFORE pagination)
    let totalCountQuery = db
      .select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(products);

    if (whereClauses.length > 0) {
      totalCountQuery = totalCountQuery.where(
        and(...whereClauses)
      ) as typeof totalCountQuery;
    }

    const totalCountResult = await totalCountQuery;
    const totalCount = totalCountResult[0]?.count || 0;

    // Pagination (AFTER total count)
    const page = filters.page ? filters.page : 1;
    const limit = filters.limit || 10;
    //@ts-expect-error works well for now
    productQuery = productQuery
      .limit(Number(limit))
      .offset(Number((page - 1) * limit)); // Corrected offset calculation

    const productsResult = await productQuery;

    return {
      products: productsResult,
      filters: {
        availableAttributes: allAvailableAttributes,
        minMaxPrices: minMaxPrices,
      },
      totalCount: totalCount,
    };
  } catch (error) {
    console.error("Error fetching products and filters:", error);
    return {
      products: [],
      filters: {
        availableAttributes: {},
        minMaxPrices: { minPrice: 0, maxPrice: 100 },
      },
      totalCount: 0,
    };
  }
}
