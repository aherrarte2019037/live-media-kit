import { createHmac, timingSafeEqual } from "node:crypto";
import { db, Profiles } from "@repo/db";
import { Subscriptions } from "@repo/db/schema/subscriptions.sql";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });

  const headersList = await headers();
  const signatureHeader = headersList.get("x-signature") || "";

  // 1. Verify Signature (Security)
  const text = await request.text();
  const hmac = createHmac("sha256", secret);
  const digest = Buffer.from(hmac.update(text).digest("hex"), "utf8");
  const signature = Buffer.from(signatureHeader, "utf8");

  if (digest.length !== signature.length || !timingSafeEqual(digest, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(text);
  const { meta, data } = payload;
  const eventName = meta.event_name;
  const customData = meta.custom_data; // We will pass user_id here during checkout

  // 2. Handle Events
  try {
    switch (eventName) {
      case "subscription_created":
      case "subscription_updated":
      case "subscription_resumed":
        await handleSubscriptionChange(data, customData);
        break;

      case "subscription_cancelled":
      case "subscription_expired":
        await handleSubscriptionEnd(data);
        break;
    }
  } catch (error) {
    console.error("Webhook processing failed:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleSubscriptionChange(data: any, customData: any) {
  const userId = customData.user_id;
  if (!userId) {
    console.error("No user_id found in custom_data");
    return;
  }

  const attributes = data.attributes;
  const variantId = String(attributes.variant_id);

  // Determine interval based on your specific variant IDs
  // You can also inspect `attributes.interval` if provided by the API directly
  // For now, we assume you map this logic or check the payload structure
  const isAnnual = attributes.variant_name?.toLowerCase().includes("year");

  // 1. Update Subscription Table
  await db
    .insert(Subscriptions)
    .values({
      userId: userId,
      provider: "lemon-squeezy",
      customerId: String(attributes.customer_id),
      subscriptionId: String(data.id),
      priceId: variantId,
      interval: isAnnual ? "year" : "month",
      currentPeriodEnd: new Date(attributes.renews_at),
    })
    .onConflictDoUpdate({
      target: Subscriptions.userId,
      set: {
        subscriptionId: String(data.id),
        priceId: variantId,
        interval: isAnnual ? "year" : "month",
        currentPeriodEnd: new Date(attributes.renews_at),
        updatedAt: new Date(),
      },
    });

  // 2. Upgrade Profile to Pro
  await db.update(Profiles).set({ tier: "pro" }).where(eq(Profiles.id, userId));
}

async function handleSubscriptionEnd(data: any) {
  const _attributes = data.attributes;
  const subscriptionId = String(data.id);

  // We don't delete the row, we just mark the profile as free
  // ONLY if the period has actually ended (optional logic)

  // Find who owns this subscription
  const sub = await db.query.Subscriptions.findFirst({
    where: eq(Subscriptions.subscriptionId, subscriptionId),
  });

  if (!sub) return;

  // Downgrade user to free
  await db.update(Profiles).set({ tier: "free" }).where(eq(Profiles.id, sub.userId));

  // Optionally remove the subscription row or mark status as 'cancelled'
  // For simplicity in your schema, we might just leave it or clear specific fields
  // If you want to be strict:
  // await db.delete(Subscriptions).where(eq(Subscriptions.id, sub.id));
}
