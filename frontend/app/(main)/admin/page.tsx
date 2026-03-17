import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-900">Step 16: Post Production Monitoring</h2>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Open Bugs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-700">
            <p className="rounded-lg bg-rose-50 p-3">BUG-701 - Open - Workflow Squad</p>
            <p className="rounded-lg bg-amber-50 p-3">BUG-702 - In Progress - API Squad</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Deployments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-700">
            <p className="rounded-lg bg-slate-50 p-3">DEP-901 - Development - Completed</p>
            <p className="rounded-lg bg-slate-50 p-3">DEP-902 - Testing - Validated</p>
            <p className="rounded-lg bg-slate-50 p-3">DEP-903 - Production - Planned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-700">
            <p className="rounded-lg bg-amber-50 p-3">Two API timeout spikes detected in UAT execution window.</p>
            <p className="rounded-lg bg-sky-50 p-3">Vendor FRD upload pending for external stream.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-700">
            <p className="rounded-lg bg-emerald-50 p-3">Cycle time improved by 36% across active projects.</p>
            <p className="rounded-lg bg-emerald-50 p-3">BRD to FRD lead time reduced to 4.2 days average.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
