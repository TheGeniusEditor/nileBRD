import { type UserRole, type WorkflowStatus } from "@/data/types";

export interface PortalStepConfig {
  id: number;
  label: string;
  description: string;
  route: string;
  triggerStatus: WorkflowStatus;
}

export interface PortalColorClasses {
  bg: string;
  text: string;
  border: string;
  badgeBg: string;
  badgeText: string;
  ring: string;
}

export interface PortalConfig {
  slug: string;
  title: string;
  shortTitle: string;
  role: UserRole;
  description: string;
  colors: PortalColorClasses;
  primaryRoute: string;
  steps: PortalStepConfig[];
}

/** The 13-stage global pipeline — each stage mapped to the primary owning role */
export const workflowPipeline: Array<{
  status: WorkflowStatus;
  step: number;
  name: string;
  ownerSlug: string;
  ownerLabel: string;
}> = [
  { status: "Submitted",               step: 1,  name: "Problem Submission",   ownerSlug: "stakeholder", ownerLabel: "Stakeholder" },
  { status: "BA Assigned",             step: 2,  name: "BA Assignment",        ownerSlug: "admin",       ownerLabel: "Admin" },
  { status: "Requirement Gathering",   step: 3,  name: "Req. Gathering",       ownerSlug: "ba",          ownerLabel: "BA" },
  { status: "BRD Draft Generated",     step: 4,  name: "BRD Generation",       ownerSlug: "ba",          ownerLabel: "BA" },
  { status: "BRD Approved",            step: 5,  name: "BRD Approval",         ownerSlug: "stakeholder", ownerLabel: "Stakeholder" },
  { status: "IT Feasibility Completed",step: 6,  name: "IT Feasibility",       ownerSlug: "it",          ownerLabel: "IT Team" },
  { status: "Development Assigned",    step: 7,  name: "Dev Assignment",       ownerSlug: "it-pm",       ownerLabel: "IT PM" },
  { status: "FRD Draft Created",       step: 8,  name: "FRD Creation",         ownerSlug: "it",          ownerLabel: "IT Team" },
  { status: "User Stories Approved",   step: 9,  name: "User Stories",         ownerSlug: "stakeholder", ownerLabel: "Stakeholder" },
  { status: "Test Cases Generated",    step: 10, name: "Test Cases",           ownerSlug: "it",          ownerLabel: "IT Team" },
  { status: "SIT Completed",           step: 11, name: "SIT Testing",          ownerSlug: "it",          ownerLabel: "IT Team" },
  { status: "UAT Completed",           step: 12, name: "UAT Sign-Off",         ownerSlug: "stakeholder", ownerLabel: "Stakeholder" },
  { status: "Production Deployment",   step: 13, name: "Deployment",           ownerSlug: "it-pm",       ownerLabel: "IT PM" },
];

