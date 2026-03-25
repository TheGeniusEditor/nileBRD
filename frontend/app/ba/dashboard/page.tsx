import { DashboardCards } from "@/components/dashboard/DashboardCards";
import { TrendChart } from "@/components/dashboard/ChartWidgets";
import { Timeline } from "@/components/dashboard/Timeline";
import { baSummary, timelineActivity, velocityData } from "@/lib/mockData";

export default function BADashboardPage() {
  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <section className="animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
        <DashboardCards items={baSummary} />
      </section>

      {/* BRD Progress Chart */}
      <section className="animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Performance</h2>
        <TrendChart title="BRD Progress Trend" data={velocityData} lineKey="planned" />
      </section>

      {/* Activity Timeline */}
      <section className="animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Activity</h2>
        <Timeline items={timelineActivity} />
      </section>
    </div>
  );
}
