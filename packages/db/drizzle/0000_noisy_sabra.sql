CREATE TYPE "public"."onboarding_steps" AS ENUM('username', 'stats');--> statement-breakpoint
CREATE TYPE "public"."subscription_tier" AS ENUM('free', 'pro');--> statement-breakpoint
CREATE TABLE "media_kits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"theme" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "media_kits_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "media_kits" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"username" text,
	"tier" "subscription_tier" DEFAULT 'free' NOT NULL,
	"onboarding_steps" "onboarding_steps"[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"provider" text NOT NULL,
	"customer_id" text,
	"subscription_id" text,
	"price_id" text,
	"current_period_end" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "subscriptions_customer_id_unique" UNIQUE("customer_id"),
	CONSTRAINT "subscriptions_subscription_id_unique" UNIQUE("subscription_id")
);
--> statement-breakpoint
ALTER TABLE "subscriptions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "media_kits" ADD CONSTRAINT "media_kits_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "Public can view published kits" ON "media_kits" AS PERMISSIVE FOR SELECT TO public USING ("media_kits"."published" = true);--> statement-breakpoint
CREATE POLICY "Users can view own kits" ON "media_kits" AS PERMISSIVE FOR SELECT TO public USING (auth.uid() = "media_kits"."user_id");--> statement-breakpoint
CREATE POLICY "Users can create own kits" ON "media_kits" AS PERMISSIVE FOR INSERT TO public WITH CHECK (auth.uid() = "media_kits"."user_id");--> statement-breakpoint
CREATE POLICY "Users can update own kits" ON "media_kits" AS PERMISSIVE FOR UPDATE TO public USING (auth.uid() = "media_kits"."user_id");--> statement-breakpoint
CREATE POLICY "Users can delete own kits" ON "media_kits" AS PERMISSIVE FOR DELETE TO public USING (auth.uid() = "media_kits"."user_id");--> statement-breakpoint
CREATE POLICY "Users can view own profile" ON "profiles" AS PERMISSIVE FOR SELECT TO public USING (auth.uid() = "profiles"."id");--> statement-breakpoint
CREATE POLICY "Users can update own profile" ON "profiles" AS PERMISSIVE FOR UPDATE TO public USING (auth.uid() = "profiles"."id");--> statement-breakpoint
CREATE POLICY "Users can insert own profile" ON "profiles" AS PERMISSIVE FOR INSERT TO public WITH CHECK (auth.uid() = "profiles"."id");--> statement-breakpoint
CREATE POLICY "Users can view own subscription" ON "subscriptions" AS PERMISSIVE FOR SELECT TO public USING (auth.uid() = "subscriptions"."user_id");