"use server";

import { db } from "@/db";
import { products, productSubcategories, productCategories } from "@/db/schema";
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

export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    const product = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        imageUrls: products.imageUrls,
        category: productCategories.name,
        subcategories: products.subcategories,
        brand: products.brand,
        stock: products.stock,
        rating: products.rating,
        isActive: products.isActive,
        attributes: products.attributes,
      })
      .from(products)
      .leftJoin(
        productCategories,
        eq(products.categoryId, productCategories.id)
      )
      .where(eq(products.id, id))
      .limit(1);

    if (product.length > 0) {
      return {
        ...product[0],
        attributes: product[0].attributes as Record<string, unknown>,
      };
    } else {
      return undefined; // Product not found
    }
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return undefined; // Return undefined on error
  }
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

export async function addProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const price = formData.get("price") as string;
  const imageUrls = formData.get("imageUrls") as string;

  await db.insert(products).values({
    name,
    price,
    imageUrls: imageUrls.split(","),
  });

  revalidatePath("/products");
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
        .select({ id: productSubcategories.id })
        .from(productSubcategories)
        .where(inArray(productSubcategories.slug, filters.subcategories));

      const ids = subcategoryIds.map((sub) => sub.id);

      if (ids.length > 0) {
        whereClauses.push(
          sql`${products.subcategories} @> ${JSON.stringify(ids)}::jsonb`
        );
        categorySubcategoryClauses.push(
          sql`${products.subcategories} @> ${JSON.stringify(ids)}::jsonb`
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
