ALTER TABLE "cart" ADD CONSTRAINT "cart_id_productId_attributes_pk" PRIMARY KEY("id","productId","attributes");--> statement-breakpoint
ALTER TABLE "cart" ADD COLUMN "attributes" jsonb NOT NULL;