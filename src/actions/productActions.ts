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
  lt,
  lte,
} from "drizzle-orm";
import { revalidatePath } from "next/cache";

interface ProductFilters {
  categoryId?: string;
  minprice?: number;
  maxprice?: number;
  category?: string;
  rating?: string;
  subcategories?: string[];
  [key: string]: unknown; // Allow arbitrary attribute filters
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
            lt(sql<number>`CAST(${products.price} AS REAL)`, filters.minprice)
          )
        : lt(sql<number>`CAST(${products.price} AS REAL)`, filters.minprice);
    }

    if (filters?.maxprice) {
      whereConditions = whereConditions
        ? and(
            whereConditions,
            gte(sql<number>`CAST(${products.price} AS REAL)`, filters.maxprice)
          )
        : gte(sql<number>`CAST(${products.price} AS REAL)`, filters.maxprice);
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
    Object.entries(filters).forEach(([key, value]) => {
      if (
        Array.isArray(value) &&
        key !== "subcategories" &&
        key !== "category"
      ) {
        if (value.length > 0) {
          const attributeFilter = sql`${
            products.attributes
          } -> 'availableAttributes' ->> ${key} IN (${value
            .map((val) => `'${val}'`)
            .join(", ")})`;
          whereConditions = whereConditions
            ? and(whereConditions, attributeFilter)
            : attributeFilter;
        }
      }
    });

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        attributes: product[0].attributes as Record<string, any>,
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
    const whereClauses: SQL[] = [];

    // Handle category slug
    if (filters?.category) {
      const categoryData = await db
        .select({ id: productCategories.id })
        .from(productCategories)
        .where(eq(productCategories.slug, filters.category));

      if (categoryData && categoryData.length > 0) {
        const categoryId = categoryData[0].id;
        whereClauses.push(eq(products.categoryId, categoryId));
      } else {
        // Category slug not found, return default results
        return {
          products: [],
          filters: {
            availableAttributes: {},
            minMaxPrices: { minPrice: 0, maxPrice: 100 },
          },
        };
      }
    }

    // Handle categoryId (if directly provided)
    if (filters?.categoryId) {
      whereClauses.push(eq(products.categoryId, filters.categoryId));
    }

    if (filters.minprice) {
      whereClauses.push(
        gte(products.price, Number(filters.minprice).toFixed(2))
      );
    }

    if (filters.maxprice) {
      console.log(filters.maxprice);

      whereClauses.push(
        lte(products.price, Number(filters.maxprice).toFixed(2))
      );
    }

    if (filters.rating) {
      whereClauses.push(gte(products.rating, filters.rating));
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
      }
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (
        Array.isArray(value) &&
        key !== "subcategories" &&
        key !== "category"
      ) {
        if (value.length > 0) {
          whereClauses.push(
            sql`${
              products.attributes
            } -> 'availableAttributes' ->> ${key} IN (${value
              .map((val) => `'${val}'`)
              .join(", ")})`
          );
        }
      }
    });

    let productQuery = db.select().from(products);
    let attributesQuery = db
      .select({ attributes: products.attributes })
      .from(products);

    if (whereClauses.length > 0) {
      productQuery = productQuery.where(
        and(...whereClauses)
      ) as typeof productQuery;
      attributesQuery = attributesQuery.where(
        and(...whereClauses)
      ) as typeof attributesQuery;
    }

    const productsResult = await productQuery;
    const attributesResults = await attributesQuery;
    const allAvailableAttributes: { [key: string]: string[] } = {};

    attributesResults.forEach((product) => {
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

    return {
      products: productsResult,
      filters: {
        availableAttributes: allAvailableAttributes,
      },
    };
  } catch (error) {
    console.error("Error fetching products and filters:", error);
    return {
      products: [],
      filters: {
        availableAttributes: {},
      },
    };
  }
}
