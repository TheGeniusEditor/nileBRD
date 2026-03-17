"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Bug, CheckCircle2, Circle, FileCode2, FlaskConical, TestTube2 } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { usePortal, workflowSequence } from "@/components/PortalProvider";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockBugs } from "@/data/mockBugs";
import { mockTestCases } from "@/data/mockTestCases";
import { portalBySlug } from "@/data/portalConfig";
import { cn } from "@/lib/utils";

const quickLinks = [
  { href: "/frd",         label: "FRD & Feasibility",   Icon: FileCode2,   desc: "Review BRDs, create FRDs"   },
  { href: "/test-cases",  label: "Test Case Generation", Icon: TestTube2,  desc: "AI-generated test cases"    },
  { href: "/sit-testing", label: "SIT Execution",        Icon: FlaskConical,desc: "Run integration tests"     },
  { href: "/bugs",        label: "Bug Tracking",         Icon: Bug,         desc: "Log and manage defects"    },
];

export function ITDashboard() {
  const { setRole, workflowStatus, setWorkflowStatus } = usePortal();
  const portal = portalBySlug.it;
  const currentIndex = workflowSequence.indexOf(workflowStatus);

  useEffect(() => { setRole("IT"); }, [setRole]);

  const passCount = mockTestCases.filter((t) => t.status === "Pass").length;
  const failCount = mockTestCases.filter((t) => t.status === "Fail").length;
  const notStarted = mockTestCases.filter((t) => t.status === "Not Started").length;
  const openBugs = mockBugs.filter((b) => b.status !== "Resolved").length;
  const passRate = Math.round((passCount / mockTestCases.length) * 100);

  const pieData = [
    { name: "Pass",        value: passCount  },
    { name: "Fail",        value: failCount  },
    { name: "Not Started", value: notStarted },
  ];
  const COLORS = ["#10b981", "#f43f5e", "#94a3b8"];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className={cn("rounded-2xl border p-6", portal.colors.bg, portal.colors.border)}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className={cn("text-xs font-bold uppercase tracking-[0.2em]", portal.colors.text)}>IT Team Portal</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">Welcome, IT Team</h2>
            <p className="mt-1 text-sm text-slate-600">Feasibility, FRD creation, test execution, and SIT governance.</p>
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
          { label: "FRDs Created",       value: 2,           color: "text-emerald-700"  },
          { label: "Test Cases",         value: mockTestCases.length, color: "text-sky-600" },
          { label: "SIT Pass Rate",      value: `${passRate}%`, color: passRate >= 70 ? "text-emerald-600" : "text-rose-600" },
          { label: "Open Bugs",          value: openBugs,    color: "text-rose-600"     },
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
          <CardHeader><CardTitle>Test Case Execution Status</CardTitle></CardHeader>
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

      {/* SIT results */}
      <Card>
        <CardHeader><CardTitle>SIT Test Execution Results</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {mockTestCases.map((tc) => (
            <div key={tc.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{tc.id}: {tc.steps.slice(0, 60)}…</p>
                <p className="text-xs text-slate-500">Executed by {tc.executedBy} — {tc.date}</p>
              </div>
              <Badge variant={tc.status === "Pass" ? "success" : tc.status === "Fail" ? "danger" : "warning"}>{tc.status}</Badge>
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
