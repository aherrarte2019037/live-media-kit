import { sql } from "drizzle-orm";
import { pgPolicy, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { Profiles } from "./account.sql";
import { subscriptionInterval } from "./enums.sql";
import { timestamps } from "./schema.helpers";

export const Subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => Profiles.id, { onDelete: "cascade" })
      .unique(),
    provider: text("provider").notNull(),
    customerId: text("customer_id").unique(),
    subscriptionId: text("subscription_id").unique(),
    priceId: text("price_id"),
    interval: subscriptionInterval("interval"),
    currentPeriodEnd: timestamp("current_period_end"),
    ...timestamps,
  },
  (table) => [
    pgPolicy("Users can view own subscription", {
      for: "select",
      using: sql`auth.uid() = ${table.userId}`,
    }),
  ]
);
