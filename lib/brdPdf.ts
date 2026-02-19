import { jsPDF } from "jspdf";
import { BRDMasterData, StakeholderRequest } from "./workflow";

type LayoutState = {
  doc: jsPDF;
  marginX: number;
  y: number;
  pageWidth: number;
  pageHeight: number;
  contentWidth: number;
  pageNumber: number;
};

const CONFIDENTIAL_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bRBL\s*BANK\b/gi, "ABC BANK"],
  [/\bRBL\b/gi, "ABC"],
  [/\bSARTHAK\b/gi, "LOS_PLATFORM_X"],
  [/\bFINACLE\b/gi, "CORE_SYSTEM_X"],
  [/\bAHL\b/gi, "PRODUCT_X"],
  [/\bMSME\b/gi, "PRODUCT_Y"],
  [/\bPHL\b/gi, "PRODUCT_Z"],
  [/\bCIBIL\b/gi, "BUREAU_X"],
  [/\bPOSIDEX\b/gi, "VENDOR_X"],
  [/\bRAMP\b/gi, "ENGINE_X"],
  [/\bNCR\b/gi, "REGION_1"],
  [/\bMPCG\b/gi, "REGION_2"],
];

const maskConfidentialPatterns = (value: string) => {
  let masked = value;

  CONFIDENTIAL_REPLACEMENTS.forEach(([pattern, replacement]) => {
    masked = masked.replace(pattern, replacement);
  });

  masked = masked.replace(/\b[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}\b/g, "user@mock.example");
  masked = masked.replace(/\b\+?\d[\d\s-]{8,}\b/g, "XXXXXXXXXX");
  masked = masked.replace(/\b\d{8,}\b/g, "XXXXXXXX");

  return masked;
};

const clean = (value: string | undefined, fallback = "TBD") => {
  const normalized = value?.trim();
  return normalized ? maskConfidentialPatterns(normalized) : fallback;
};

const drawPageFrame = (state: LayoutState) => {
  const { doc, pageWidth, pageHeight } = state;
  doc.setDrawColor(40, 40, 40);
  doc.setLineWidth(0.5);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16);
};

const drawHeader = (state: LayoutState, title: string) => {
  const { doc, marginX, pageWidth } = state;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(110, 110, 110);
  doc.text(title, pageWidth / 2, 20, { align: "center" });

  doc.setDrawColor(171, 139, 139);
  doc.setLineWidth(1.2);
  doc.line(marginX, 24, pageWidth - marginX, 24);
};

const drawFooter = (state: LayoutState) => {
  const { doc, pageWidth, pageHeight, pageNumber } = state;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text(`Page | ${pageNumber}`, pageWidth - 18, pageHeight - 14, { align: "right" });
};

const addNewPage = (state: LayoutState, headerTitle: string) => {
  state.doc.addPage();
  state.pageNumber += 1;
  drawPageFrame(state);
  drawHeader(state, headerTitle);
  drawFooter(state);
  state.y = 34;
};

const ensureSpace = (state: LayoutState, heightNeeded: number, headerTitle: string) => {
  const safeBottom = state.pageHeight - 26;
  if (state.y + heightNeeded <= safeBottom) {
    return;
  }

  addNewPage(state, headerTitle);
};

const writeWrappedText = (
  state: LayoutState,
  text: string,
  options?: {
    lineHeight?: number;
    fontSize?: number;
    bold?: boolean;
    color?: [number, number, number];
    indent?: number;
    before?: number;
    after?: number;
    headerTitle?: string;
  }
) => {
  const lineHeight = options?.lineHeight ?? 6;
  const fontSize = options?.fontSize ?? 11;
  const indent = options?.indent ?? 0;
  const before = options?.before ?? 0;
  const after = options?.after ?? 0;
  const headerTitle = options?.headerTitle ?? "BRD for PRIME HOME LOAN LOS";

  if (before > 0) {
    state.y += before;
  }

  state.doc.setFont("helvetica", options?.bold ? "bold" : "normal");
  state.doc.setFontSize(fontSize);
  const color = options?.color ?? [20, 20, 20];
  state.doc.setTextColor(color[0], color[1], color[2]);

  const maxWidth = state.contentWidth - indent;
  const lines = state.doc.splitTextToSize(text, maxWidth);
  const blockHeight = lines.length * lineHeight;
  ensureSpace(state, blockHeight + after, headerTitle);
  state.doc.text(lines, state.marginX + indent, state.y);
  state.y += blockHeight + after;
};

const writeBulletList = (
  state: LayoutState,
  lines: string[],
  headerTitle: string,
  highlight = false
) => {
  lines.forEach((line) => {
    const item = line.trim();
    if (!item) {
      return;
    }

    const bulletText = `• ${item}`;
    const wrapped = state.doc.splitTextToSize(bulletText, state.contentWidth - 8);
    const blockHeight = wrapped.length * 6;
    ensureSpace(state, blockHeight + 2, headerTitle);

    if (highlight) {
      state.doc.setFillColor(250, 244, 120);
      state.doc.rect(state.marginX - 1, state.y - 4.8, state.contentWidth + 2, blockHeight + 1.8, "F");
    }

    state.doc.setFont("helvetica", "normal");
    state.doc.setFontSize(11);
    state.doc.setTextColor(20, 20, 20);
    state.doc.text(wrapped, state.marginX + 4, state.y);
    state.y += blockHeight + 2;
  });
};

