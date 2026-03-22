import { DataTable } from "@/components/tables/DataTable";
import { WorkflowStepper } from "@/components/dashboard/WorkflowStepper";
import { Card } from "@/components/ui/Card";
import { requests } from "@/lib/mockData";

const workflow = ["Submitted", "BA Assigned", "BRD", "FRD", "Dev", "UAT"];

export default function MyRequestsPage() {
  return (
    <div className="space-y-5">
      <DataTable title="Submitted Requests" rows={requests} />
      <Card>
        <h3 className="mb-3 text-base font-semibold text-slate-800">Status Tracker: {requests[0].id}</h3>
        <WorkflowStepper steps={workflow} current={requests[0].stage} />
      </Card>
    </div>
  );
}
