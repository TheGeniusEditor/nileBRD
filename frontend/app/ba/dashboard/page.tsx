import { DashboardCards } from "@/components/dashboard/DashboardCards";
import { TrendChart } from "@/components/dashboard/ChartWidgets";
import { Timeline } from "@/components/dashboard/Timeline";
import { baSummary, timelineActivity, velocityData } from "@/lib/mockData";

export default function BADashboardPage() {
  return (
    <div className="space-y-5">
      <DashboardCards items={baSummary} />
      <TrendChart title="BRD Progress Trend" data={velocityData} lineKey="planned" />
      <Timeline items={timelineActivity} />
    </div>
  );
}
