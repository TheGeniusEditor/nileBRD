"use client";

import Link from "next/link";
import { useEffect } from "react";
import { CheckCircle2, Circle, ClipboardList, FileCode2, FileText, MessageSquare } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { usePortal, workflowSequence } from "@/components/PortalProvider";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockBRDVersions } from "@/data/mockBRDs";
import { mockProblems } from "@/data/mockProblems";
import { portalBySlug } from "@/data/portalConfig";
import { cn } from "@/lib/utils";

const brdStatusColors: Record<string, string> = {
  Draft: "#94a3b8",
  "Under Review": "#f59e0b",
  Approved: "#10b981",
};

const quickLinks = [
  { href: "/business-problems", label: "Problem Queue",      Icon: ClipboardList, desc: "Problems assigned to you"     },
  { href: "/discussions",       label: "Req. Gathering",     Icon: MessageSquare, desc: "Facilitate sessions"           },
  { href: "/brd",               label: "BRD Management",     Icon: FileText,      desc: "Create, edit, version BRDs"   },
  { href: "/frd",               label: "FRD Coordination",   Icon: FileCode2,     desc: "Handoff to IT for FRD"        },
];

export function BADashboard() {
  const { setRole, workflowStatus, setWorkflowStatus } = usePortal();
  const portal = portalBySlug.ba;
  const currentIndex = workflowSequence.indexOf(workflowStatus);

  useEffect(() => { setRole("BA"); }, [setRole]);

  const assigned = mockProblems.filter((p) => p.assignedBA !== "Unassigned").length;
  const drafts = mockBRDVersions.filter((v) => v.status === "Draft").length;
  const underReview = mockBRDVersions.filter((v) => v.status === "Under Review").length;
  const approved = mockBRDVersions.filter((v) => v.status === "Approved").length;

  const pieData = [
    { name: "Draft",        value: drafts },
    { name: "Under Review", value: underReview },
    { name: "Approved",     value: approved },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className={cn("rounded-2xl border p-6", portal.colors.bg, portal.colors.border)}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className={cn("text-xs font-bold uppercase tracking-[0.2em]", portal.colors.text)}>Business Analyst Portal</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">Welcome, Business Analyst</h2>
            <p className="mt-1 text-sm text-slate-600">Manage requirements, generate BRDs, and coordinate FRD handoffs.</p>
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
          { label: "Problems Assigned",   value: assigned,    color: "text-sky-700"     },
          { label: "BRDs In Draft",        value: drafts,      color: "text-slate-600"   },
          { label: "Under Review",         value: underReview, color: "text-amber-600"   },
          { label: "BRDs Approved",        value: approved,    color: "text-emerald-600" },
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
          <CardHeader><CardTitle>BRD Version Status Distribution</CardTitle></CardHeader>
          <CardContent className="flex h-64 items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={4}>
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={brdStatusColors[entry.name] ?? "#94a3b8"} />
                  ))}
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

      {/* BRD versions */}
      <Card>
        <CardHeader><CardTitle>BRD Version History</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {mockBRDVersions.map((v) => (
            <div key={v.version} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{v.label}</p>
                <p className="text-xs text-slate-500">Updated by {v.updatedBy} — {v.updatedAt}</p>
              </div>
              <Badge variant={v.status === "Approved" ? "success" : v.status === "Under Review" ? "warning" : "default"}>
                {v.status}
              </Badge>
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
