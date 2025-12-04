import type { AnalyticsProvider, StatsBlockData, YouTubeStatMetric, YouTubeStats } from "@repo/db";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { shortNumber } from "@repo/utils";
import { Case, Switch, When } from "react-if";

interface Props {
  data: StatsBlockData;
  analyticsProvider: AnalyticsProvider;
}

export function StatsBlock({ data, analyticsProvider }: Props) {
  const snapshot = analyticsProvider[data.provider];
  if (!snapshot) return null;

  const stats = snapshot.stats;
  const showAll = data.metric === "all";

  return (
    <div className="grid gap-4">
      <Switch>
        <Case condition={data.provider === "youtube"}>
          {() => {
            const youtubeStats = stats as YouTubeStats;
            const youtubeMetrics = data.metric as YouTubeStatMetric;

            return (
              <>
                <When condition={showAll || youtubeMetrics === "subscribers"}>
                  <Card className="rounded-(--radius) shadow-sm border-slate-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Subscribers
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {shortNumber(youtubeStats.subscribers)}
                      </div>
                    </CardContent>
                  </Card>
                </When>

                <When condition={showAll || youtubeMetrics === "videos"}>
                  <Card className="rounded-(--radius) shadow-sm border-slate-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Videos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{shortNumber(youtubeStats.videos)}</div>
                    </CardContent>
                  </Card>
                </When>

                <When condition={showAll || youtubeMetrics === "views"}>
                  <Card className="rounded-(--radius) shadow-sm border-slate-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Views
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{shortNumber(youtubeStats.views)}</div>
                    </CardContent>
                  </Card>
                </When>
              </>
            );
          }}
        </Case>
      </Switch>
    </div>
  );
}
