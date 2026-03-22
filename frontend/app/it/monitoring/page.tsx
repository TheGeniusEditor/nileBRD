import { TrendChart } from "@/components/dashboard/ChartWidgets";
import { DataTable } from "@/components/tables/DataTable";
import { issueLogs, velocityData } from "@/lib/mockData";

export default function MonitoringPage() {
  return (
    <div className="space-y-5">
      <TrendChart title="Post-Production Metrics" data={velocityData} lineKey="delivered" />
      <DataTable title="Issue Logs" rows={issueLogs} />
    </div>
  );
}
