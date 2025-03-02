// import { db } from "../db/index";
// import {
//   products,
//   productCategories,
//   productSubcategories,
// } from "../db/schema";
// import { faker } from "@faker-js/faker";

// export async function seedProducts() {
//   try {
//     console.log("🌱 Seeding products...");

//     const existingCategories = await db.select().from(productCategories);

//     if (existingCategories.length === 0) {
//       console.warn("⚠️ No categories found. Please seed categories first.");
//       return;
//     }

//     const existingSubcategories = await db.select().from(productSubcategories);

//     const response = await fetch("https://dummyjson.com/products?limit=100");
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const data = await response.json();
//     const dummyJsonProducts = data.products;

//     const dummyJsonProductsFormatted = dummyJsonProducts.map((product: any) => {
//       const category =
//         existingCategories.find((cat) => cat.name === product.category) || null;
//       const categoryId = category ? category.id : null;

//       const productSubcategoryIds = existingSubcategories
//         .filter((subcategory) => subcategory.categoryId === categoryId)
//         .map((subcategory) => subcategory.id);

//       const { attributeCombinations, availableAttributes } = generateAttributes(
//         category,
//         productSubcategoryIds,
//         product
//       );

//       return {
//         name: product.title,
//         description: product.description,
//         price: product.price.toString(),
//         oldPrice: product.discountPercentage
//           ? (product.price * (1 + product.discountPercentage / 100)).toFixed(2)
//           : null,
//         imageUrls: product.images,
//         categoryId: categoryId,
//         subcategories: productSubcategoryIds,
//         brand: product.brand,
//         stock: product.stock,
//         rating: product.rating.toString(),
//         isActive: true,
//         attributes: {
//           attributeCombinations: attributeCombinations,
//           availableAttributes: availableAttributes,
//         },
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       };
//     });

//     const createdProducts = await db
//       .insert(products)
//       .values(dummyJsonProductsFormatted)
//       .returning();

//     console.log(`✅ Seeded ${createdProducts.length} products.`);
//     console.log("🎉 Product seeding complete!");
//   } catch (error) {
//     console.error("❌ Error seeding products:", error);
//   }
// }

// function generateAttributes(
//   category: { name: string } | null,
//   subcategoryIds: string[],
//   product: {
//     title: string;
//     description: string;
//     price: number;
//     discountPercentage?: number;
//     images: string[];
//     category: string;
//     brand: string;
//     stock: number;
//     rating: number;
//   }
// ): {
//   attributeCombinations: { [key: string]: string | number }[];
//   availableAttributes: Record<string, string>;
// } {
//   const attributeCombinations: { [key: string]: string | number }[] = [];
//   let availableAttributes: Record<string, string> = {};

//   switch (category?.name) {
//     case "Fashion":
//       const colors = faker.helpers.arrayElements([
//         faker.color.human(),
//         faker.color.human(),
//         faker.color.human(),
//       ]);
//       const sizes = ["S", "M", "L", "XL", "8", "9", "10", "11"];

//       availableAttributes = {
//         color: colors.join(", "),
//         size: sizes.join(", "),
//       };

//       for (const color of colors) {
//         for (const size of sizes) {
//           attributeCombinations.push({
//             color: color,
//             size: size,
//             price: (
//               parseFloat(product.price.toString()) *
//               (1 +
//                 faker.number.float({
//                   min: -0.2,
//                   max: 0.3,
//                   fractionDigits: 2,
//                 }))
//             ).toFixed(2),
//           });
//         }
//       }
//       break;
//     case "Electronics":
//       const storages = ["64GB", "128GB", "256GB"];
//       const processors = ["A14", "A15", "Snapdragon 888"];

//       availableAttributes = {
//         storage: storages.join(", "),
//         processor: processors.join(", "),
//       };

//       for (const storage of storages) {
//         for (const processor of processors) {
//           attributeCombinations.push({
//             storage: storage,
//             processor: processor,
//             price: (
//               parseFloat(product.price.toString()) *
//               (1 +
//                 faker.number.float({
//                   min: -0.1,
//                   max: 0.2,
//                   fractionDigits: 2,
//                 }))
//             ).toFixed(2),
//           });
//         }
//       }
//       break;
//     default:
//       const materials = ["Leather", "Cotton", "Wool", "Synthetic"];
//       const styles = ["Casual", "Formal", "Sporty", "Classic"];

//       availableAttributes = {
//         material: materials.join(", "),
//         style: styles.join(", "),
//       };

//       for (const material of materials) {
//         for (const style of styles) {
//           attributeCombinations.push({
//             material: material,
//             style: style,
//             price: product.price.toString(),
//           });
//         }
//       }
//       break;
//   }

//   return { attributeCombinations, availableAttributes };
// }

// seedProducts();
