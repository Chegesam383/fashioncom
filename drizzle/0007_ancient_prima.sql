ALTER TABLE "reviews" DROP CONSTRAINT "reviews_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_productId_products_id_fk";
--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "rating" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "comment" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "comment" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "reviewerName" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "reviewerEmail" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "date" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" DROP COLUMN "userId";--> statement-breakpoint
ALTER TABLE "reviews" DROP COLUMN "updatedAt";