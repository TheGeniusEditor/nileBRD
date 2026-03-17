export type UserRole =
  | "Stakeholder"
  | "BA"
  | "IT"
  | "IT Project Manager"
  | "Vendor"
  | "Admin";

export type WorkflowStatus =
  | "Submitted"
  | "BA Assigned"
  | "Requirement Gathering"
  | "BRD Draft Generated"
  | "BRD Approved"
  | "IT Feasibility Completed"
  | "Development Assigned"
  | "FRD Draft Created"
  | "User Stories Approved"
  | "Test Cases Generated"
  | "SIT Completed"
  | "UAT Completed"
  | "Production Deployment";

export interface BusinessProblem {
  id: string;
  title: string;
  description: string;
  department: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  stakeholder: string;
  status: WorkflowStatus;
  assignedBA: string;
  createdDate: string;
}

export interface DiscussionMessage {
  id: string;
  sender: string;
  role: UserRole;
  content: string;
  timestamp: string;
}

export interface BRDSection {
  title: string;
  content: string;
}

export interface BRDVersion {
  version: string;
  label: string;
  status: "Draft" | "Under Review" | "Approved";
  updatedBy: string;
  updatedAt: string;
}

export interface Story {
  id: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  sprint: string;
  status: "Draft" | "Approved" | "In Progress" | "Done";
}

export interface TestCase {
  id: string;
  storyRef: string;
  steps: string;
  expectedResult: string;
  status: "Not Started" | "Pass" | "Fail";
  executedBy: string;
  date: string;
}

export interface Bug {
  id: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "In Progress" | "Resolved";
  assignedTeam: string;
  createdDate: string;
}

export interface Deployment {
  id: string;
  milestone: string;
  environment: "Development" | "Testing" | "Production";
  releaseDate: string;
  status: string;
}
