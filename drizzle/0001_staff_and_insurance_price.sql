ALTER TABLE "doctors" ADD COLUMN "license" text;--> statement-breakpoint
ALTER TABLE "doctors" ADD COLUMN "is_doctor" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "price_items" ADD COLUMN "insurance_price" text;