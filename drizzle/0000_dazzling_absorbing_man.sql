CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text DEFAULT 'No description available',
	"created_at" timestamp DEFAULT now(),
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text DEFAULT 'Unnamed Product' NOT NULL,
	"description" text DEFAULT 'No description available',
	"price" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"brand" varchar(255),
	"stock" integer DEFAULT 10 NOT NULL,
	"rating" numeric(3, 1) DEFAULT '0',
	"is_active" boolean DEFAULT true,
	"attributes" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "subcategories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text DEFAULT 'No description available',
	"parentId" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updatedAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "subcategories" ADD CONSTRAINT "subcategories_parentId_categories_id_fk" FOREIGN KEY ("parentId") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;