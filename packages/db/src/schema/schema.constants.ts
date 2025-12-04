export const ProviderList = ["youtube", "instagram"] as const;

export const YouTubeStatMetrics = ["subscribers", "views", "videos", "all"] as const;

export const YouTubeChartMetrics = [
  "views",
  "watchTimeMinutes",
  "subscribersGained",
  "likes",
] as const;

export const InstagramStatMetrics = ["followers", "likes", "all"] as const;

export const InstagramChartMetrics = ["followers", "likes"] as const;