/** Tailwind color tokens per role — use explicit strings so Tailwind doesn't purge them */
export const roleColorMap: Record<string, PortalColorClasses> = {
  stakeholder: { bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-200", badgeBg: "bg-violet-100", badgeText: "text-violet-700", ring: "ring-violet-400" },
  ba:          { bg: "bg-sky-50",     text: "text-sky-700",     border: "border-sky-200",    badgeBg: "bg-sky-100",    badgeText: "text-sky-700",    ring: "ring-sky-400"    },
  it:          { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200",badgeBg: "bg-emerald-100",badgeText: "text-emerald-700",ring: "ring-emerald-400"},
  "it-pm":     { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",  badgeBg: "bg-amber-100",  badgeText: "text-amber-700",  ring: "ring-amber-400"  },
  vendor:      { bg: "bg-rose-50",    text: "text-rose-700",    border: "border-rose-200",   badgeBg: "bg-rose-100",   badgeText: "text-rose-700",   ring: "ring-rose-400"   },
  admin:       { bg: "bg-slate-100",  text: "text-slate-700",   border: "border-slate-300",  badgeBg: "bg-slate-200",  badgeText: "text-slate-700",  ring: "ring-slate-400"  },
};

export const portalConfigs: PortalConfig[] = [
  {
    slug: "stakeholder",
    title: "Stakeholder Portal",
    shortTitle: "Stakeholder",
    role: "Stakeholder",
    description:
      "Submit business problems, participate in requirement discussions, approve BRDs, review user stories, and conduct UAT sign-off.",
    colors: roleColorMap.stakeholder,
    primaryRoute: "/business-problems",
    steps: [
      {
        id: 1,
        label: "Submit Business Problem",
        description: "Define the business problem with priority, department, and supporting attachments.",
        route: "/business-problems",
        triggerStatus: "Submitted",
      },
      {
        id: 3,
        label: "Participate in Discussions",
        description: "Join requirement gathering sessions, share context, and upload supporting documents.",
        route: "/discussions",
        triggerStatus: "Requirement Gathering",
      },
      {
        id: 5,
        label: "Approve BRD",
        description: "Review generated BRD, add comments, request changes, or formally approve.",
        route: "/brd",
        triggerStatus: "BRD Approved",
      },
      {
        id: 9,
        label: "Approve User Stories",
        description: "Review AI-generated user story backlog and sign off on sprint-level requirements.",
        route: "/user-stories",
        triggerStatus: "User Stories Approved",
      },
      {
        id: 12,
        label: "UAT Sign-Off",
        description: "Execute acceptance test scenarios and deliver formal sign-off before production.",
        route: "/uat-testing",
        triggerStatus: "UAT Completed",
      },
    ],
  },
  {
    slug: "ba",
    title: "Business Analyst Portal",
    shortTitle: "BA",
    role: "BA",
    description:
      "Lead requirement gathering, facilitate stakeholder discussions, generate AI-powered BRDs, manage version control, and coordinate FRD handoffs.",
    colors: roleColorMap.ba,
    primaryRoute: "/brd",
    steps: [
      {
        id: 2,
        label: "Receive BA Assignment",
        description: "Pick up assigned problems from Admin and begin requirement analysis.",
        route: "/business-problems",
        triggerStatus: "BA Assigned",
      },
      {
        id: 3,
        label: "Conduct Discussions",
        description: "Facilitate structured sessions, capture meeting transcripts, and gather clarifications.",
        route: "/discussions",
        triggerStatus: "Requirement Gathering",
      },
      {
        id: 4,
        label: "Generate & Manage BRD",
        description: "Trigger AI BRD generation, edit sections, save versions, and share with stakeholders.",
        route: "/brd",
        triggerStatus: "BRD Draft Generated",
      },
      {
        id: 8,
        label: "Coordinate FRD Handoff",
        description: "Align with IT team on functional requirements and confirm architecture approach.",
        route: "/frd",
        triggerStatus: "FRD Draft Created",
      },
    ],
  },
  {
    slug: "it",
    title: "IT Team Portal",
    shortTitle: "IT Team",
    role: "IT",
    description:
      "Assess technical feasibility, define system architecture, create FRDs, generate AI test cases, and execute SIT cycles.",
    colors: roleColorMap.it,
    primaryRoute: "/frd",
    steps: [
      {
        id: 6,
        label: "IT Feasibility Analysis",
        description: "Evaluate BRD for technical viability, define risks, architecture, and cost estimates.",
        route: "/frd",
        triggerStatus: "IT Feasibility Completed",
      },
      {
        id: 8,
        label: "Create FRD",
        description: "Build the Functional Requirement Document: APIs, DB design, modules, and integrations.",
        route: "/frd",
        triggerStatus: "FRD Draft Created",
      },
      {
        id: 10,
        label: "Generate Test Cases",
        description: "AI-generate comprehensive test cases from approved user stories.",
        route: "/test-cases",
        triggerStatus: "Test Cases Generated",
      },
      {
        id: 11,
        label: "Execute SIT",
        description: "Run system integration tests, record pass/fail results, and log defects.",
        route: "/sit-testing",
        triggerStatus: "SIT Completed",
      },
    ],
  },
  {
    slug: "it-pm",
    title: "IT Project Manager Portal",
    shortTitle: "IT PM",
    role: "IT Project Manager",
    description:
      "Assign development teams, govern delivery milestones, track sprint progress, and manage production deployments.",
    colors: roleColorMap["it-pm"],
    primaryRoute: "/deployments",
    steps: [
      {
        id: 7,
        label: "Assign Development Team",
        description: "Choose internal squad or external vendor and assign to the delivery stream.",
        route: "/frd",
        triggerStatus: "Development Assigned",
      },
      {
        id: 9,
        label: "Govern User Stories",
        description: "Review sprint allocation and confirm story prioritisation with the BA.",
        route: "/user-stories",
        triggerStatus: "User Stories Approved",
      },
      {
        id: 13,
        label: "Production Deployment",
        description: "Approve release window, track rollout milestones, and monitor post-deployment health.",
        route: "/deployments",
        triggerStatus: "Production Deployment",
      },
    ],
  },
  {
    slug: "vendor",
    title: "Vendor Portal",
    shortTitle: "Vendor",
    role: "Vendor",
    description:
      "Receive external development assignments, upload FRD packages, coordinate bug fixes, and confirm release readiness.",
    colors: roleColorMap.vendor,
    primaryRoute: "/frd",
    steps: [
      {
        id: 7,
        label: "Confirm Delivery Assignment",
        description: "Review scope, timeline, and acceptance criteria from the IT Project Manager.",
        route: "/frd",
        triggerStatus: "Development Assigned",
      },
      {
        id: 8,
        label: "Upload Vendor FRD",
        description: "Submit outsourced FRD package for enterprise review and approval.",
        route: "/frd",
        triggerStatus: "FRD Draft Created",
      },
      {
        id: 11,
        label: "Bug Coordination",
        description: "Triage and resolve defects raised during SIT and UAT rounds.",
        route: "/bugs",
        triggerStatus: "SIT Completed",
      },
      {
        id: 13,
        label: "Release Readiness Confirmation",
        description: "Confirm all delivery milestones and sign off on deployment readiness.",
        route: "/deployments",
        triggerStatus: "Production Deployment",
      },
    ],
  },
  {
    slug: "admin",
    title: "Admin Portal",
    shortTitle: "Admin",
    role: "Admin",
    description:
      "Manage all users and projects, assign BAs, oversee development allocation, govern bugs, and monitor the full lifecycle end-to-end.",
    colors: roleColorMap.admin,
    primaryRoute: "/dashboard",
    steps: [
      {
        id: 2,
        label: "Assign Business Analyst",
        description: "Review submitted problems and assign the appropriate BA to lead each.",
        route: "/business-problems",
        triggerStatus: "BA Assigned",
      },
      {
        id: 7,
        label: "Development Oversight",
        description: "Approve resource allocation decisions made by the IT Project Manager.",
        route: "/frd",
        triggerStatus: "Development Assigned",
      },
      {
        id: 11,
        label: "Bug Governance",
        description: "Monitor open defects, severity escalations, and SLA compliance across all teams.",
        route: "/bugs",
        triggerStatus: "SIT Completed",
      },
      {
        id: 13,
        label: "Post-Production Monitoring",
        description: "Track system health, project metrics, and outcomes after production rollout.",
        route: "/admin",
        triggerStatus: "Production Deployment",
      },
    ],
  },
];

export const portalBySlug: Record<string, PortalConfig> = Object.fromEntries(
  portalConfigs.map((p) => [p.slug, p]),
);
