export type ConversationThread = {
  id: string;
  title: string;
  date: string;
  time?: string;
  participants?: string;
  transcript?: string;
  notes?: string;
};

export type BRDMasterData = {
  title: string;
  bu: string;
  domain: string;
  product: string;
  priority: string;
  objective: string;
  kpis: string;
  assumptions: string;
  constraints: string;
  tags: string;
  scopeIn: string;
  scopeOut: string;
  channels: string;
  personas: string;
  process: string;
  sources: string;
  consumers: string;
  retentionYears: string;
  auditRequired: string;
  piiClass: string;
  regMap: string;
  mis: string;
  tps: string;
  latency: string;
  availability: string;
  rpo: string;
  rto: string;
  auth: string;
  securityControls: string;
  observability: string;
};

export type RequestStatus =
  | "new"
  | "in_progress"
  | "generated"
  | "sent"
  | "approved"
  | "changes_requested";

export type StakeholderRequest = {
  id: string;
  reqType: string;
  reqTitle: string;
  owner: string;
  tenant: string;
  priority: string;
  brief: string;
  threads: ConversationThread[];
  createdAt: string;
  createdBy: "stakeholder" | "ba";
  status: RequestStatus;
  brdMaster?: BRDMasterData;
  aiGeneratedAt?: string;
  sentAt?: string;
  reviewerComment?: string;
};

const REQUESTS_KEY = "allRequests";

export const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

const getNow = () => new Date().toLocaleString();

const safeParse = <T,>(value: string | null, fallback: T): T => {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const getRequests = (): StakeholderRequest[] => {
  if (typeof window === "undefined") {
    return [];
  }

  return safeParse<StakeholderRequest[]>(window.localStorage.getItem(REQUESTS_KEY), []);
};

export const saveRequests = (requests: StakeholderRequest[]) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
};

export const defaultBRDMasterFromRequest = (request: StakeholderRequest): BRDMasterData => ({
  title: request.reqTitle || "Digital Loan Origination (LOS) — Retail Term Loan",
  bu: request.owner || "Retail Lending",
  domain: "Lending / LOS",
  product: "Retail Term Loan",
  priority: request.priority || "P2",
  objective:
    request.brief ||
    "Reduce onboarding turnaround time and improve policy compliance via rule-driven eligibility, automated KYC/AML checks, and audit-grade approvals.",
  kpis: "Reduce TAT from 2 days to 2 hours\nIncrease conversion by 12%\nReduce manual exceptions by 40%",
  assumptions: "CKYC and bureau services available 99.5%+\nBranch users trained on maker-checker\nDMS supports versioned docs",
  constraints: "Must integrate with existing CBS & LMS\nAudit retention 8 years\nPII must be masked by default",
  tags: "NBFC, KYC, AML, Audit, Maker-Checker",
  scopeIn:
    "Digital onboarding with CKYC prefill\nEligibility + pricing rule engine (FOIR/DSCR/LTV)\nMaker-checker approvals with SLAs\nAudit trail & evidence logs",
  scopeOut: "Collections module changes\nGeneral ledger posting changes",
  channels: "Branch, DSA, Web, API",
  personas: "Customer, DSA, RM, Credit Officer, Risk, Compliance, InfoSec",
  process:
    "As-Is: manual document collection and approval tracking.\nTo-Be: rule-driven eligibility, automated checks, staged approvals with evidence, exportable audit pack.",
  sources: "Credit Bureau\nBank statement aggregator\nCBS\nCRM\nDMS\nAML screening",
  consumers: "LMS\nCBS\nDWH/MIS\nRegulatory reporting",
  retentionYears: "8",
  auditRequired: "Yes",
  piiClass: "High",
  regMap: "RBI KYC Master Direction\nRBI Digital Lending Guidelines\nInternal Credit Policy CP-RTL-2026",
  mis: "TAT by channel\nException rate\nPolicy overrides by approver\nAudit extracts (monthly)",
  tps: "200 TPS / 2,000 concurrent",
  latency: "P95 < 300ms (eligibility); P95 < 1s (document validation)",
  availability: "99.9%",
  rpo: "15 min",
  rto: "2 hours",
  auth: "SSO + MFA + RBAC",
  securityControls:
    "PII masking in UI\nEncryption at rest/in transit\nHSM keys\nMaker-checker for overrides\nImmutable audit logs",
  observability: "Correlation/trace IDs\nCentralized logs\nAlerting on SLA breaches\nAudit dashboards",
});

