"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Bug, CheckCircle2, Circle, FileCode2, Rocket, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { usePortal, workflowSequence } from "@/components/PortalProvider";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockBugs } from "@/data/mockBugs";
import { mockDeployments } from "@/data/mockDeployments";
import { mockStories } from "@/data/mockStories";
import { portalBySlug } from "@/data/portalConfig";
import { cn } from "@/lib/utils";

const quickLinks = [
  { href: "/frd",         label: "Dev Assignment",      Icon: FileCode2, desc: "Assign internal or vendor team" },
  { href: "/user-stories",label: "Sprint Governance",   Icon: Users,     desc: "Review and approve backlogs"    },
  { href: "/deployments", label: "Deployment Tracking", Icon: Rocket,    desc: "Monitor rollout milestones"     },
  { href: "/bugs",        label: "Bug Escalations",     Icon: Bug,       desc: "Critical defect oversight"      },
];

export function ITPMDashboard() {
  const { setRole, workflowStatus, setWorkflowStatus } = usePortal();
  const portal = portalBySlug["it-pm"];
  const currentIndex = workflowSequence.indexOf(workflowStatus);

  useEffect(() => { setRole("IT Project Manager"); }, [setRole]);

  const deployChartData = mockDeployments.map((d) => ({
    name: d.environment,
    count: 1,
  }));
  const envCounts = mockDeployments.reduce<Record<string, number>>((acc, d) => {
    acc[d.environment] = (acc[d.environment] ?? 0) + 1;
    return acc;
  }, {});
  const barData = Object.entries(envCounts).map(([env, count]) => ({ env, count }));

  const openBugs = mockBugs.filter((b) => b.status !== "Resolved").length;
  const activeSprints = new Set(mockStories.map((s) => s.sprint)).size;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className={cn("rounded-2xl border p-6", portal.colors.bg, portal.colors.border)}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className={cn("text-xs font-bold uppercase tracking-[0.2em]", portal.colors.text)}>IT Project Manager Portal</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">Welcome, IT Project Manager</h2>
            <p className="mt-1 text-sm text-slate-600">Govern delivery, track sprints, and manage production rollouts.</p>
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
          { label: "Active Projects",    value: 3,                         color: "text-amber-700"   },
          { label: "Dev Teams Assigned", value: 2,                         color: "text-sky-600"     },
          { label: "Active Sprints",     value: activeSprints,             color: "text-violet-600"  },
          { label: "Deployments",        value: mockDeployments.length,    color: openBugs > 0 ? "text-rose-600" : "text-emerald-600" },
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
          <CardHeader><CardTitle>Deployments by Environment</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d9e2ec" />
                <XAxis dataKey="env" /><YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
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

      {/* Deployment tracker */}
      <Card>
        <CardHeader><CardTitle>Deployment Milestone Tracker</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {mockDeployments.map((d) => (
            <div key={d.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{d.id}: {d.milestone}</p>
                <p className="text-xs text-slate-500">{d.environment} — Release {d.releaseDate}</p>
              </div>
              <Badge variant={d.status === "Completed" ? "success" : d.status === "Validated" ? "info" : "warning"}>
                {d.status}
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