const splitLines = (value: string | undefined) =>
  clean(value, "").split(/\n+/).map((line) => line.trim()).filter(Boolean);

export const generatePHLBRDPdfBlob = async (
  request: StakeholderRequest,
  master: BRDMasterData
): Promise<Blob> => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const state: LayoutState = {
    doc,
    marginX: 18,
    y: 34,
    pageWidth: doc.internal.pageSize.getWidth(),
    pageHeight: doc.internal.pageSize.getHeight(),
    contentWidth: doc.internal.pageSize.getWidth() - 36,
    pageNumber: 1,
  };

  const headerTitle = "BRD for PRIME HOME LOAN LOS";
  drawPageFrame(state);
  drawHeader(state, headerTitle);
  drawFooter(state);

  writeWrappedText(state, "ABC BANK", {
    fontSize: 28,
    bold: true,
    color: [45, 58, 130],
    before: 18,
    after: 16,
    headerTitle,
  });

  writeWrappedText(state, "LOS FOR PRIME HOME LOAN (PRODUCT_Z)", {
    fontSize: 18,
    bold: true,
    color: [0, 40, 200],
    before: 6,
    after: 20,
    headerTitle,
  });

  writeWrappedText(state, "BRD DOCUMENT", {
    fontSize: 16,
    bold: true,
    color: [190, 0, 0],
    after: 120,
    headerTitle,
  });

  writeWrappedText(state, `Version no. : ${request.status === "generated" || request.status === "sent" || request.status === "approved" ? "1.0" : "0.5"}`, {
    fontSize: 11,
    headerTitle,
  });

  writeWrappedText(state, `Effective Date : ${new Date().toLocaleDateString()}`, {
    fontSize: 11,
    before: 2,
    headerTitle,
  });

  addNewPage(state, headerTitle);

  writeWrappedText(state, "1.  Objective", {
    fontSize: 15,
    bold: true,
    color: [45, 87, 135],
    after: 8,
    headerTitle,
  });

  writeWrappedText(state, clean(master.objective), {
    fontSize: 11,
    lineHeight: 6,
    after: 10,
    headerTitle,
  });

  writeWrappedText(state, "Scope:", {
    fontSize: 13,
    bold: true,
    color: [45, 87, 135],
    after: 6,
    headerTitle,
  });

  writeBulletList(
    state,
    [
      `Product: ${clean(master.product)}`,
      `Business Unit: ${clean(master.bu)}`,
      `Domain: ${clean(master.domain)}`,
      `Priority: ${clean(master.priority)}`,
      `In Scope: ${clean(master.scopeIn)}`,
      `Out of Scope: ${clean(master.scopeOut)}`,
    ],
    headerTitle
  );

  writeWrappedText(state, "2.  Process -", {
    fontSize: 15,
    bold: true,
    color: [45, 87, 135],
    before: 8,
    after: 8,
    headerTitle,
  });

  writeBulletList(
    state,
    splitLines(master.process).length ? splitLines(master.process) : [clean(master.process)],
    headerTitle
  );

  addNewPage(state, headerTitle);

  writeWrappedText(state, "3.  Policy Parameters", {
    fontSize: 15,
    bold: true,
    color: [45, 87, 135],
    after: 10,
    headerTitle,
  });

  writeWrappedText(state, `Product Name: ${clean(master.product)}`, {
    fontSize: 11,
    bold: true,
    after: 4,
    headerTitle,
  });

  writeWrappedText(state, "Loan Classification:", {
    fontSize: 11,
    bold: true,
    before: 6,
    after: 4,
    headerTitle,
  });

  writeBulletList(
    state,
    [
      `Tier 1 - ${clean(master.tags)}`,
      `Tier 2 - ${clean(master.channels)}`,
      `Tier 3 - ${clean(master.personas)}`,
    ],
    headerTitle,
    true
  );

  writeWrappedText(state, "General Product and Policy Norms to be updated in system for PHL", {
    fontSize: 12,
    bold: true,
    before: 8,
    after: 6,
    headerTitle,
  });

  writeBulletList(
    state,
    [
      `Assumptions: ${clean(master.assumptions)}`,
      `Constraints: ${clean(master.constraints)}`,
      `Regulatory Mapping: ${clean(master.regMap)}`,
      `Security Controls: ${clean(master.securityControls)}`,
      `AuthN/AuthZ: ${clean(master.auth)}`,
      `Success Metrics / KPIs: ${clean(master.kpis)}`,
      `Upstream Sources: ${clean(master.sources)}`,
      `Downstream Consumers: ${clean(master.consumers)}`,
      `Retention Years: ${clean(master.retentionYears)} | Audit Required: ${clean(master.auditRequired)} | PII Class: ${clean(master.piiClass)}`,
      `MIS / Reporting: ${clean(master.mis)}`,
      `NFR Baseline: ${clean(master.tps)} | ${clean(master.latency)} | Availability ${clean(master.availability)} | RPO ${clean(master.rpo)} | RTO ${clean(master.rto)}`,
      `Observability: ${clean(master.observability)}`,
      `Request Title: ${clean(request.reqTitle)} | Owner: ${clean(request.owner)} | Tenant: ${clean(request.tenant)} | Status: ${clean(request.status.replaceAll("_", " "))}`,
      `Reviewer Comment: ${clean(request.reviewerComment)}`,
    ],
    headerTitle
  );

  return doc.output("blob");
};