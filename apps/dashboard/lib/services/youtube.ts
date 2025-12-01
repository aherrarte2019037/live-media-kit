import { AnalyticsSnapshots, type AnalyticsStats, ConnectedAccounts, db } from "@repo/db";
import { addSeconds, format, subDays } from "date-fns";
import { and, eq } from "drizzle-orm";
import { google } from "googleapis";
import { z } from "zod";

const oauth2Client = new google.auth.OAuth2(
  process.env.SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID,
  process.env.SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET
);

const AnalyticsResponseSchema = z.object({
  columnHeaders: z
    .array(
      z.object({
        name: z.string(),
        columnType: z.string().optional(),
        dataType: z.string().optional(),
      })
    )
    .optional()
    .default([]),
  rows: z
    .array(z.array(z.union([z.string(), z.number()])))
    .optional()
    .default([]),
});
const ChannelStatisticsSchema = z.object({
  subscriberCount: z.coerce.number().optional().default(0),
  videoCount: z.coerce.number().optional().default(0),
  viewCount: z.coerce.number().optional().default(0),
});

export async function fetchAndSaveYouTubeStats(
  userId: string,
  accessToken: string,
  refreshToken?: string
) {
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  const youtube = google.youtube({ version: "v3", auth: oauth2Client });
  const analytics = google.youtubeAnalytics({ version: "v2", auth: oauth2Client });

  const channelResponse = await youtube.channels.list({
    part: ["snippet", "statistics"],
    mine: true,
  });

  const channel = channelResponse.data.items?.[0];
  if (!channel) throw new Error("No YouTube channel found.");

  const channelId = channel.id || "";
  const today = new Date();
  const thirtyDaysAgo = subDays(today, 30);
  const apiDateFormat = "yyyy-MM-dd";

  const analyticsResponse = await analytics.reports.query({
    ids: "channel==MINE",
    startDate: format(thirtyDaysAgo, apiDateFormat),
    endDate: format(today, apiDateFormat),
    metrics: "views,estimatedMinutesWatched",
    dimensions: "day",
    sort: "day",
  });

  const existingAccount = await db.query.ConnectedAccounts.findFirst({
    where: and(eq(ConnectedAccounts.userId, userId), eq(ConnectedAccounts.provider, "youtube")),
  });

  const accountData = {
    accessToken,
    ...(refreshToken && { refreshToken }),
    expiresAt: addSeconds(new Date(), 3500),
    updatedAt: new Date(),
  };

  if (existingAccount) {
    await db
      .update(ConnectedAccounts)
      .set(accountData)
      .where(eq(ConnectedAccounts.id, existingAccount.id));
  } else {
    await db.insert(ConnectedAccounts).values({
      userId,
      provider: "youtube",
      accountId: channelId,
      scope: "read_only",
      ...accountData,
    });
  }

  const data = AnalyticsResponseSchema.parse(analyticsResponse.data);
  const headers = data.columnHeaders;
  const dateIdx = headers.findIndex((h) => h.name === "day");
  const viewsIdx = headers.findIndex((h) => h.name === "views");
  const watchTimeIdx = headers.findIndex((h) => h.name === "estimatedMinutesWatched");

  const history = data.rows.map((row) => ({
    date: String(row[dateIdx]),
    views: Number(row[viewsIdx]),
    watchTimeMinutes: Number(row[watchTimeIdx]),
  }));

  const parsedChannelStatistics = ChannelStatisticsSchema.parse(channel.statistics);
  const stats: AnalyticsStats = {
    subscriberCount: parsedChannelStatistics.subscriberCount,
    videoCount: parsedChannelStatistics.videoCount,
    viewCount: parsedChannelStatistics.viewCount,
    followerCount: 0,
    mediaCount: 0,
  };

  await db.insert(AnalyticsSnapshots).values({
    userId,
    platformId: channelId,
    provider: "youtube",
    stats,
    history,
  });

  return true;
}
