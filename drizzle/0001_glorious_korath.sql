ALTER TABLE "products" RENAME COLUMN "category" TO "categoryId";--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_category_productCategories_id_fk";
--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_productCategories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."productCategories"("id") ON DELETE no action ON UPDATE no action;