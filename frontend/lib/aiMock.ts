export type AIContentType =
  | "brd"
  | "frd"
  | "userStories"
  | "testCases"
  | "summary"
  | "assistant";

const templates: Record<AIContentType, (prompt: string) => string> = {
  brd: (prompt) => `# Business Requirement Document\n\n## Problem Statement\n${prompt || "Improve cross-team requirement visibility"}\n\n## Scope\n- Intake and classify business requests\n- Track approvals and requirement maturity\n- Provide role-based dashboards\n\n## Stakeholders\n- Sponsor\n- Product Owner\n- Business Analyst\n- Engineering Lead\n\n## Risks\n- Delayed clarifications during approvals\n- Scope creep from unmanaged change requests\n- Incomplete UAT sign-off\n\n## Success Metrics\n- 30% faster BRD approval cycle\n- 20% fewer requirement defects`,
  frd: (prompt) => `# Functional Requirement Document\n\n## System Architecture\n- Next.js frontend application\n- Role-based route segmentation\n- Mock service layer for AI assistance\n\n## Core Modules\n1. Request Intake\n2. Requirement Authoring\n3. Testing and Release Tracking\n\n## API Contracts (Mock)\n- GET /requests\n- POST /requirements/generate\n- PATCH /approvals/{id}\n\n## Non-Functional Requirements\n- Responsive UI for desktop and mobile\n- Average page interaction under 200ms\n- Audit-ready status history\n\n## Notes\n${prompt || "Generate FRD from approved BRD sections"}`,
  userStories: (prompt) => `# Generated User Stories\n\n1. As a stakeholder, I want to submit business problems with priority so that BA can triage quickly.\n2. As a BA, I want to generate BRD and FRD drafts so that documentation is standardized.\n3. As an IT lead, I want sprint and SIT visibility so that deployments are predictable.\n\n## Acceptance Notes\n- Every story includes owner, estimate, and priority\n- Workflow status is visible across portals\n\nContext: ${prompt || "Portal-wide collaboration"}`,
  testCases: (prompt) => `# Test Cases\n\nTC-01: Submit business problem\n- Steps: Open form, fill details, submit\n- Expected: Request appears in My Requests with Submitted status\n\nTC-02: Approve BRD\n- Steps: Open Approvals, review BRD, click Approve\n- Expected: Document status updates to Approved\n\nTC-03: Mark SIT result\n- Steps: Open Test Cases & SIT, set status\n- Expected: SIT dashboard reflects updated state\n\nScenario: ${prompt || "Requirement lifecycle validation"}`,
  summary: () => "AI Summary: Stakeholders aligned on scope, BA requested one clarification for integrations, and IT estimated medium feasibility with a two-sprint delivery.",
  assistant: (prompt) => `AI Assistant Response:\n\nBased on your project context, next best action is to finalize pending BRD approvals and lock UAT entry criteria.\n\nQuestion interpreted: ${prompt || "What should we do next?"}`,
};

export async function simulateAIGeneration(type: AIContentType, prompt = "") {
  const wait = 1100 + Math.floor(Math.random() * 1400);
  await new Promise((resolve) => setTimeout(resolve, wait));
  return templates[type](prompt);
}