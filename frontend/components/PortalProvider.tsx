"use client";

import { createContext, useContext, useMemo, useState } from "react";

import { mockBRDVersions } from "@/data/mockBRDs";
import { mockBugs } from "@/data/mockBugs";
import { mockDeployments } from "@/data/mockDeployments";
import { mockProblems } from "@/data/mockProblems";
import { mockStories } from "@/data/mockStories";
import { mockTestCases } from "@/data/mockTestCases";
import {
  type BRDVersion,
  type BusinessProblem,
  type Bug,
  type Deployment,
  type Story,
  type TestCase,
  type UserRole,
  type WorkflowStatus,
} from "@/data/types";

const workflowSequence: WorkflowStatus[] = [
  "Submitted",
  "BA Assigned",
  "Requirement Gathering",
  "BRD Draft Generated",
  "BRD Approved",
  "IT Feasibility Completed",
  "Development Assigned",
  "FRD Draft Created",
  "User Stories Approved",
  "Test Cases Generated",
  "SIT Completed",
  "UAT Completed",
  "Production Deployment",
];

interface PortalContextValue {
  role: UserRole;
  setRole: (role: UserRole) => void;
  workflowStatus: WorkflowStatus;
  setWorkflowStatus: (status: WorkflowStatus) => void;
  progressWorkflow: () => void;
  problems: BusinessProblem[];
  setProblems: (problems: BusinessProblem[]) => void;
  stories: Story[];
  testCases: TestCase[];
  bugs: Bug[];
  deployments: Deployment[];
  brdVersions: BRDVersion[];
}

const PortalContext = createContext<PortalContextValue | null>(null);

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>("Stakeholder");
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>("Submitted");
  const [problems, setProblems] = useState<BusinessProblem[]>(mockProblems);

  const progressWorkflow = () => {
    setWorkflowStatus((current) => {
      const currentIndex = workflowSequence.indexOf(current);
      const nextIndex = Math.min(currentIndex + 1, workflowSequence.length - 1);
      return workflowSequence[nextIndex];
    });
  };

  const value = useMemo(
    () => ({
      role,
      setRole,
      workflowStatus,
      setWorkflowStatus,
      progressWorkflow,
      problems,
      setProblems,
      stories: mockStories,
      testCases: mockTestCases,
      bugs: mockBugs,
      deployments: mockDeployments,
      brdVersions: mockBRDVersions,
    }),
    [role, workflowStatus, problems],
  );

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
}

export function usePortal() {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error("usePortal must be used within PortalProvider");
  }
  return context;
}

export { workflowSequence };
