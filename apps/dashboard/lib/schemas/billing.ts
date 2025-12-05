import { SubscriptionIntervalList, SubscriptionTierList } from "@repo/db";
import z from "zod";

export const BillingWebhookPayloadSchema = z.object({
  meta: z.object({
    event_name: z.enum([
      "subscription_created",
      "subscription_updated",
      "subscription_cancelled",
      "subscription_resumed",
      "subscription_expired",
      "subscription_payment_failed",
      "subscription_payment_success",
    ]),
    custom_data: z.object({
      user_id: z.string().min(1),
      interval: z.enum(SubscriptionIntervalList),
      tier: z.enum(SubscriptionTierList),
    }),
  }),
  data: z.object({
    id: z.coerce.number(),
    attributes: z.object({
      customer_id: z.number(),
      variant_id: z.number(),
      renews_at: z.string(),
    }),
  }),
});

export type BillingWebhookPayload = z.infer<typeof BillingWebhookPayloadSchema>;
