import { type Bug } from "@/data/types";

export const mockBugs: Bug[] = [
  {
    id: "BUG-701",
    severity: "High",
    status: "Open",
    assignedTeam: "Workflow Squad",
    createdDate: "2026-03-13",
  },
  {
    id: "BUG-702",
    severity: "Medium",
    status: "In Progress",
    assignedTeam: "API Squad",
    createdDate: "2026-03-12",
  },
  {
    id: "BUG-703",
    severity: "Low",
    status: "Resolved",
    assignedTeam: "UI Squad",
    createdDate: "2026-03-10",
  },
];
