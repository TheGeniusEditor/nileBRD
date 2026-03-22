import { Card } from "@/components/ui/Card";
import { kanbanColumns } from "@/lib/mockData";

export default function DevelopmentTrackingPage() {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <Card>
        <h3 className="mb-3 text-base font-semibold text-slate-800">Backlog</h3>
        <div className="space-y-2">
          {kanbanColumns.backlog.map((item) => (
            <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h3 className="mb-3 text-base font-semibold text-slate-800">In Progress</h3>
        <div className="space-y-2">
          {kanbanColumns.inProgress.map((item) => (
            <div key={item} className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h3 className="mb-3 text-base font-semibold text-slate-800">Done</h3>
        <div className="space-y-2">
          {kanbanColumns.done.map((item) => (
            <div key={item} className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