export const createStakeholderRequest = (payload: {
  reqType: string;
  reqTitle: string;
  owner: string;
  tenant: string;
  priority: string;
  brief: string;
  threads: ConversationThread[];
}): StakeholderRequest => ({
  id: createId(),
  ...payload,
  createdAt: getNow(),
  createdBy: "stakeholder",
  status: "new",
});

export const applyMockAiGeneration = (master: BRDMasterData): BRDMasterData => ({
  ...master,
  objective:
    master.objective ||
    "Reduce processing TAT, improve compliance adherence, and strengthen auditability with maker-checker controls.",
  kpis:
    master.kpis ||
    "Reduce turnaround time by 40%\nIncrease straight-through processing to 70%\nReduce manual exceptions by 30%",
  scopeIn:
    master.scopeIn ||
    "Request capture and validation\nMaker-checker approvals\nAudit trail and evidence logging\nStakeholder review workflow",
  scopeOut: master.scopeOut || "Legacy process redesign\nDownstream collections process changes",
  regMap:
    master.regMap ||
    "RBI KYC Master Direction\nRBI Digital Lending Guidelines\nInternal Information Security Policy",
  securityControls:
    master.securityControls ||
    "PII masking\nEncryption at rest and in transit\nRole-based access with MFA\nImmutable audit logs",
  observability:
    master.observability ||
    "Structured logs\nSLA breach alerts\nTrace IDs across workflow stages",
  process:
    master.process ||
    "As-Is: intake and alignment happen via ad-hoc communication.\nTo-Be: stakeholder request is tracked, BA drafts BRD master, then sends for structured review and approval.",
});

export const buildPHLTemplateBRD = (request: StakeholderRequest, master: BRDMasterData): string => {
  const clean = (value: string | undefined) => (value && value.trim() ? value.trim() : "TBD");

  return [
    "LOS FOR PRIME HOME LOAN (PHL)",
    "BRD Document",
    `Version no.: ${request.status === "generated" || request.status === "sent" || request.status === "approved" ? "1.0" : "0.5"}`,
    `Effective Date: ${new Date().toLocaleDateString()}`,
    "",
    "Objective",
    clean(master.objective),
    "",
    "Scope:",
    `- Product: ${clean(master.product)}`,
    `- Business Unit / Function: ${clean(master.bu)}`,
    `- Domain: ${clean(master.domain)}`,
    `- Priority: ${clean(master.priority)}`,
    `- In Scope: ${clean(master.scopeIn)}`,
    `- Out of Scope: ${clean(master.scopeOut)}`,
    "",
    "Process -",
    clean(master.process),
    "",
    "Policy Parameters",
    `- Tags: ${clean(master.tags)}`,
    `- Personas: ${clean(master.personas)}`,
    `- Channels: ${clean(master.channels)}`,
    "",
    "General Product and Policy Norms to be updated in system",
    `- Assumptions: ${clean(master.assumptions)}`,
    `- Constraints: ${clean(master.constraints)}`,
    `- Regulatory Mapping: ${clean(master.regMap)}`,
    "",
    "System Changes – Mobile Application / LOS",
    "- Customer Type, Eligibility, and underwriting capture will be enabled as per policy setup.",
    `- Security Controls: ${clean(master.securityControls)}`,
    `- AuthN/AuthZ: ${clean(master.auth)}`,
    "",
    "Income Eligibility and Program Inputs",
    `- Success Metrics / KPIs: ${clean(master.kpis)}`,
    `- Upstream Data Sources: ${clean(master.sources)}`,
    `- Downstream Consumers: ${clean(master.consumers)}`,
    "",
    "Data / Reporting / Regulatory",
    `- Retention Years: ${clean(master.retentionYears)}`,
    `- Audit Required: ${clean(master.auditRequired)}`,
    `- PII Class: ${clean(master.piiClass)}`,
    `- MIS / Reporting: ${clean(master.mis)}`,
    "",
    "NFR Baseline",
    `- Peak TPS / Concurrency: ${clean(master.tps)}`,
    `- Latency: ${clean(master.latency)}`,
    `- Availability: ${clean(master.availability)}`,
    `- RPO: ${clean(master.rpo)}`,
    `- RTO: ${clean(master.rto)}`,
    `- Observability: ${clean(master.observability)}`,
    "",
    "Review / Approval",
    `- Request Title: ${clean(request.reqTitle)}`,
    `- Owner: ${clean(request.owner)}`,
    `- Tenant: ${clean(request.tenant)}`,
    `- Status: ${clean(request.status.replace("_", " "))}`,
    `- Reviewer Comment: ${clean(request.reviewerComment)}`,
  ].join("\n");
};