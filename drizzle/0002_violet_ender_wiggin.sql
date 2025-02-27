CREATE TABLE "coupons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(255) NOT NULL,
	"discount" numeric(3, 1) NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "subcategory_hierarchy" (
	"parent_subcategory_id" uuid NOT NULL,
	"child_subcategory_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "category_mapping" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "category_mapping" CASCADE;--> statement-breakpoint
ALTER TABLE "product_subcategories" DROP CONSTRAINT "product_subcategories_category_id_product_categories_category_id_fk";
--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "product_categories" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "product_categories" ADD COLUMN "image_url" varchar(255);--> statement-breakpoint
ALTER TABLE "product_subcategories" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "image_urls" varchar(255)[];--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "category_id" uuid;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "subcategory_id" uuid;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "clerk_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "subcategory_hierarchy" ADD CONSTRAINT "subcategory_hierarchy_parent_subcategory_id_product_subcategories_id_fk" FOREIGN KEY ("parent_subcategory_id") REFERENCES "public"."product_subcategories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subcategory_hierarchy" ADD CONSTRAINT "subcategory_hierarchy_child_subcategory_id_product_subcategories_id_fk" FOREIGN KEY ("child_subcategory_id") REFERENCES "public"."product_subcategories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_subcategories" ADD CONSTRAINT "product_subcategories_category_id_product_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_product_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_subcategory_id_product_subcategories_id_fk" FOREIGN KEY ("subcategory_id") REFERENCES "public"."product_subcategories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_categories" DROP COLUMN "category_id";--> statement-breakpoint
ALTER TABLE "product_subcategories" DROP COLUMN "sub_category_id";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "imageUrls";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "clerkId";