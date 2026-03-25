import { DashboardCards } from "@/components/dashboard/DashboardCards";
import { TrendChart } from "@/components/dashboard/ChartWidgets";
import { Timeline } from "@/components/dashboard/Timeline";
import { itSummary, releaseTimeline, timelineActivity } from "@/lib/mockData";

export default function ITDashboardPage() {
  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <section className="animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
        <DashboardCards items={itSummary} />
      </section>

      {/* Release Timeline Chart */}
      <section className="animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Release Progress</h2>
        <TrendChart title="Release Timeline" data={releaseTimeline} barKey="value" />
      </section>

      {/* Activity Timeline */}
      <section className="animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Activity</h2>
        <Timeline items={timelineActivity} />
      </section>
    </div>
  );
}
