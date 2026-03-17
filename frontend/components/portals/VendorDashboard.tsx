"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Bug, CheckCircle2, Circle, FileCode2, Rocket } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { usePortal, workflowSequence } from "@/components/PortalProvider";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockBugs } from "@/data/mockBugs";
import { mockDeployments } from "@/data/mockDeployments";
import { portalBySlug } from "@/data/portalConfig";
import { cn } from "@/lib/utils";

const quickLinks = [
  { href: "/frd",         label: "FRD Upload",          Icon: FileCode2, desc: "Submit your FRD package"         },
  { href: "/bugs",        label: "Bug Coordination",    Icon: Bug,       desc: "Triage and resolve defects"      },
  { href: "/deployments", label: "Release Readiness",   Icon: Rocket,    desc: "Confirm delivery milestones"     },
];

export function VendorDashboard() {
  const { setRole, workflowStatus, setWorkflowStatus } = usePortal();
  const portal = portalBySlug.vendor;
  const currentIndex = workflowSequence.indexOf(workflowStatus);

  useEffect(() => { setRole("Vendor"); }, [setRole]);

  const open = mockBugs.filter((b) => b.status === "Open").length;
  const inProg = mockBugs.filter((b) => b.status === "In Progress").length;
  const resolved = mockBugs.filter((b) => b.status === "Resolved").length;

  const pieData = [
    { name: "Open",        value: open },
    { name: "In Progress", value: inProg },
    { name: "Resolved",    value: resolved },
  ];
  const COLORS = ["#f43f5e", "#f59e0b", "#10b981"];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className={cn("rounded-2xl border p-6", portal.colors.bg, portal.colors.border)}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className={cn("text-xs font-bold uppercase tracking-[0.2em]", portal.colors.text)}>Vendor Portal</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">Welcome, Vendor Partner</h2>
            <p className="mt-1 text-sm text-slate-600">Upload FRDs, coordinate bug fixes, and confirm release milestones.</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="info">Stage {currentIndex + 1} / 13</Badge>
            <span className={cn("text-xs font-semibold", portal.colors.text)}>{workflowStatus}</span>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Active Assignments",  value: 1,                       color: "text-rose-700"    },
          { label: "FRDs Uploaded",       value: 1,                       color: "text-sky-600"     },
          { label: "Bugs in Scope",       value: mockBugs.length,         color: "text-amber-600"   },
          { label: "Release Milestones",  value: mockDeployments.length,  color: "text-emerald-600" },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader className="pb-1"><CardTitle className="text-xs text-slate-500">{kpi.label}</CardTitle></CardHeader>
            <CardContent><p className={cn("text-3xl font-bold", kpi.color)}>{kpi.value}</p></CardContent>
          </Card>
        ))}
      </div>

      {/* Chart + Quick Links */}
      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <Card>
          <CardHeader><CardTitle>Bug Status Distribution</CardTitle></CardHeader>
          <CardContent className="flex h-64 items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={4}>
                  {pieData.map((entry, i) => <Cell key={entry.name} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Quick Access</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {quickLinks.map(({ href, label, Icon, desc }) => (
              <Link key={href} href={href} className="flex items-center gap-3 rounded-lg border border-slate-100 p-3 text-sm transition-colors hover:bg-slate-50">
                <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", portal.colors.badgeBg)}>
                  <Icon className={cn("h-4 w-4", portal.colors.text)} />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{label}</p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bugs assigned */}
      <Card>
        <CardHeader><CardTitle>Bugs Assigned to Vendor</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {mockBugs.map((b) => (
            <div key={b.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{b.id}</p>
                <p className="text-xs text-slate-500">{b.assignedTeam} — {b.createdDate}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant={b.severity === "High" || b.severity === "Critical" ? "danger" : b.severity === "Medium" ? "warning" : "default"}>{b.severity}</Badge>
                <Badge variant={b.status === "Resolved" ? "success" : b.status === "In Progress" ? "warning" : "danger"}>{b.status}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Workflow steps */}
      <Card>
        <CardHeader><CardTitle>Your Workflow Responsibilities</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {portal.steps.map((step) => {
            const idx = workflowSequence.indexOf(step.triggerStatus);
            const done = idx < currentIndex;
            const active = idx === currentIndex;
            return (
              <div key={step.id} className={cn("flex items-center justify-between rounded-lg border p-3", done ? "border-emerald-200 bg-emerald-50" : active ? "border-sky-200 bg-sky-50" : "border-slate-200 bg-slate-50")}>
                <div className="flex items-center gap-3">
                  {done ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" /> : <Circle className="h-4 w-4 shrink-0 text-slate-300" />}
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Step {step.id}: {step.label}</p>
                    <p className="text-xs text-slate-500">{step.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {active && <button onClick={() => setWorkflowStatus(step.triggerStatus)} className={cn(buttonVariants({ size: "sm" }))}>Advance</button>}
                  <Link href={step.route} className={cn(buttonVariants({ size: "sm", variant: "outline" }))}>Open</Link>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
