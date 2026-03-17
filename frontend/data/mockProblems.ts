import { type BusinessProblem } from "@/data/types";

export const mockProblems: BusinessProblem[] = [
  {
    id: "BP-1001",
    title: "Reduce loan approval turnaround time",
    description:
      "Current loan workflow requires 5 manual handoffs, causing approval delays of 9-12 days.",
    department: "Retail Banking",
    priority: "Critical",
    stakeholder: "Anita Rao",
    status: "Submitted",
    assignedBA: "Unassigned",
    createdDate: "2026-03-01",
  },
  {
    id: "BP-1002",
    title: "Improve vendor invoice exception handling",
    description:
      "Finance teams spend too much effort reconciling unmatched invoice lines across systems.",
    department: "Finance",
    priority: "High",
    stakeholder: "Rahul Menon",
    status: "Requirement Gathering",
    assignedBA: "Priya Sharma",
    createdDate: "2026-02-20",
  },
  {
    id: "BP-1003",
    title: "Automate onboarding risk checks",
    description:
      "New customer checks are fragmented across compliance tools and require manual aggregation.",
    department: "Compliance",
    priority: "High",
    stakeholder: "Karthik Iyer",
    status: "BRD Approved",
    assignedBA: "Neha Nair",
    createdDate: "2026-02-05",
  },
];
