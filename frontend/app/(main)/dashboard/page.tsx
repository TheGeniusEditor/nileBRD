"use client";

import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { DashboardCards } from "@/components/DashboardCards";
import { usePortal } from "@/components/PortalProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const weeklyFlow = [
  { stage: "Submitted", count: 14 },
  { stage: "BRD", count: 9 },
  { stage: "FRD", count: 6 },
  { stage: "SIT", count: 5 },
  { stage: "UAT", count: 4 },
  { stage: "Deploy", count: 3 },
];

const qualitySplit = [
  { name: "Pass", value: 78 },
  { name: "Fail", value: 22 },
];

export default function DashboardPage() {
  const { problems, bugs, deployments } = usePortal();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Portfolio Overview</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-900">Business Requirement Lifecycle Dashboard</h2>
      </div>

      <DashboardCards
        totalBusinessProblems={problems.length}
        brdsGenerated={8}
        activeProjects={5}
        sitStatus="4/5 Complete"
        uatStatus="3/5 Complete"
        openBugs={bugs.filter((bug) => bug.status !== "Resolved").length}
        deployments={deployments.length}
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Lifecycle Throughput</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyFlow}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d9e2ec" />
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0284c7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SIT Quality Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={qualitySplit} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} fill="#0369a1" />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Open Bugs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {bugs.filter((bug) => bug.status !== "Resolved").map((bug) => (
              <p key={bug.id} className="rounded-lg bg-rose-50 p-2 text-sm text-rose-700">
                {bug.id} - {bug.status} ({bug.severity})
              </p>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Deployments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {deployments.map((deployment) => (
              <p key={deployment.id} className="rounded-lg bg-slate-50 p-2 text-sm text-slate-700">
                {deployment.environment}: {deployment.milestone}
              </p>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-700">
            <p className="rounded-lg bg-amber-50 p-2">API retry queue crossed threshold in SIT environment.</p>
            <p className="rounded-lg bg-sky-50 p-2">BRD v3 approvals complete for 2 projects.</p>
            <p className="rounded-lg bg-emerald-50 p-2">Production release DEP-903 scheduled for Friday.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
