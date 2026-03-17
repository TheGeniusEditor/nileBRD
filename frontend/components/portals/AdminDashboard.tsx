"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Bug, CheckCircle2, Circle, ClipboardList, FileText, LayoutDashboard, Rocket, ShieldCheck } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { usePortal, workflowSequence } from "@/components/PortalProvider";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockBugs } from "@/data/mockBugs";
import { mockDeployments } from "@/data/mockDeployments";
import { mockProblems } from "@/data/mockProblems";
import { portalBySlug } from "@/data/portalConfig";
import { cn } from "@/lib/utils";

const quickLinks = [
  { href: "/business-problems", label: "BA Assignment",    Icon: ClipboardList,   desc: "Assign BAs to problems"          },
  { href: "/brd",               label: "BRD Oversight",   Icon: FileText,        desc: "Review all BRD approvals"        },
  { href: "/bugs",              label: "Bug Governance",  Icon: Bug,             desc: "Monitor defect SLAs"             },
  { href: "/deployments",       label: "Deployments",     Icon: Rocket,          desc: "Production release management"   },
  { href: "/dashboard",         label: "Full Analytics",  Icon: LayoutDashboard, desc: "End-to-end lifecycle metrics"    },
  { href: "/admin",             label: "System Monitor",  Icon: ShieldCheck,     desc: "Alerts and post-prod health"     },
];

const lifecycleChart = [
  { stage: "Problems",  count: 3 },
  { stage: "BRDs",      count: 2 },
  { stage: "FRDs",      count: 1 },
  { stage: "SIT",       count: 3 },
  { stage: "UAT",       count: 2 },
  { stage: "Deploy",    count: 3 },
];

export function AdminDashboard() {
  const { setRole, workflowStatus, setWorkflowStatus } = usePortal();
  const portal = portalBySlug.admin;
  const currentIndex = workflowSequence.indexOf(workflowStatus);

  useEffect(() => { setRole("Admin"); }, [setRole]);

  const openBugs = mockBugs.filter((b) => b.status !== "Resolved").length;
  const unassigned = mockProblems.filter((p) => p.assignedBA === "Unassigned").length;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className={cn("rounded-2xl border p-6", portal.colors.bg, portal.colors.border)}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className={cn("text-xs font-bold uppercase tracking-[0.2em]", portal.colors.text)}>Admin Portal</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">Welcome, Administrator</h2>
            <p className="mt-1 text-sm text-slate-600">Full visibility and governance across all roles, projects, and systems.</p>
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
          { label: "Total Business Problems", value: mockProblems.length,    color: "text-slate-800"   },
          { label: "Unassigned to BA",        value: unassigned,             color: unassigned > 0 ? "text-rose-600" : "text-emerald-600" },
          { label: "Open Bugs",               value: openBugs,               color: openBugs > 0 ? "text-rose-600" : "text-emerald-600" },
          { label: "Deployments",             value: mockDeployments.length, color: "text-sky-600"     },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader className="pb-1"><CardTitle className="text-xs text-slate-500">{kpi.label}</CardTitle></CardHeader>
            <CardContent><p className={cn("text-3xl font-bold", kpi.color)}>{kpi.value}</p></CardContent>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card>
        <CardHeader><CardTitle>End-to-End Lifecycle Throughput</CardTitle></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={lifecycleChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d9e2ec" />
              <XAxis dataKey="stage" /><YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#475569" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quick module access */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Module Quick Access</h3>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {quickLinks.map(({ href, label, Icon, desc }) => (
            <Link key={href} href={href} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-sm transition-shadow hover:shadow-md">
              <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", portal.colors.badgeBg)}>
                <Icon className={cn("h-5 w-5", portal.colors.text)} />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{label}</p>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Cross-cutting recent view */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Problems Awaiting BA Assignment</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {mockProblems.filter((p) => p.assignedBA === "Unassigned").length === 0 ? (
              <p className="text-sm text-emerald-600">All problems have been assigned. ✓</p>
            ) : (
              mockProblems.filter((p) => p.assignedBA === "Unassigned").map((p) => (
                <div key={p.id} className="flex justify-between rounded-lg border border-slate-100 p-3">
                  <p className="text-sm font-semibold text-slate-900">{p.id}: {p.title}</p>
                  <Badge variant="warning">Unassigned</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Open Defects Requiring Governance</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {mockBugs.filter((b) => b.status !== "Resolved").map((b) => (
              <div key={b.id} className="flex justify-between rounded-lg border border-slate-100 p-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{b.id}</p>
                  <p className="text-xs text-slate-500">{b.assignedTeam}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant={b.severity === "High" ? "danger" : "warning"}>{b.severity}</Badge>
                  <Badge variant="warning">{b.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

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
