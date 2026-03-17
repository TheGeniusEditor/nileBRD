import { type BRDSection, type BRDVersion } from "@/data/types";

export const mockBRDSections: BRDSection[] = [
  {
    title: "Business Problem Statement",
    content:
      "Loan approval timelines are exceeding SLA due to fragmented validations and manual approvals.",
  },
  {
    title: "Scope",
    content:
      "Automate risk checks, consolidate document validation, and standardize approval routing.",
  },
  {
    title: "Stakeholders",
    content: "Retail Banking Head, Credit Ops Manager, Risk Team Lead, IT Architecture Team.",
  },
  {
    title: "Risks",
    content:
      "Legacy system integration latency, regulatory rule changes, and incomplete customer profiles.",
  },
  {
    title: "Integrations",
    content: "Core Banking API, KYC Service, CRM Platform, Notification Gateway.",
  },
  {
    title: "Estimated Cost",
    content: "Estimated implementation cost: USD 280,000 including integration and QA cycles.",
  },
  {
    title: "Timeline",
    content: "12 weeks end-to-end including BRD sign-off, SIT/UAT, and production rollout.",
  },
];

export const mockBRDVersions: BRDVersion[] = [
  {
    version: "v1.0",
    label: "Version 1 Draft",
    status: "Draft",
    updatedBy: "Priya Sharma",
    updatedAt: "2026-03-03 11:20",
  },
  {
    version: "v2.0",
    label: "Version 2 Updated",
    status: "Under Review",
    updatedBy: "Priya Sharma",
    updatedAt: "2026-03-07 16:45",
  },
  {
    version: "v3.0",
    label: "Version 3 Approved",
    status: "Approved",
    updatedBy: "Anita Rao",
    updatedAt: "2026-03-10 09:30",
  },
];
