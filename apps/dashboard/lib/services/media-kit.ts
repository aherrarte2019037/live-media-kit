import { db, GetDefaultKitBlocks, MediaKits, Profiles } from "@repo/db";
import { and, count, eq } from "drizzle-orm";

export async function createDefaultKit(userId: string) {
  const existingDefaultKit = await db.query.MediaKits.findFirst({
    where: and(eq(MediaKits.userId, userId), eq(MediaKits.default, true)),
  });

  if (existingDefaultKit) return existingDefaultKit;

  const profile = await db.query.Profiles.findFirst({
    where: eq(Profiles.id, userId),
    columns: { username: true },
  });

  if (!profile) throw new Error("User has no profile");
  if (!profile.username) throw new Error("User has no username");

  const [newKit] = await db
    .insert(MediaKits)
    .values({
      userId,
      slug: profile.username,
      published: true,
      default: true,
      blocks: GetDefaultKitBlocks(profile.username),
    })
    .returning();

  return newKit;
}

export async function createNewKit(userId: string, slug: string) {
  const [profile] = await db.select().from(Profiles).where(eq(Profiles.id, userId));
  const [kitCount] = await db
    .select({ count: count() })
    .from(MediaKits)
    .where(eq(MediaKits.userId, userId));

  if (!profile) throw new Error("User not found");

  const isPro = profile.tier === "pro";
  const currentKits = kitCount.count;

  if (!isPro && currentKits >= 1) {
    throw new Error("Free plan is limited to 1 Media Kit. Please upgrade to Pro.");
  }

  const [newKit] = await db
    .insert(MediaKits)
    .values({
      userId,
      slug: slug.toLowerCase(),
      published: true,
      default: false,
      blocks: GetDefaultKitBlocks(profile.username),
    })
    .returning();

  return newKit;
}
