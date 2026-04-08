/**
 * PDF Export Utility
 *
 * Opens a styled print window and triggers window.print() so the browser
 * saves a proper vector PDF (File → Save as PDF). No external libraries needed.
 */

// ─── Shared helpers ────────────────────────────────────────────────────────────
function openPrintWindow(title: string, body: string) {
  const win = window.open("", "_blank");
  if (!win) { alert("Please allow pop-ups to download PDFs."); return; }

  win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${escHtml(title)}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: "Segoe UI", Arial, sans-serif; font-size: 11pt; color: #1e293b; background: #fff; }
  .page  { max-width: 900px; margin: 0 auto; padding: 32px 40px; }
  .cover { border-bottom: 3px solid #6d28d9; padding-bottom: 20px; margin-bottom: 28px; }
  .cover h1 { font-size: 20pt; font-weight: 800; color: #1e1b4b; line-height: 1.2; }
  .cover .meta { display: flex; flex-wrap: wrap; gap: 8px 24px; margin-top: 10px; }
  .cover .meta span { font-size: 9pt; color: #64748b; }
  .cover .meta b  { color: #1e293b; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 99px; font-size: 8pt; font-weight: 700; }
  .badge-violet { background:#ede9fe; color:#5b21b6; }
  .badge-emerald{ background:#d1fae5; color:#065f46; }
  .badge-amber  { background:#fef3c7; color:#92400e; }
  .badge-blue   { background:#dbeafe; color:#1d4ed8; }
  .badge-rose   { background:#ffe4e6; color:#9f1239; }
  .badge-sky    { background:#e0f2fe; color:#0369a1; }
  section { margin-bottom: 24px; page-break-inside: avoid; }
  .sec-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1.5px solid #e2e8f0; }
  .sec-num { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 6px; background: #7c3aed; color: #fff; font-size: 9pt; font-weight: 800; flex-shrink: 0; }
  .sec-title { font-size: 12pt; font-weight: 700; color: #312e81; }
  p { line-height: 1.6; margin-bottom: 6px; }
  .label { font-size: 8pt; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #94a3b8; margin-bottom: 3px; }
  table { width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 9.5pt; }
  th { background: #f8fafc; text-align: left; padding: 5px 8px; font-size: 8.5pt; font-weight: 700; text-transform: uppercase; letter-spacing:.04em; color:#64748b; border-bottom: 1.5px solid #e2e8f0; }
  td { padding: 5px 8px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
  tr:last-child td { border-bottom: none; }
  .card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; margin-bottom: 8px; background: #fafafa; }
  .card-title { font-size: 10pt; font-weight: 700; color: #1e293b; margin-bottom: 4px; }
  .card-sub { font-size: 9pt; color: #475569; }
  ul.dot { list-style: none; padding: 0; }
  ul.dot li { padding: 2px 0 2px 14px; font-size: 9.5pt; color: #475569; position: relative; }
  ul.dot li::before { content: "•"; position: absolute; left: 0; color: #94a3b8; }
  ol.steps { padding-left: 0; list-style: none; }
  ol.steps li { display: flex; gap: 8px; padding: 4px 0; font-size: 9.5pt; }
  ol.steps .num { flex-shrink: 0; width: 18px; height: 18px; border-radius: 50%; background: #ddd6fe; color: #5b21b6; font-weight: 800; font-size: 8pt; display: flex; align-items: center; justify-content: center; }
  .tc-block { border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 12px; page-break-inside: avoid; }
  .tc-id { font-family: monospace; font-size: 9pt; font-weight: 800; color: #7c3aed; }
  .tc-name { font-size: 10.5pt; font-weight: 700; color: #1e293b; margin: 2px 0 6px; }
  .steps-table { width: 100%; border-collapse: collapse; margin-top: 6px; }
  .steps-table th { font-size: 8pt; padding: 4px 6px; background:#f8fafc; text-align:left; border-bottom:1px solid #e2e8f0; color:#64748b; font-weight:700; }
  .steps-table td { font-size: 9pt; padding: 4px 6px; border-bottom: 1px solid #f8fafc; vertical-align: top; }
  .footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 8pt; color: #94a3b8; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .no-print { display: none !important; }
    .page { padding: 16px 24px; }
    section { page-break-inside: avoid; }
    .tc-block { page-break-inside: avoid; }
  }
</style>
</head>
<body>
<div class="no-print" style="position:sticky;top:0;z-index:999;background:#fff;border-bottom:1px solid #e2e8f0;padding:10px 40px;display:flex;justify-content:space-between;align-items:center;">
  <span style="font-size:10pt;font-weight:600;color:#374151;">Preview — <em>${escHtml(title)}</em></span>
  <button onclick="window.print()" style="background:#7c3aed;color:#fff;border:none;border-radius:8px;padding:8px 20px;font-size:10pt;font-weight:700;cursor:pointer;">⬇ Download PDF</button>
</div>
<div class="page">
${body}
<div class="footer"><span>BPRM Portal — AI Generated Document</span><span>Generated ${new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"long",year:"numeric"})}</span></div>
</div>
</body>
</html>`);
  win.document.close();
}

function escHtml(str: string) {
  return String(str ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function badge(text: string, cls = "badge-violet") {
  return `<span class="badge ${cls}">${escHtml(text)}</span>`;
}

// ─── FRD PDF ───────────────────────────────────────────────────────────────────
interface FsItem { id: string; brd_ref: string; title: string; description: string; priority: string; acceptance_criteria: string[]; business_rules: string[] }
interface WorkflowItem { id: string; name: string; trigger: string; steps: string[]; expected_outcome: string }
interface EntityItem { name: string; attributes: string[]; constraints: string[] }
interface ScreenItem { name: string; description: string; components: string[] }
interface IntItem { id: string; system: string; type: string; description: string }
interface NfrItem { id: string; category: string; requirement: string; metric: string }
interface TraceItem { brd_ref: string; frd_ref: string; description: string }

interface FrdDoc {
  meta: { doc_id: string; brd_doc_id: string; title: string; version: string; status: string; category: string; priority: string; effective_date: string; generated_at: string; request_number: string; ai_note: string };
  sections: {
    overview: { title: string; purpose: string; scope: string; audience: string };
    functional_specifications: { title: string; items: FsItem[] };
    system_behavior: { title: string; workflows: WorkflowItem[] };
    data_requirements: { title: string; entities: EntityItem[] };
    ui_requirements: { title: string; screens: ScreenItem[] };
    integration_requirements: { title: string; items: IntItem[] };
    non_functional_requirements: { title: string; items: NfrItem[] };
    traceability_matrix: { title: string; mappings: TraceItem[] };
  };
}

export function downloadFRDAsPDF(doc: FrdDoc) {
  const m = doc.meta;
  const s = doc.sections;

  const priorityBadgeClass: Record<string, string> = {
    "Must Have": "badge-rose", "Should Have": "badge-amber", "Could Have": "badge-sky",
  };

  // Build each section
  const overview = `
    <section>
      <div class="sec-header"><div class="sec-num">1</div><div class="sec-title">${escHtml(s.overview.title)}</div></div>
      <div class="label">Purpose</div><p>${escHtml(s.overview.purpose)}</p>
      <div class="label">Scope</div><p>${escHtml(s.overview.scope)}</p>
      <div class="label">Audience</div><p>${escHtml(s.overview.audience)}</p>
    </section>`;

  const fsSection = `
    <section>
      <div class="sec-header"><div class="sec-num">2</div><div class="sec-title">${escHtml(s.functional_specifications.title)}</div></div>
      ${s.functional_specifications.items.map(fs => `
        <div class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
            <span style="font-family:monospace;font-size:9pt;font-weight:800;color:#7c3aed;">${escHtml(fs.id)}</span>
            <div style="display:flex;gap:6px;align-items:center;">
              <span style="font-size:8.5pt;color:#94a3b8;">← ${escHtml(fs.brd_ref)}</span>
              ${badge(fs.priority, priorityBadgeClass[fs.priority] ?? "badge-violet")}
            </div>
          </div>
          <div class="card-title">${escHtml(fs.title)}</div>
          <div class="card-sub">${escHtml(fs.description)}</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px;">
            <div>
              <div class="label" style="color:#059669;">✓ Acceptance Criteria</div>
              <ul class="dot">${fs.acceptance_criteria.slice(0, 3).map(c => `<li>${escHtml(c)}</li>`).join("")}</ul>
            </div>
            <div>
              <div class="label" style="color:#3b82f6;">⚡ Business Rules</div>
              <ul class="dot">${fs.business_rules.slice(0, 2).map(r => `<li>${escHtml(r)}</li>`).join("")}</ul>
            </div>
          </div>
        </div>`).join("")}
    </section>`;

  const behaviorSection = `
    <section>
      <div class="sec-header"><div class="sec-num">3</div><div class="sec-title">${escHtml(s.system_behavior.title)}</div></div>
      ${s.system_behavior.workflows.map(wf => `
        <div class="card">
          <div class="card-title">${escHtml(wf.id)} — ${escHtml(wf.name)}</div>
          <p style="font-size:9pt;margin-bottom:4px;"><b>Trigger:</b> ${escHtml(wf.trigger)}</p>
          <ol class="steps">${wf.steps.map((step, i) => `<li><div class="num">${i + 1}</div><span>${escHtml(step)}</span></li>`).join("")}</ol>
          <p style="font-size:9pt;color:#065f46;margin-top:6px;">✓ ${escHtml(wf.expected_outcome)}</p>
        </div>`).join("")}
    </section>`;

  const dataSection = `
    <section>
      <div class="sec-header"><div class="sec-num">4</div><div class="sec-title">${escHtml(s.data_requirements.title)}</div></div>
      <table>
        <thead><tr><th>Entity</th><th>Key Attributes</th><th>Constraints</th></tr></thead>
        <tbody>${s.data_requirements.entities.map(e => `
          <tr>
            <td><b>${escHtml(e.name)}</b></td>
            <td>${e.attributes.slice(0, 5).map(a => `<span style="background:#e0f2fe;color:#0369a1;border-radius:4px;padding:1px 5px;font-size:8.5pt;margin:1px;display:inline-block;font-family:monospace;">${escHtml(a)}</span>`).join(" ")}</td>
            <td><ul class="dot">${e.constraints.slice(0, 2).map(c => `<li>${escHtml(c)}</li>`).join("")}</ul></td>
          </tr>`).join("")}
        </tbody>
      </table>
    </section>`;

  const uiSection = `
    <section>
      <div class="sec-header"><div class="sec-num">5</div><div class="sec-title">${escHtml(s.ui_requirements.title)}</div></div>
      ${s.ui_requirements.screens.map(sc => `
        <div class="card">
          <div class="card-title">${escHtml(sc.name)}</div>
          <div class="card-sub" style="margin-bottom:4px;">${escHtml(sc.description)}</div>
          <div>${sc.components.map(c => `<span style="background:#e0e7ff;color:#3730a3;border-radius:4px;padding:2px 7px;font-size:8.5pt;margin:2px;display:inline-block;">${escHtml(c)}</span>`).join("")}</div>
        </div>`).join("")}
    </section>`;

  const intSection = `
    <section>
      <div class="sec-header"><div class="sec-num">6</div><div class="sec-title">${escHtml(s.integration_requirements.title)}</div></div>
      <table>
        <thead><tr><th>ID</th><th>System</th><th>Type</th><th>Description</th></tr></thead>
        <tbody>${s.integration_requirements.items.map(i => `
          <tr>
            <td><span style="font-family:monospace;font-weight:700;color:#7c3aed;">${escHtml(i.id)}</span></td>
            <td><b>${escHtml(i.system)}</b></td>
            <td>${badge(i.type, "badge-blue")}</td>
            <td>${escHtml(i.description)}</td>
          </tr>`).join("")}
        </tbody>
      </table>
    </section>`;

  const nfrSection = `
    <section>
      <div class="sec-header"><div class="sec-num">7</div><div class="sec-title">${escHtml(s.non_functional_requirements.title)}</div></div>
      <table>
        <thead><tr><th>ID</th><th>Category</th><th>Requirement</th><th>Metric</th></tr></thead>
        <tbody>${s.non_functional_requirements.items.map(n => `
          <tr>
            <td><span style="font-family:monospace;font-weight:700;color:#7c3aed;">${escHtml(n.id)}</span></td>
            <td><b>${escHtml(n.category)}</b></td>
            <td>${escHtml(n.requirement)}</td>
            <td><code style="font-size:8.5pt;background:#f0fdf4;color:#166534;padding:1px 4px;border-radius:3px;">${escHtml(n.metric)}</code></td>
          </tr>`).join("")}
        </tbody>
      </table>
    </section>`;

  const traceSection = `
    <section>
      <div class="sec-header"><div class="sec-num">8</div><div class="sec-title">${escHtml(s.traceability_matrix.title)}</div></div>
      <table>
        <thead><tr><th>BRD Ref</th><th>FRD Ref</th><th>Description</th></tr></thead>
        <tbody>${s.traceability_matrix.mappings.map(t => `
          <tr>
            <td><span style="font-family:monospace;font-weight:700;color:#e11d48;">${escHtml(t.brd_ref)}</span></td>
            <td><span style="font-family:monospace;font-weight:700;color:#7c3aed;">${escHtml(t.frd_ref)}</span></td>
            <td>${escHtml(t.description)}</td>
          </tr>`).join("")}
        </tbody>
      </table>
    </section>`;

  const aiNote = `<div style="border:1px solid #fcd34d;background:#fffbeb;border-radius:8px;padding:8px 12px;margin-bottom:20px;font-size:9pt;color:#92400e;">⚠ ${escHtml(m.ai_note)}</div>`;

  const cover = `
    <div class="cover">
      <h1>${escHtml(m.title)}</h1>
      <div class="meta">
        <span><b>Doc ID:</b> ${escHtml(m.doc_id)}</span>
        <span><b>BRD Ref:</b> ${escHtml(m.brd_doc_id)}</span>
        <span><b>Version:</b> ${escHtml(m.version)}</span>
        <span><b>Status:</b> ${badge(m.status, m.status === "Approved" ? "badge-emerald" : "badge-amber")}</span>
        <span><b>Priority:</b> ${escHtml(m.priority)}</span>
        <span><b>Category:</b> ${escHtml(m.category)}</span>
        <span><b>Effective Date:</b> ${escHtml(m.effective_date)}</span>
        <span><b>Request:</b> ${escHtml(m.request_number)}</span>
      </div>
    </div>`;

  openPrintWindow(
    m.title,
    cover + aiNote + overview + fsSection + behaviorSection + dataSection + uiSection + intSection + nfrSection + traceSection,
  );
}

// ─── Test Cases PDF ────────────────────────────────────────────────────────────
interface TestStep { step_num: number; action: string; expected: string }
interface TestCase {
  id: string; frd_ref: string; name: string; description: string;
  type: string; priority: string; preconditions: string[];
  steps: TestStep[]; expected_result: string; status: string;
}
interface TcSummary { system: number; integration: number; uat: number; critical: number; high: number }
interface TcMeta { doc_id: string; frd_doc_id: string; brd_doc_id: string; title: string; version: string; total_cases: number; summary: TcSummary; request_number?: string }

export function downloadTestCasesAsPDF(meta: TcMeta, testCases: TestCase[]) {
  const typeBadge: Record<string, string> = {
    System: "badge-violet", Integration: "badge-blue", UAT: "badge-emerald",
    Performance: "badge-amber", Security: "badge-rose",
  };
  const priorityBadge: Record<string, string> = {
    Critical: "badge-rose", High: "badge-amber", Medium: "badge-sky", Low: "badge-violet",
  };

  const cover = `
    <div class="cover">
      <h1>${escHtml(meta.title)}</h1>
      <div class="meta">
        <span><b>Doc ID:</b> ${escHtml(meta.doc_id)}</span>
        <span><b>FRD Ref:</b> ${escHtml(meta.frd_doc_id)}</span>
        <span><b>BRD Ref:</b> ${escHtml(meta.brd_doc_id)}</span>
        <span><b>Version:</b> ${escHtml(meta.version ?? "1.0")}</span>
        <span><b>Total Cases:</b> ${meta.total_cases}</span>
        ${meta.request_number ? `<span><b>Request:</b> ${escHtml(meta.request_number)}</span>` : ""}
      </div>
    </div>`;

  const summary = `
    <section>
      <div class="sec-header"><div class="sec-num">S</div><div class="sec-title">Test Suite Summary</div></div>
      <table>
        <thead><tr><th>Type</th><th>Count</th><th>Priority Breakdown</th></tr></thead>
        <tbody>
          <tr><td>System</td><td>${meta.summary.system ?? 0}</td><td rowspan="3">${badge("Critical", "badge-rose")} ${meta.summary.critical ?? 0} &nbsp; ${badge("High", "badge-amber")} ${meta.summary.high ?? 0}</td></tr>
          <tr><td>Integration</td><td>${meta.summary.integration ?? 0}</td></tr>
          <tr><td>UAT</td><td>${meta.summary.uat ?? 0}</td></tr>
          <tr><td><b>Total</b></td><td><b>${meta.total_cases}</b></td><td></td></tr>
        </tbody>
      </table>
    </section>`;

  const cases = testCases.map(tc => `
    <div class="tc-block">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
        <div>
          <div class="tc-id">${escHtml(tc.id)} <span style="font-family:monospace;font-size:8pt;color:#94a3b8;">← ${escHtml(tc.frd_ref)}</span></div>
          <div class="tc-name">${escHtml(tc.name)}</div>
        </div>
        <div style="display:flex;gap:4px;">
          ${badge(tc.type, typeBadge[tc.type] ?? "badge-violet")}
          ${badge(tc.priority, priorityBadge[tc.priority] ?? "badge-amber")}
        </div>
      </div>
      <p style="font-size:9.5pt;color:#475569;margin-bottom:8px;">${escHtml(tc.description)}</p>
      ${tc.preconditions?.length ? `
        <div class="label" style="margin-bottom:3px;">Preconditions</div>
        <ul class="dot" style="margin-bottom:8px;">${tc.preconditions.map(p => `<li>${escHtml(p)}</li>`).join("")}</ul>` : ""}
      <table class="steps-table">
        <thead><tr><th style="width:32px;">#</th><th>Action</th><th>Expected Result</th></tr></thead>
        <tbody>${tc.steps.map(step => `
          <tr>
            <td style="text-align:center;font-weight:700;color:#7c3aed;">${step.step_num}</td>
            <td>${escHtml(step.action)}</td>
            <td style="color:#065f46;">${escHtml(step.expected)}</td>
          </tr>`).join("")}
        </tbody>
      </table>
      <div style="margin-top:8px;padding:6px 10px;background:#f0fdf4;border-radius:6px;font-size:9pt;color:#166534;">
        <b>Expected Result:</b> ${escHtml(tc.expected_result)}
      </div>
    </div>`).join("");

  openPrintWindow(
    meta.title,
    cover + summary + `<section><div class="sec-header"><div class="sec-num">T</div><div class="sec-title">Test Cases (${testCases.length})</div></div>${cases}</section>`,
  );
}
