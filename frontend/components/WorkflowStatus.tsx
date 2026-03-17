"use client";

import { CheckCircle2, Circle } from "lucide-react";

import { workflowSequence } from "@/components/PortalProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type WorkflowStatus } from "@/data/types";
import { cn } from "@/lib/utils";

interface WorkflowStatusProps {
  currentStatus: WorkflowStatus;
  onNextStep: () => void;
  title?: string;
}

export function WorkflowStatus({ currentStatus, onNextStep, title = "Workflow Progress" }: WorkflowStatusProps) {
  const currentIndex = workflowSequence.indexOf(currentStatus);
  const isFinal = currentIndex >= workflowSequence.length - 1;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Button size="sm" onClick={onNextStep} disabled={isFinal}>
          Move to Next Stage
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {workflowSequence.map((step, index) => {
          const completed = index <= currentIndex;
          const active = index === currentIndex;

          return (
            <div key={step} className="flex items-start gap-3">
              {completed ? (
                <CheckCircle2 className={cn("mt-0.5 h-4 w-4", active ? "text-sky-600" : "text-emerald-600")} />
              ) : (
                <Circle className="mt-0.5 h-4 w-4 text-slate-300" />
              )}
              <div>
                <p className={cn("text-sm", active ? "font-semibold text-slate-900" : "text-slate-600")}>{step}</p>
                {active ? <p className="text-xs text-sky-600">Current active stage</p> : null}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
