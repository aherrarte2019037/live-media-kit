import {
  boolean,
  jsonb,
  pgEnum,
  pgSchema,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const onboardingSteps = pgEnum("onboarding_steps", ["username", "stats"]);
export const subscriptionTier = pgEnum("subscription_tier", ["free", "pro"]);

const authSchema = pgSchema("auth");
const authUsers = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

export const profiles = pgTable("profiles", {
  id: uuid("id")
    .primaryKey()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  username: text("username").unique(),
  tier: subscriptionTier("tier").default("free").notNull(),
  onboardingSteps: onboardingSteps("onboarding_steps").array().default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" })
    .unique(),
  provider: text("provider").notNull(),
  customerId: text("customer_id").unique(),
  subscriptionId: text("subscription_id").unique(),
  priceId: text("price_id"),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const mediaKits = pgTable("media_kits", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  slug: text("slug").notNull().unique(),
  published: boolean("published").default(false).notNull(),
  theme: jsonb("theme").$type<{
    primary?: string;
    radius?: number;
  }>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
