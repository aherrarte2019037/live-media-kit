CREATE TYPE "public"."subscription_provider" AS ENUM('lemon-squeezy');--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "provider" SET DATA TYPE "public"."subscription_provider" USING "provider"::"public"."subscription_provider";--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "customer_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "customer_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "subscription_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "subscription_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "price_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "price_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "interval" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "current_period_end" SET NOT NULL;