import { sql } from "drizzle-orm";
import { pgView, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { ConnectedAccounts, Profiles } from "./account.sql";
import { connectedAccountProvider } from "./enums.sql";
import { Subscriptions } from "./subscriptions.sql";

export const AccountsDueForUpdate = pgView("accounts_due_for_update", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id").notNull(),
  provider: connectedAccountProvider("provider").notNull(),
  accountId: text("account_id").notNull(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
  updatedAt: timestamp("updated_at"),
})
  .with({ securityInvoker: true })
  .as(sql`
  SELECT 
    ${ConnectedAccounts.id},
    ${ConnectedAccounts.userId},
    ${ConnectedAccounts.provider},
    ${ConnectedAccounts.accountId},
    ${ConnectedAccounts.accessToken},
    ${ConnectedAccounts.refreshToken},
    ${ConnectedAccounts.expiresAt},
    ${ConnectedAccounts.updatedAt}
  FROM ${ConnectedAccounts}
  JOIN ${Profiles} ON ${ConnectedAccounts.userId} = ${Profiles.id}
  LEFT JOIN ${Subscriptions} ON ${Profiles.id} = ${Subscriptions.userId}
  WHERE 
    -- 1. Annual Pro: Update if older than 15 minutes
    (
      ${Profiles.tier} = 'pro' 
      AND ${Subscriptions.interval} = 'year'
      AND (
        ${ConnectedAccounts.updatedAt} < NOW() - INTERVAL '15 minutes' 
        OR ${ConnectedAccounts.updatedAt} IS NULL
      )
    )
    OR
    -- 2. Monthly Pro: Update if older than 1 hour
    (
      ${Profiles.tier} = 'pro' 
      AND (${Subscriptions.interval} = 'month' OR ${Subscriptions.interval} IS NULL)
      AND (
        ${ConnectedAccounts.updatedAt} < NOW() - INTERVAL '1 hour' 
        OR ${ConnectedAccounts.updatedAt} IS NULL
      )
    )
    OR
    -- 3. Free Users: Update if older than 24 hours
    (
      ${Profiles.tier} = 'free' 
      AND (
        ${ConnectedAccounts.updatedAt} < NOW() - INTERVAL '24 hours' 
        OR ${ConnectedAccounts.updatedAt} IS NULL
      )
    )
`);
