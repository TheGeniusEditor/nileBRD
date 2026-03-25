import { DashboardCards } from "@/components/dashboard/DashboardCards";
import { DistributionChart, TrendChart } from "@/components/dashboard/ChartWidgets";
import { Timeline } from "@/components/dashboard/Timeline";
import { stakeholderSummary, timelineActivity, velocityData, workflowDistribution } from "@/lib/mockData";

export default function StakeholderDashboardPage() {
  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <section className="animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
        <DashboardCards items={stakeholderSummary} />
      </section>

      {/* Charts Section */}
      <section className="animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Analytics</h2>
        <div className="grid gap-8 xl:grid-cols-2">
          <TrendChart title="Request Throughput" data={velocityData} lineKey="delivered" />
          <DistributionChart title="Workflow Distribution" data={workflowDistribution} />
        </div>
      </section>

      {/* Activity Timeline */}
      <section className="animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Activity</h2>
        <Timeline items={timelineActivity} />
      </section>
    </div>
  );
}
