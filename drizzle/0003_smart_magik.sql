CREATE TYPE "public"."payment_status" AS ENUM('pending', 'processing', 'succeeded');--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"order_id" uuid NOT NULL,
	"gateway_transaction_id" varchar,
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"amount" integer NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;