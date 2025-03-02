import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { productCategories, productSubcategories } from "../db/schema";

async function seedCategoriesAndSubcategories() {
  try {
    console.log("🌱 Seeding categories and subcategories...");

    const response = await fetch("https://dummyjson.com/products/categories");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const categories = await response.json(); // Changed to "categories"

    const subcategoryMap = {
      Beauty: [
        "Makeup",
        "Skincare",
        "Haircare",
        "Fragrances",
        "Tools & Accessories",
        "Bath & Body",
      ],
      Fragrances: [
        "Perfumes",
        "Colognes",
        "Body Sprays",
        "Home Fragrances",
        "Gift Sets",
        "Candles & Diffusers",
      ],
      Furniture: [
        "Sofas & Couches",
        "Beds",
        "Tables",
        "Chairs",
        "Storage",
        "Outdoor Furniture",
        "Office Furniture",
        "Kids Furniture",
      ],
      Groceries: [
        "Fruits & Vegetables",
        "Dairy & Eggs",
        "Meat & Seafood",
        "Bakery",
        "Pantry",
        "Beverages",
        "Frozen Foods",
        "Snacks",
      ],
      "Home Decoration": [
        "Wall Decor",
        "Lighting",
        "Textiles",
        "Decorative Accents",
        "Mirrors",
        "Rugs",
        "Vases",
      ],
      "Kitchen Accessories": [
        "Cookware",
        "Bakeware",
        "Utensils & Gadgets",
        "Tableware",
        "Storage",
        "Appliances",
        "Cleaning Supplies",
      ],
      Laptops: [
        "Gaming Laptops",
        "Ultrabooks",
        "Business Laptops",
        "Chromebooks",
        "2-in-1 Laptops",
        "Macbooks",
      ],
      "Mens Shirts": [
        "T-Shirts",
        "Dress Shirts",
        "Casual Shirts",
        "Polos",
        "Tank Tops",
        "Sweatshirts",
      ],
      "Mens Shoes": [
        "Sneakers",
        "Dress Shoes",
        "Boots",
        "Sandals",
        "Loafers",
        "Slippers",
      ],
      "Mens Watches": [
        "Luxury Watches",
        "Smartwatches",
        "Sports Watches",
        "Casual Watches",
        "Dress Watches",
        "Pocket Watches",
      ],
      "Mobile Accessories": [
        "Cases & Covers",
        "Chargers",
        "Screen Protectors",
        "Headphones",
        "Power Banks",
        "Memory Cards",
      ],
      Motorcycle: [
        "Motorcycles",
        "Helmets",
        "Gear & Accessories",
        "Parts",
        "Tires",
        "Maintenance",
      ],
      "Skin Care": [
        "Cleansers",
        "Moisturizers",
        "Serums",
        "Masks",
        "Toners",
        "Exfoliators",
        "Sunscreen",
      ],
      Smartphones: [
        "Android Phones",
        "iPhones",
        "Budget Phones",
        "Flagship Phones",
        "Foldable Phones",
        "Refurbished Phones",
      ],
      "Sports Accessories": [
        "Yoga & Fitness",
        "Team Sports",
        "Outdoor Recreation",
        "Water Sports",
        "Winter Sports",
        "Racket Sports",
      ],
      Sunglasses: [
        "Aviator",
        "Wayfarer",
        "Cat Eye",
        "Sports Sunglasses",
        "Polarized",
        "Designer",
      ],
      Tablets: [
        "Android Tablets",
        "iPads",
        "Windows Tablets",
        "Drawing Tablets",
        "Kids Tablets",
      ],
      Tops: [
        "T-shirts",
        "Blouses",
        "Tank Tops",
        "Sweaters",
        "Hoodies",
        "Jackets",
      ],
      Vehicle: ["Cars", "Trucks", "SUVs", "Motorcycles", "Vans", "Boats"],
      "Womens Bags": [
        "Handbags",
        "Totes",
        "Shoulder Bags",
        "Clutches",
        "Backpacks",
        "Wallets",
      ],
      "Womens Dresses": [
        "Casual Dresses",
        "Formal Dresses",
        "Party Dresses",
        "Maxi Dresses",
        "Cocktail Dresses",
        "Summer Dresses",
      ],
      "Womens Jewellery": [
        "Necklaces",
        "Earrings",
        "Bracelets",
        "Rings",
        "Anklets",
        "Body Jewellery",
      ],
      "Womens Shoes": [
        "Heels",
        "Flats",
        "Sandals",
        "Sneakers",
        "Boots",
        "Loafers",
      ],
      "Womens Watches": [
        "Luxury Watches",
        "Fashion Watches",
        "Smartwatches",
        "Casual Watches",
        "Dress Watches",
        "Bracelet Watches",
      ],
    };

    for (const category of categories) {
      // Changed to "category"
      const categoryName = category.name as keyof typeof subcategoryMap; // Get name from the object
      const existingCategory = await db
        .select()
        .from(productCategories)
        .where(eq(productCategories.name, categoryName));

      if (existingCategory.length === 0) {
        // Fetch the first product in the category to get its thumbnail
        const categoryUrl = `https://dummyjson.com/products/category/${category.slug}`; // Use the slug
        const categoryResponse = await fetch(categoryUrl);
        if (!categoryResponse.ok) {
          throw new Error(`HTTP error! status: ${categoryResponse.status}`);
        }
        const categoryData = await categoryResponse.json();
        const firstProductThumbnail = categoryData.products[0]?.thumbnail; // Get the thumbnail

        const insertedCategory = await db
          .insert(productCategories)
          .values({
            name: categoryName,
            slug: category.slug, // Use the slug
            imageUrl: firstProductThumbnail, // Use the fetched thumbnail
          })
          .returning();

        const categoryId = insertedCategory[0].id;

        const subcategoriesForCategory = subcategoryMap[categoryName];

        const subcategories = subcategoriesForCategory.map(
          (subcategoryName) => ({
            name: subcategoryName,
            slug: subcategoryName.toLowerCase().replace(/ /g, "-"),
            imageUrl: `https://source.unsplash.com/random/200x200/?${subcategoryName}`,
            categoryId: categoryId,
          })
        );

        await db.insert(productSubcategories).values(subcategories);
      }
    }

    console.log("🎉 Categories and subcategories seeding complete!");
  } catch (error) {
    console.error("❌ Error seeding categories and subcategories:", error);
  }
}

seedCategoriesAndSubcategories();
