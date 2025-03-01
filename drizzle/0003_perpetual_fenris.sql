ALTER TABLE "cart" DROP CONSTRAINT "cart_id_productId_attributes_pk";--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_userId_productId_attributes_pk" PRIMARY KEY("userId","productId","attributes");--> statement-breakpoint
ALTER TABLE "cart" DROP COLUMN "id";