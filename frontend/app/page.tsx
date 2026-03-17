"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Briefcase,
  Code2,
  Gauge,
  LayoutDashboard,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";

import { usePortal, workflowSequence } from "@/components/PortalProvider";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { portalConfigs, workflowPipeline, roleColorMap } from "@/data/portalConfig";
import { cn } from "@/lib/utils";

const portalIcons = {
  stakeholder: Users,
  ba:          Briefcase,
  it:          Code2,
  "it-pm":     LayoutDashboard,
  vendor:      Truck,
  admin:       ShieldCheck,
};

export default function LandingPage() {
  const { workflowStatus } = usePortal();
  const currentIndex = workflowSequence.indexOf(workflowStatus);
  const currentStep = currentIndex + 1;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Enterprise Portal Home
              </p>
              <h1 className="mt-2 text-2xl font-bold text-slate-900">
                AI Business Requirement Management Portal
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Standardized entry point for all teams. Pick your role portal to continue your
                workflow, or use the central dashboard for full lifecycle visibility.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/dashboard" className={buttonVariants({ size: "sm" })}>
                <LayoutDashboard className="h-4 w-4" />
                Open Dashboard
              </Link>
              <Link href="/ai-assistant" className={buttonVariants({ variant: "outline", size: "sm" })}>
                <Bot className="h-4 w-4" />
                AI Assistant
              </Link>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-xs text-slate-500">Current Stage</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{workflowStatus}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-xs text-slate-500">Current Step</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{currentStep} / 13</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-xs text-slate-500">Active Portals</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{portalConfigs.length}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-xs text-slate-500">Pipeline Health</p>
              <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">
                <Gauge className="h-4 w-4" />
                Stable
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <section>
        <h2 className="mb-1 text-lg font-semibold text-slate-900">Role Portals</h2>
        <p className="mb-4 text-sm text-slate-500">
          Simple role-based access to modules and dashboards.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {portalConfigs.map((portal) => {
            const Icon = portalIcons[portal.slug as keyof typeof portalIcons];
            const ownedSteps = portal.steps.length;
            const completed = portal.steps.filter(
              (s) => workflowSequence.indexOf(s.triggerStatus) <= currentIndex,
            ).length;
            const pct = Math.round((completed / ownedSteps) * 100);

            return (
              <Card key={portal.slug} className={cn("border", portal.colors.border)}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-lg",
                          portal.colors.badgeBg,
                        )}
                      >
                        <Icon className={cn("h-4 w-4", portal.colors.text)} />
                      </div>
                      <CardTitle className="text-base">{portal.shortTitle}</CardTitle>
                    </div>
                    <span className="text-xs font-medium text-slate-500">{completed}/{ownedSteps}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="line-clamp-2 text-sm text-slate-600">{portal.description}</p>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={cn("h-full rounded-full", portal.colors.badgeBg)}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <Link
                    href={`/portal/${portal.slug}`}
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full")}
                  >
                    Enter Portal
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-1 text-lg font-semibold text-slate-900">Workflow Stages</h2>
        <p className="mb-4 text-sm text-slate-500">
          Click any stage to open the responsible role portal.
        </p>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {workflowPipeline.map((node) => {
                const colors = roleColorMap[node.ownerSlug];
                const isDone = workflowSequence.indexOf(node.status) < currentIndex;
                const isCurrent = workflowSequence.indexOf(node.status) === currentIndex;

                return (
                  <Link
                    key={node.status}
                    href={`/portal/${node.ownerSlug}`}
                    className={cn(
                      "grid grid-cols-[56px_1fr_auto] items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-slate-50",
                      isCurrent && "bg-sky-50",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex h-7 w-10 items-center justify-center rounded-md text-xs font-semibold",
                        isDone ? "bg-emerald-100 text-emerald-700" : cn(colors.badgeBg, colors.badgeText),
                      )}
                    >
                      {node.step}
                    </span>
                    <div>
                      <p className={cn("font-medium", isCurrent ? "text-sky-800" : "text-slate-900")}>{node.name}</p>
                      <p className="text-xs text-slate-500">{node.status}</p>
                    </div>
                    <div className="text-right text-xs">
                      <p className={cn("font-medium", colors.text)}>{node.ownerLabel}</p>
                      <p className={cn(isDone ? "text-emerald-600" : isCurrent ? "text-sky-600" : "text-slate-400")}>
                        {isDone ? "Completed" : isCurrent ? "Current" : "Pending"}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
