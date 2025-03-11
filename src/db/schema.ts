/* eslint-disable @typescript-eslint/no-explicit-any */
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
  primaryKey,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  oldPrice: numeric("oldPrice", { precision: 10, scale: 2 }),
  imageUrls: jsonb("imageUrls").$type<string[]>(),
  categoryId: uuid("categoryId").references(() => productCategories.id),
  subcategories: jsonb("subcategories").$type<string[]>(),
  brand: varchar("brand", { length: 255 }),
  stock: integer("stock").notNull().default(0),
  rating: numeric("rating", { precision: 3, scale: 2 }),
  isActive: boolean("isActive").notNull().default(true),
  attributes: jsonb("attributes")
    .$type<{
      attributeCombinations: { [key: string]: any }[];
      availableAttributes: { [key: string]: any[] };
    }>()
    .default({
      attributeCombinations: [],
      availableAttributes: {},
    })
    .notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const productCategories = pgTable("productCategories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  imageUrl: varchar("imageUrl", { length: 255 }),
  description: text("description"),
});

export const productSubcategories = pgTable("productSubcategories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  imageUrl: varchar("imageUrl", { length: 255 }),
  description: text("description"),
  categoryId: uuid("categoryId").references(() => productCategories.id),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: varchar("firstName", { length: 256 }),
  lastName: varchar("lastName", { length: 256 }),
  email: varchar("email", { length: 256 }),
  clerkId: varchar("clerkId", { length: 255 }).notNull(),
  role: varchar({ length: 255 }).notNull().default("user"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp(),
});

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  productId: uuid("productId")
    .references(() => products.id, {
      onDelete: "cascade",
    })
    .notNull(),
  totalPrice: numeric("totalPrice", { precision: 10, scale: 2 }).notNull(),
  status: varchar({ length: 255 }).notNull().default("pending"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp(),
});

export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("productId")
    .notNull()
    .references(() => products.id),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  reviewerName: varchar("reviewerName", { length: 255 }).notNull(),
  reviewerEmail: varchar("reviewerEmail", { length: 255 }).notNull(),
  date: timestamp("date").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const wishList = pgTable("wishList", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("productId")
    .references(() => products.id, {
      onDelete: "cascade",
    })
    .notNull(),
  userId: uuid("userId")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
});

export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  address: text("address").notNull(),
  city: varchar({ length: 255 }).notNull(),
  state: varchar({ length: 255 }).notNull(),
  country: varchar({ length: 255 }).notNull(),
  postalCode: varchar({ length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp(),
});

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  orderId: uuid("orderId")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  paymentMethod: varchar({ length: 255 }).notNull(),
  paymentResult: jsonb("paymentResult").default({}),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp(),
});

export const cart = pgTable(
  "cart",
  {
    userId: uuid("userId")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
    productId: uuid("productId")
      .references(() => products.id, {
        onDelete: "cascade",
      })
      .notNull(),
    quantity: integer("quantity").notNull(),

    attributes: jsonb("attributes").notNull(),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp(),
  },
  (table) => {
    return {
      userProductAttributesKey: primaryKey({
        columns: [table.userId, table.productId, table.attributes],
      }),
    };
  }
);

export const coupons = pgTable("coupons", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar({ length: 255 }).notNull(),
  discount: numeric("discount", { precision: 3, scale: 1 }).notNull(),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp(),
});
