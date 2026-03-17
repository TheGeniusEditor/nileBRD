"use client";

import Link from "next/link";
import { useEffect } from "react";
import { CheckCircle2, Circle, ClipboardList, FileText, MessageSquare, ShieldCheck } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { usePortal, workflowSequence } from "@/components/PortalProvider";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockBRDVersions } from "@/data/mockBRDs";
import { mockProblems } from "@/data/mockProblems";
import { portalBySlug } from "@/data/portalConfig";
import { cn } from "@/lib/utils";

const priorityChart = [
  { name: "Critical", count: 1 },
  { name: "High",     count: 1 },
  { name: "Medium",   count: 1 },
];

const quickLinks = [
  { href: "/business-problems", label: "Submit Problem",    Icon: ClipboardList, desc: "Create a new business problem" },
  { href: "/discussions",       label: "Discussions",       Icon: MessageSquare, desc: "Join requirement sessions"     },
  { href: "/brd",               label: "BRD Review",        Icon: FileText,      desc: "Approve or request changes"   },
  { href: "/uat-testing",       label: "UAT Sign-Off",      Icon: ShieldCheck,   desc: "Execute acceptance test runs" },
];

export function StakeholderDashboard() {
  const { setRole, workflowStatus, setWorkflowStatus } = usePortal();
  const portal = portalBySlug.stakeholder;
  const currentIndex = workflowSequence.indexOf(workflowStatus);

  useEffect(() => { setRole("Stakeholder"); }, [setRole]);

  const pendingApprovals = mockBRDVersions.filter((v) => v.status === "Under Review").length;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className={cn("rounded-2xl border p-6", portal.colors.bg, portal.colors.border)}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className={cn("text-xs font-bold uppercase tracking-[0.2em]", portal.colors.text)}>Stakeholder Portal</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">Welcome, Stakeholder</h2>
            <p className="mt-1 text-sm text-slate-600">Track your problems, approvals, and UAT responsibilities.</p>
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
          { label: "My Submitted Problems", value: mockProblems.length, color: "text-violet-700" },
          { label: "Pending BRD Approvals", value: pendingApprovals,    color: "text-amber-600"  },
          { label: "UAT Scenarios",          value: 3,                   color: "text-sky-600"    },
          { label: "Resolved Problems",      value: 1,                   color: "text-emerald-600"},
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
          <CardHeader><CardTitle>My Problems by Priority</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d9e2ec" />
                <XAxis dataKey="name" /><YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#7c3aed" radius={[6, 6, 0, 0]} />
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

      {/* Recent problems */}
      <Card>
        <CardHeader><CardTitle>My Recent Business Problems</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {mockProblems.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{p.id}: {p.title}</p>
                <p className="text-xs text-slate-500">{p.department} — {p.createdDate}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant={p.priority === "Critical" ? "danger" : p.priority === "High" ? "warning" : "default"}>{p.priority}</Badge>
                <Badge variant="info">{p.status}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Workflow progress */}
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
                <div className="flex items-center gap-2">
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
