DROP VIEW "public"."accounts_due_for_update";--> statement-breakpoint
ALTER TABLE "connected_accounts" ALTER COLUMN "provider" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "analytics_snapshots" ALTER COLUMN "provider" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."connected_account_provider";--> statement-breakpoint
CREATE TYPE "public"."connected_account_provider" AS ENUM('youtube', 'instagram');--> statement-breakpoint
ALTER TABLE "connected_accounts" ALTER COLUMN "provider" SET DATA TYPE "public"."connected_account_provider" USING "provider"::"public"."connected_account_provider";--> statement-breakpoint
ALTER TABLE "analytics_snapshots" ALTER COLUMN "provider" SET DATA TYPE "public"."connected_account_provider" USING "provider"::"public"."connected_account_provider";--> statement-breakpoint
CREATE VIEW "public"."accounts_due_for_update" AS (
  SELECT 
    "connected_accounts"."id",
    "connected_accounts"."user_id",
    "connected_accounts"."provider",
    "connected_accounts"."account_id",
    "connected_accounts"."access_token",
    "connected_accounts"."refresh_token",
    "connected_accounts"."expires_at",
    "connected_accounts"."updated_at"
  FROM "connected_accounts"
  JOIN "profiles" ON "connected_accounts"."user_id" = "profiles"."id"
  WHERE 
    (
      "profiles"."tier" = 'pro' 
      AND (
        "connected_accounts"."updated_at" < NOW() - INTERVAL '1 hour' 
        OR "connected_accounts"."updated_at" IS NULL
      )
    )
    OR
    (
      "profiles"."tier" = 'free' 
      AND (
        "connected_accounts"."updated_at" < NOW() - INTERVAL '24 hours' 
        OR "connected_accounts"."updated_at" IS NULL
      )
    )
);