import { type Story } from "@/data/types";

export const mockStories: Story[] = [
  {
    id: "US-201",
    description: "As a credit officer, I need auto-prioritized applications to reduce queue delays.",
    priority: "High",
    sprint: "Sprint 9",
    status: "Approved",
  },
  {
    id: "US-202",
    description: "As an approver, I need SLA breach alerts to intervene early.",
    priority: "Medium",
    sprint: "Sprint 10",
    status: "In Progress",
  },
  {
    id: "US-203",
    description: "As a stakeholder, I need audit logs of decision points for compliance checks.",
    priority: "High",
    sprint: "Sprint 10",
    status: "Draft",
  },
];
