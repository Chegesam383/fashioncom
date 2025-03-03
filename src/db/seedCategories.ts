import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { productCategories, productSubcategories } from "../db/schema";

async function seedCategoriesAndSubcategories() {
  try {
    console.log("🌱 Seeding categories and subcategories...");

    await db.delete(productSubcategories);
    console.log("🗑️ Deleted existing subcategories.");
    await db.delete(productCategories);
    console.log("🗑️ Deleted existing categories.");

    const response = await fetch("https://dummyjson.com/products/categories");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const categories = await response.json();

    const subcategoryMap = {
      smartphones: [
        "Android Phones",
        "iPhones",
        "Budget Phones",
        "Flagship Phones",
        "Foldable Phones",
        "Refurbished Phones",
      ],
      laptops: [
        "Gaming Laptops",
        "Ultrabooks",
        "Business Laptops",
        "Chromebooks",
        "2-in-1 Laptops",
        "Macbooks",
      ],
      fragrances: [
        "Perfumes",
        "Colognes",
        "Body Sprays",
        "Home Fragrances",
        "Gift Sets",
        "Candles & Diffusers",
      ],
      skincare: [
        "Cleansers",
        "Moisturizers",
        "Serums",
        "Masks",
        "Toners",
        "Exfoliators",
        "Sunscreen",
      ],
      groceries: [
        "Fruits & Vegetables",
        "Dairy & Eggs",
        "Meat & Seafood",
        "Bakery",
        "Pantry",
        "Beverages",
        "Frozen Foods",
        "Snacks",
      ],
      "home-decoration": [
        "Wall Decor",
        "Lighting",
        "Textiles",
        "Decorative Accents",
        "Mirrors",
        "Rugs",
        "Vases",
      ],
      furniture: [
        "Sofas & Couches",
        "Beds",
        "Tables",
        "Chairs",
        "Storage",
        "Outdoor Furniture",
        "Office Furniture",
        "Kids Furniture",
      ],
      tops: [
        "T-shirts",
        "Blouses",
        "Tank Tops",
        "Sweaters",
        "Hoodies",
        "Jackets",
      ],
      "womens-dresses": [
        "Casual Dresses",
        "Formal Dresses",
        "Party Dresses",
        "Maxi Dresses",
        "Cocktail Dresses",
        "Summer Dresses",
      ],
      "womens-shoes": [
        "Heels",
        "Flats",
        "Sandals",
        "Sneakers",
        "Boots",
        "Loafers",
      ],
      "mens-shirts": [
        "T-Shirts",
        "Dress Shirts",
        "Casual Shirts",
        "Polos",
        "Tank Tops",
        "Sweatshirts",
      ],
      "mens-watches": [
        "Luxury Watches",
        "Smartwatches",
        "Sports Watches",
        "Casual Watches",
        "Dress Watches",
        "Pocket Watches",
      ],
      "womens-bags": [
        "Handbags",
        "Totes",
        "Shoulder Bags",
        "Clutches",
        "Backpacks",
        "Wallets",
      ],
      "womens-jewellery": [
        "Necklaces",
        "Earrings",
        "Bracelets",
        "Rings",
        "Anklets",
        "Body Jewellery",
      ],
      sunglasses: [
        "Aviator",
        "Wayfarer",
        "Cat Eye",
        "Sports Sunglasses",
        "Polarized",
        "Designer",
      ],
      automotive: ["Cars", "Trucks", "SUVs", "Motorcycles", "Vans", "Boats"],
      motorcycle: [
        "Motorcycles",
        "Helmets",
        "Gear & Accessories",
        "Parts",
        "Tires",
        "Maintenance",
      ],
      lighting: [
        "Wall Decor",
        "Lighting",
        "Textiles",
        "Decorative Accents",
        "Mirrors",
        "Rugs",
        "Vases",
      ],
    };

    for (const category of categories) {
      const existingCategory = await db
        .select()
        .from(productCategories)
        .where(eq(productCategories.name, category.name));

      if (existingCategory.length === 0) {
        const categoryUrl = `https://dummyjson.com/products/category/${category.slug}`;
        const categoryResponse = await fetch(categoryUrl);
        if (!categoryResponse.ok) {
          throw new Error(`HTTP error! status: ${categoryResponse.status}`);
        }
        const categoryData = await categoryResponse.json();
        const firstProductThumbnail = categoryData.products[0]?.thumbnail;

        const insertedCategory = await db
          .insert(productCategories)
          .values({
            name: category.name,
            slug: category.slug,
            imageUrl: firstProductThumbnail,
          })
          .returning();

        const categoryId = insertedCategory[0].id;

        const subcategoriesForCategory = subcategoryMap[category.slug];

        if (subcategoriesForCategory) {
          const subcategories = subcategoriesForCategory.map(
            (subcategoryName) => ({
              name: subcategoryName,
              slug: subcategoryName.toLowerCase().replace(/ /g, "-"),
              imageUrl: `https://source.unsplash.com/random/200x200/?${subcategoryName}`,
              categoryId: categoryId,
            })
          );

          await db.insert(productSubcategories).values(subcategories);
        } else {
          console.warn(
            `⚠️ No subcategories found for category: ${category.slug}`
          );
        }
      }
    }

    console.log("🎉 Categories and subcategories seeding complete!");
  } catch (error) {
    console.error("❌ Error seeding categories and subcategories:", error);
  }
}

seedCategoriesAndSubcategories();
