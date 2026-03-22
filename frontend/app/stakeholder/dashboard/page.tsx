import { DashboardCards } from "@/components/dashboard/DashboardCards";
import { DistributionChart, TrendChart } from "@/components/dashboard/ChartWidgets";
import { Timeline } from "@/components/dashboard/Timeline";
import { stakeholderSummary, timelineActivity, velocityData, workflowDistribution } from "@/lib/mockData";

export default function StakeholderDashboardPage() {
  return (
    <div className="space-y-5">
      <DashboardCards items={stakeholderSummary} />
      <div className="grid gap-5 xl:grid-cols-2">
        <TrendChart title="Request Throughput" data={velocityData} lineKey="delivered" />
        <DistributionChart title="Workflow Distribution" data={workflowDistribution} />
      </div>
      <Timeline items={timelineActivity} />
    </div>
  );
}
