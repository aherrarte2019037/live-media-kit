import { timestamp } from "drizzle-orm/pg-core";
import type { AnalyticsStats, MediaKitTheme } from "./schema";

export const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
};

export const DefaultKitTheme: MediaKitTheme = {
  primary: "#171717",
  radius: 0.5,
};

export const DefaultAnalyticsStats: AnalyticsStats = {
  subscriberCount: 0,
  videoCount: 0,
  viewCount: 0,
};
