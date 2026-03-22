import { DashboardCards } from "@/components/dashboard/DashboardCards";
import { TrendChart } from "@/components/dashboard/ChartWidgets";
import { Timeline } from "@/components/dashboard/Timeline";
import { itSummary, releaseTimeline, timelineActivity } from "@/lib/mockData";

export default function ITDashboardPage() {
  return (
    <div className="space-y-5">
      <DashboardCards items={itSummary} />
      <TrendChart title="Release Timeline" data={releaseTimeline} barKey="value" />
      <Timeline items={timelineActivity} />
    </div>
  );
}
