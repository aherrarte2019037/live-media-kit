ALTER TABLE "media_kits" ALTER COLUMN "theme" SET DEFAULT '{"primary":"#171717","radius":0.5}'::jsonb;--> statement-breakpoint
ALTER TABLE "media_kits" ALTER COLUMN "theme" SET NOT NULL;