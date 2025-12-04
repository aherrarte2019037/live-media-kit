CREATE TYPE "public"."subscription_interval" AS ENUM('month', 'year');--> statement-breakpoint
DROP VIEW "public"."accounts_due_for_update";--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "interval" "subscription_interval";--> statement-breakpoint
CREATE VIEW "public"."accounts_due_for_update" WITH (security_invoker = true) AS (
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
  LEFT JOIN "subscriptions" ON "profiles"."id" = "subscriptions"."user_id"
  WHERE 
    -- 1. Annual Pro: Update if older than 15 minutes
    (
      "profiles"."tier" = 'pro' 
      AND "subscriptions"."interval" = 'year'
      AND (
        "connected_accounts"."updated_at" < NOW() - INTERVAL '15 minutes' 
        OR "connected_accounts"."updated_at" IS NULL
      )
    )
    OR
    -- 2. Monthly Pro: Update if older than 1 hour
    (
      "profiles"."tier" = 'pro' 
      AND ("subscriptions"."interval" = 'month' OR "subscriptions"."interval" IS NULL)
      AND (
        "connected_accounts"."updated_at" < NOW() - INTERVAL '1 hour' 
        OR "connected_accounts"."updated_at" IS NULL
      )
    )
    OR
    -- 3. Free Users: Update if older than 24 hours
    (
      "profiles"."tier" = 'free' 
      AND (
        "connected_accounts"."updated_at" < NOW() - INTERVAL '24 hours' 
        OR "connected_accounts"."updated_at" IS NULL
      )
    )
);