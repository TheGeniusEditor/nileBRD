import { type TestCase } from "@/data/types";

export const mockTestCases: TestCase[] = [
  {
    id: "TC-301",
    storyRef: "US-201",
    steps: "Submit loan request with complete profile and valid KYC.",
    expectedResult: "System auto-routes to credit queue in less than 2 minutes.",
    status: "Pass",
    executedBy: "QA Team A",
    date: "2026-03-12",
  },
  {
    id: "TC-302",
    storyRef: "US-202",
    steps: "Delay risk score response beyond threshold by 30 minutes.",
    expectedResult: "SLA alert notification sent to approver and project channel.",
    status: "Fail",
    executedBy: "QA Team B",
    date: "2026-03-13",
  },
  {
    id: "TC-303",
    storyRef: "US-203",
    steps: "Approve and reject application paths with full metadata.",
    expectedResult: "Audit event captured with actor, timestamp, and decision reason.",
    status: "Not Started",
    executedBy: "QA Team C",
    date: "2026-03-14",
  },
];
