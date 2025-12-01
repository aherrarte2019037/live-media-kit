import { AnalyticsSnapshots, db, MediaKits } from "@repo/db";
import type { AnalyticsProviders } from "@repo/db/src/schema.helpers";
import { and, desc, eq } from "drizzle-orm";

export async function getPublishedMediaKit(slug: string) {
  const kitData = await db.query.MediaKits.findFirst({
    where: and(eq(MediaKits.slug, slug), eq(MediaKits.published, true)),
    with: {
      profile: true,
    },
  });

  if (!kitData) return null;

  const latestSnapshots = await db
    .selectDistinctOn([AnalyticsSnapshots.provider])
    .from(AnalyticsSnapshots)
    .where(eq(AnalyticsSnapshots.userId, kitData.profile.id))
    .orderBy(AnalyticsSnapshots.provider, desc(AnalyticsSnapshots.createdAt));

  const analyticsProviders: AnalyticsProviders = {};

  for (const snap of latestSnapshots) {
    analyticsProviders[snap.provider] = {
      stats: snap.stats,
      history: snap.history,
    };
  }

  const { profile, ...kit } = kitData;

  return {
    kit,
    profile,
    analyticsProviders,
  };
}
