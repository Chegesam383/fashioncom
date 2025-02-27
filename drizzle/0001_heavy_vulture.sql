CREATE TABLE "addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"address" text NOT NULL,
	"city" varchar(255) NOT NULL,
	"state" varchar(255) NOT NULL,
	"country" varchar(255) NOT NULL,
	"postalCode" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "cart" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "category_mapping" (
	"product_id" uuid NOT NULL,
	"category_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"total_price" numeric(10, 2) NOT NULL,
	"status" varchar(255) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"order_id" uuid NOT NULL,
	"paymentMethod" varchar(255) NOT NULL,
	"payment_result" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "product_categories" (
	"name" varchar(255) NOT NULL,
	"description" text DEFAULT 'No description available',
	"category_id" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_subcategories" (
	"sub_category_id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text DEFAULT 'No description available',
	"category_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"rating" numeric(3, 1) NOT NULL,
	"comment" text DEFAULT 'No comment',
	"created_at" timestamp DEFAULT now(),
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerkId" varchar(255) NOT NULL,
	"role" varchar(255) DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "wishlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
DROP TABLE "categories" CASCADE;--> statement-breakpoint
DROP TABLE "subcategories" CASCADE;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "imageUrls" varchar(255)[];--> statement-breakpoint
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_mapping" ADD CONSTRAINT "category_mapping_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_mapping" ADD CONSTRAINT "category_mapping_category_id_product_categories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("category_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_subcategories" ADD CONSTRAINT "product_subcategories_category_id_product_categories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("category_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;