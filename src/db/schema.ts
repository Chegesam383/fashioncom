import {
  pgTable,
  uuid,
  varchar,
  text,
  numeric,
  boolean,
  timestamp,
  jsonb,
  integer,
} from "drizzle-orm/pg-core";

// Product Categories Table
export const productCategories = pgTable("product_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  imageUrl: varchar("image_url", { length: 255 }),
  description: text("description").default("No description available"),
});

// Product Subcategories Table (Junction Table for Parent-Child Relationship)
export const productSubcategories = pgTable("product_subcategories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").default("No description available"),
  categoryId: uuid("category_id")
    .references(() => productCategories.id, { onDelete: "cascade" })
    .notNull(),
});

//  Subcategory Hierarchy Table (Junction Table for Parent-Child Relationship)
export const subcategoryHierarchy = pgTable("subcategory_hierarchy", {
  parentSubcategoryId: uuid("parent_subcategory_id")
    .references(() => productSubcategories.id, { onDelete: "cascade" })
    .notNull(),
  childSubcategoryId: uuid("child_subcategory_id")
    .references(() => productSubcategories.id, { onDelete: "cascade" })
    .notNull(),
});

// Products Table
export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().default("Unnamed Product"),
  description: text("description").default("No description available"),
  price: numeric("price", { precision: 10, scale: 2 })
    .notNull()
    .default("0.00"),
  imageUrls: varchar("image_urls", { length: 255 }).array(),
  category: uuid("category_id").references(() => productCategories.id, {
    onDelete: "cascade",
  }),
  subcategory: uuid("subcategory_id").references(
    () => productSubcategories.id,
    {
      onDelete: "cascade",
    }
  ),
  brand: varchar({ length: 255 }),
  stock: integer("stock").notNull().default(10),
  rating: numeric("rating", { precision: 3, scale: 1 }).default("0"),
  isActive: boolean("is_active").default(true),
  attributes: jsonb("attributes").default({}),
  created_at: timestamp().defaultNow(),
  updatedAt: timestamp(),
});

// Users Table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: varchar("clerk_id", { length: 255 }).notNull(),
  role: varchar({ length: 255 }).notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp(),
});

/** ✅ Orders Table */
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  productId: uuid("product_id")
    .references(() => products.id, {
      onDelete: "cascade",
    })
    .notNull(),
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
  status: varchar({ length: 255 }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp(),
});

// Reviews Table
export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  productId: uuid("product_id")
    .references(() => products.id, {
      onDelete: "cascade",
    })
    .notNull(),
  rating: numeric("rating", { precision: 3, scale: 1 }).notNull(),
  comment: text("comment").default("No comment"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp(),
});

// Wishlist Table
export const wishList = pgTable("wishlist", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .references(() => products.id, {
      onDelete: "cascade",
    })
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
});

//  Addresses Table
export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  address: text("address").notNull(),
  city: varchar({ length: 255 }).notNull(),
  state: varchar({ length: 255 }).notNull(),
  country: varchar({ length: 255 }).notNull(),
  postalCode: varchar({ length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp(),
});

// Payments Table
export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  orderId: uuid("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  paymentMethod: varchar({ length: 255 }).notNull(),
  paymentResult: jsonb("payment_result").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp(),
});

// Cart Table
export const cart = pgTable("cart", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  productId: uuid("product_id")
    .references(() => products.id, {
      onDelete: "cascade",
    })
    .notNull(),
  quantity: integer("quantity").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp(),
});

// Coupons Table
export const coupons = pgTable("coupons", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar({ length: 255 }).notNull(),
  discount: numeric("discount", { precision: 3, scale: 1 }).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp(),
});
