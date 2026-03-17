import { type DiscussionMessage } from "@/data/types";

export const mockDiscussions: DiscussionMessage[] = [
  {
    id: "D-1",
    sender: "Anita Rao",
    role: "Stakeholder",
    content: "The major bottleneck is repeated data validation by different teams.",
    timestamp: "09:05",
  },
  {
    id: "D-2",
    sender: "Priya Sharma",
    role: "BA",
    content: "Captured. We should define a single risk validation service as shared capability.",
    timestamp: "09:10",
  },
  {
    id: "D-3",
    sender: "Arvind Kumar",
    role: "IT",
    content: "We can integrate with existing KYC APIs but need rate-limit handling in architecture.",
    timestamp: "09:14",
  },
];

export const mockMeetingNotes = [
  "Scope confirmed for Retail + SME lending products.",
  "Data sources identified: CRM, Core Banking, Risk Engine.",
  "Decision: target turnaround reduction from 9 days to 48 hours.",
];

export const mockDiscussionFiles = [
  "meeting-transcript-12-mar.txt",
  "current-process-map-v4.pdf",
  "risk-validation-findings.docx",
];
