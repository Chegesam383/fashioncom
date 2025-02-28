import { db } from "../db/index";
import { eq } from "drizzle-orm";
import { productCategories, productSubcategories } from "../db/schema";
import { faker } from "@faker-js/faker";
async function seedCategoriesAndSubcategories() {
  try {
    console.log("🌱 Seeding categories and subcategories...");

    const predefinedCategories = [
      "Electronics",
      "Fashion",
      "Furniture",
      "Books",
      "Home & Garden",
      "Sports & Outdoors",
      "Beauty & Personal Care",
      "Toys & Games",
      "Automotive",
      "Grocery",
    ];

    for (const categoryName of predefinedCategories) {
      const existingCategory = await db
        .select()
        .from(productCategories)
        .where(eq(productCategories.name, categoryName));
      if (existingCategory.length === 0) {
        const insertedCategory = await db
          .insert(productCategories)
          .values({
            name: categoryName,
            slug: faker.helpers.slugify(categoryName),
            imageUrl: `https://source.unsplash.com/random/200x200/?${
              categoryName.split(" ")[0]
            }`,
          })
          .returning();

        const categoryId = insertedCategory[0].id;

        const subcategories = Array.from({
          length: faker.number.int({ min: 2, max: 5 }),
        }).map(() => ({
          name: faker.commerce.department(),
          slug: faker.helpers.slugify(faker.commerce.department()),
          imageUrl: faker.image.url(),
          categoryId: categoryId,
        }));

        await db.insert(productSubcategories).values(subcategories);
      }
    }
    console.log("🎉 Categories and subcategories seeding complete!");
  } catch (error) {
    console.error("❌ Error seeding categories and subcategories:", error);
  }
}

async function main() {
  await seedCategoriesAndSubcategories();
  // await seedProducts();
  process.exit(0);
}

main();
