import { pgEnum } from "drizzle-orm/pg-core";
import {
  OnboardingStepList,
  ProviderList,
  SubscriptionIntervalList,
  SubscriptionProviderList,
  SubscriptionTierList,
} from "./schema.constants";

export const onboardingSteps = pgEnum("onboarding_steps", OnboardingStepList);

export const subscriptionProvider = pgEnum("subscription_provider", SubscriptionProviderList);
export const subscriptionTier = pgEnum("subscription_tier", SubscriptionTierList);
export const subscriptionInterval = pgEnum("subscription_interval", SubscriptionIntervalList);

export const connectedAccountProvider = pgEnum("connected_account_provider", ProviderList);
