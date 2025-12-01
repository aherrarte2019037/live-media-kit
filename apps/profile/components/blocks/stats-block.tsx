import type { StatsBlockData } from "@repo/db";
import type { AnalyticsProviders } from "@repo/db/src/schema.helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { shortNumber } from "@repo/utils";
import { Case, Switch, When } from "react-if";

interface Props {
  data: StatsBlockData;
  analyticsProviders: AnalyticsProviders;
}

export function StatsBlock({ data, analyticsProviders }: Props) {
  const providerStats = analyticsProviders[data.provider]?.stats;
  if (!providerStats) return null;

  const showAll = data.metric === "all";

  return (
    <div className="grid gap-4">
      <Switch>
        <Case condition={data.provider === "youtube"}>
          <When condition={showAll || data.metric === "subscribers"}>
            <Card className="rounded-(--radius) shadow-sm border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Subscribers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {shortNumber(providerStats.subscriberCount)}
                </div>
              </CardContent>
            </Card>
          </When>

          <When condition={showAll || data.metric === "views"}>
            <div className="grid grid-cols-2 gap-4">
              <Card className="rounded-(--radius) shadow-sm border-slate-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{shortNumber(providerStats.viewCount)}</div>
                </CardContent>
              </Card>

              <Card className="rounded-(--radius) shadow-sm border-slate-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Videos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{shortNumber(providerStats.videoCount)}</div>
                </CardContent>
              </Card>
            </div>
          </When>
        </Case>
      </Switch>
    </div>
  );
}
