import { db } from "../db/index";
import {
  products,
  productCategories,
  productSubcategories,
} from "../db/schema";
import { faker } from "@faker-js/faker";

export async function seedProducts() {
  try {
    console.log("🌱 Seeding products...");

    const existingCategories = await db.select().from(productCategories);

    if (existingCategories.length === 0) {
      console.warn("⚠️ No categories found. Please seed categories first.");
      return;
    }

    const existingSubcategories = await db.select().from(productSubcategories);

    const productData = Array.from({ length: 20 }).map(() => {
      const category =
        existingCategories[
          Math.floor(Math.random() * existingCategories.length)
        ];
      const productName = faker.commerce.productName();
      const basePrice = parseFloat(
        faker.commerce.price({ min: 10, max: 1000, dec: 2 })
      );
      const oldPrice = faker.datatype.boolean()
        ? (
            basePrice *
            (1 + faker.number.float({ min: 0.1, max: 0.5, fractionDigits: 2 }))
          ).toFixed(2)
        : null;
      const imageUrls = [faker.image.url(), faker.image.url()];

      const attributeCombinations: { [key: string]: string | number }[] = [];
      let availableAttributes: Record<string, string[]> = {};
      const subcategoryIds: string[] = [];

      if (existingSubcategories.length > 0) {
        const numberOfSubcategories = Math.floor(Math.random() * 3); // 0, 1, or 2 subcategories
        for (let i = 0; i < numberOfSubcategories; i++) {
          const subcategory =
            existingSubcategories[
              Math.floor(Math.random() * existingSubcategories.length)
            ];
          if (subcategory.categoryId === category.id) {
            subcategoryIds.push(subcategory.id);
          }
        }
      }

      switch (category.name) {
        case "Fashion":
          const colors = faker.helpers.arrayElements([
            faker.color.human(),
            faker.color.human(),
            faker.color.human(),
          ]);
          const sizes = ["S", "M", "L", "XL", "8", "9", "10", "11"];

          availableAttributes = {
            color: colors,
            size: sizes,
          };

          for (const color of colors) {
            for (const size of sizes) {
              attributeCombinations.push({
                color: color,
                size: size,
                price: (
                  basePrice *
                  (1 +
                    faker.number.float({
                      min: -0.2,
                      max: 0.3,
                      fractionDigits: 2,
                    }))
                ).toFixed(2),
              });
            }
          }
          break;
        case "Electronics":
          const storages = ["64GB", "128GB", "256GB"];
          const processors = ["A14", "A15", "Snapdragon 888"];

          availableAttributes = {
            storage: storages,
            processor: processors,
          };

          for (const storage of storages) {
            for (const processor of processors) {
              attributeCombinations.push({
                storage: storage,
                processor: processor,
                price: (
                  basePrice *
                  (1 +
                    faker.number.float({
                      min: -0.1,
                      max: 0.2,
                      fractionDigits: 2,
                    }))
                ).toFixed(2),
              });
            }
          }
          break;
        // Add similar logic for other categories as needed
        default:
          const materials = ["Leather", "Cotton", "Wool", "Synthetic"];
          const styles = ["Casual", "Formal", "Sporty", "Classic"];

          availableAttributes = {
            material: materials,
            style: styles,
          };

          for (const material of materials) {
            for (const style of styles) {
              attributeCombinations.push({
                material: material,
                style: style,
                price: basePrice.toFixed(2),
              });
            }
          }
          break;
      }

      return {
        name: productName,
        description: faker.commerce.productDescription(),
        price: basePrice.toFixed(2),
        oldPrice: oldPrice,
        imageUrls: imageUrls,
        category: category.id,
        subcategories: subcategoryIds,
        brand: faker.company.name(),
        stock: faker.number.int({ min: 0, max: 100 }),
        rating: faker.number
          .float({ min: 0, max: 5, fractionDigits: 1 })
          .toString(),
        isActive: faker.datatype.boolean(),
        attributes: {
          attributeCombinations: attributeCombinations,
          availableAttributes: availableAttributes,
        },
      };
    });

    const createdProducts = await db
      .insert(products)
      .values(productData)
      .returning();

    console.log(`✅ Seeded ${createdProducts.length} products.`);
    console.log("🎉 Product seeding complete!");
  } catch (error) {
    console.error("❌ Error seeding products:", error);
  }
}

seedProducts();
