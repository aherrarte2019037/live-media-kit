import { pgEnum } from "drizzle-orm/pg-core";
import { ProviderList } from "./schema.constants";

export const onboardingSteps = pgEnum("onboarding_steps", ["username", "stats", "welcome"]);

export const subscriptionTier = pgEnum("subscription_tier", ["free", "pro"]);

export const connectedAccountProvider = pgEnum("connected_account_provider", ProviderList);
