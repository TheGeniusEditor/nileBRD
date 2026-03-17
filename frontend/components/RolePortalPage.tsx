"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight, CheckCircle2, Circle, Clock } from "lucide-react";

import { usePortal, workflowSequence } from "@/components/PortalProvider";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type PortalConfig, workflowPipeline } from "@/data/portalConfig";
import { cn } from "@/lib/utils";

interface Props {
  portal: PortalConfig;
}

export function RolePortalPage({ portal }: Props) {
  const { setRole, workflowStatus, setWorkflowStatus } = usePortal();

  useEffect(() => {
    setRole(portal.role);
  }, [portal.role, setRole]);

  const currentIndex = workflowSequence.indexOf(workflowStatus);

  const ownedStepCount = portal.steps.length;
  const completedStepCount = portal.steps.filter(
    (s) => workflowSequence.indexOf(s.triggerStatus) <= currentIndex,
  ).length;

  return (
    <div className="space-y-8">
      {/* ── Hero banner ─────────────────────────────────────────────────────── */}
      <div className={cn("rounded-2xl border p-6", portal.colors.bg, portal.colors.border)}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className={cn("text-xs font-semibold uppercase tracking-[0.2em]", portal.colors.text)}>
              Role Workspace
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">{portal.title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">{portal.description}</p>

            <div className="mt-4 flex flex-wrap gap-3">
              <div className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium", portal.colors.badgeBg, portal.colors.badgeText, portal.colors.border)}>
                <CheckCircle2 className="h-3.5 w-3.5" />
                {completedStepCount}/{ownedStepCount} Steps Complete
              </div>
              <div className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium", portal.colors.badgeBg, portal.colors.badgeText, portal.colors.border)}>
                <Clock className="h-3.5 w-3.5" />
                Active Stage: {workflowStatus}
              </div>
            </div>
          </div>

          <Link href={portal.primaryRoute} className={buttonVariants({ size: "lg" })}>
            Open Primary Module
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* ── Owned workflow steps ─────────────────────────────────────────────── */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-500">
          Your Workflow Responsibilities
        </h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {portal.steps.map((step) => {
            const stepIndex = workflowSequence.indexOf(step.triggerStatus);
            const isCompleted = stepIndex < currentIndex;
            const isActive = stepIndex === currentIndex;

            return (
              <Card
                key={`${portal.slug}-step-${step.id}`}
                className={cn(isActive && "shadow-md ring-2 ring-sky-400 ring-offset-2")}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : isActive ? (
                        <Clock className="h-4 w-4 text-sky-500" />
                      ) : (
                        <Circle className="h-4 w-4 text-slate-300" />
                      )}
                      <span className="text-xs font-semibold text-slate-400">STEP {step.id}</span>
                    </div>
                    <Badge
                      variant={isCompleted ? "success" : isActive ? "info" : "default"}
                    >
                      {isCompleted ? "Done" : isActive ? "Active" : "Pending"}
                    </Badge>
                  </div>
                  <CardTitle className="mt-1 text-base">{step.label}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Link href={step.route} className={buttonVariants({ variant: "outline", size: "sm" })}>Open Module</Link>
                  {!isCompleted && (
                    <Button
                      size="sm"
                      variant={isActive ? "default" : "secondary"}
                      onClick={() => setWorkflowStatus(step.triggerStatus)}
                    >
                      {isActive ? "Mark Complete" : "Set Stage"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ── Global pipeline position ─────────────────────────────────────────── */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-500">
          Position in Global Lifecycle
        </h3>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {workflowPipeline.map((node) => {
                const isOwned = node.ownerSlug === portal.slug;
                const isDone = workflowSequence.indexOf(node.status) < currentIndex;
                const isCurrent = workflowSequence.indexOf(node.status) === currentIndex;

                return (
                  <div
                    key={node.status}
                    className={cn(
                      "relative rounded-lg border px-3 py-2 text-xs transition-all",
                      isOwned
                        ? cn(portal.colors.bg, portal.colors.border, portal.colors.text, "font-semibold")
                        : isDone
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : isCurrent
                        ? "border-sky-300 bg-sky-50 text-sky-700 font-semibold"
                        : "border-slate-200 bg-white text-slate-400",
                    )}
                  >
                    <span className="block font-bold">{node.step}</span>
                    <span className="block">{node.name}</span>
                    {isOwned && (
                      <span className={cn("mt-1 block text-[10px] font-normal opacity-70", portal.colors.text)}>
                        ← your stage
                      </span>
                    )}
                    {isCurrent && !isOwned && (
                      <span className="mt-1 block text-[10px] font-normal text-sky-500">active</span>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
