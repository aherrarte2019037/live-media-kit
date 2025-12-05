import { sql } from "drizzle-orm";
import { integer, pgPolicy, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { Profiles } from "./account.sql";
import { subscriptionInterval, subscriptionProvider } from "./enums.sql";
import type {
  SubscriptionIntervalList,
  SubscriptionProviderList,
  SubscriptionTierList,
} from "./schema.constants";
import { timestamps } from "./schema.helpers";

export const Subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => Profiles.id, { onDelete: "cascade" })
      .unique(),
    provider: subscriptionProvider("provider").notNull(),
    customerId: integer("customer_id").unique().notNull(),
    subscriptionId: integer("subscription_id").unique().notNull(),
    priceId: integer("price_id").notNull(),
    interval: subscriptionInterval("interval").notNull(),
    currentPeriodEnd: timestamp("current_period_end").notNull(),
    ...timestamps,
  },
  (table) => [
    pgPolicy("Users can view own subscription", {
      for: "select",
      using: sql`auth.uid() = ${table.userId}`,
    }),
  ]
);

export type SubscriptionProvider = (typeof SubscriptionProviderList)[number];
export type SubscriptionTier = (typeof SubscriptionTierList)[number];
export type SubscriptionInterval = (typeof SubscriptionIntervalList)[number];
