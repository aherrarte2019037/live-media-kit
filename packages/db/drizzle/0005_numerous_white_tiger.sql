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
    -- Pro Users: Update if older than 1 hour or never updated
    (
      "profiles"."tier" = 'pro' 
      AND (
        "connected_accounts"."updated_at" < NOW() - INTERVAL '1 hour' 
        OR "connected_accounts"."updated_at" IS NULL
      )
    )
    OR
    -- Free Users: Update if older than 24 hours or never updated
    (
      "profiles"."tier" = 'free' 
      AND (
        "connected_accounts"."updated_at" < NOW() - INTERVAL '24 hours' 
        OR "connected_accounts"."updated_at" IS NULL
      )
    )
);