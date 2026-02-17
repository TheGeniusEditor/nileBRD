"use client";

import { useState } from "react";
import styles from "../page.module.css";

const sampleNotes = `Problem: Renewal workflow is manual and slow.
Objectives: Reduce TAT, standardize rules, improve auditability.
Scope In: Online renewal request, eligibility computation, approvals.
Scope Out: New origination, restructuring, cross-sell.
Risks: Rule bypass, data quality, fraud risk.
Data: Customer profile, bureau, bank statement summary.`;

type BrdDraft = {
  problem: string;
  objectives: string;
  scopeIn: string;
  scopeOut: string;
  requirements: string;
  risks: string;
  data: string;
};

function parseDeterministic(text: string): BrdDraft {
  const lines = text.split(/\r?\n/).map((line) => line.trim());
  const find = (prefix: string) =>
    lines.find((line) => line.toLowerCase().startsWith(prefix)) || "";
  const clean = (value: string) => value.replace(/^[^:]+:\s*/i, "");

  return {
    problem: clean(find("problem")) || "-",
    objectives: clean(find("objectives")) || "-",
    scopeIn: clean(find("scope in")) || "-",
    scopeOut: clean(find("scope out")) || "-",
    requirements:
      "- Fetch customer profile\n- Compute eligibility\n- Route approvals",
    risks: clean(find("risks")) || "-",
    data: clean(find("data")) || "-",
  };
}

function buildAiDraft(text: string): BrdDraft {
  const base = parseDeterministic(text);
  return {
    ...base,
    objectives:
      base.objectives && base.objectives !== "-"
        ? `${base.objectives} (AI expanded with KPIs)`
        : "Reduce TAT, improve compliance, strengthen auditability",
    requirements:
      "- Auto-approve eligible cases with audit trail\n- Maker-checker for exceptions\n- Generate renewal letter",
    risks:
      base.risks && base.risks !== "-"
        ? `${base.risks} (AI suggestions appended)`
        : "Rule bypass, data quality, fraud risk",
  };
}

export default function BrdGeneratorPage() {
  const [notes, setNotes] = useState(sampleNotes);
  const [deterministic, setDeterministic] = useState<BrdDraft | null>(null);
  const [aiDraft, setAiDraft] = useState<BrdDraft | null>(null);

  const handleDeterministic = () => {
    setDeterministic(parseDeterministic(notes));
  };

  const handleAi = () => {
    setAiDraft(buildAiDraft(notes));
  };

  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <h2>BRD generation</h2>
        <p className={styles.subtitle}>
          Compare deterministic extraction versus AI-style draft output. This is
          a frontend-only simulation.
        </p>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={8}
          className={styles.textarea}
        />
        <div className={styles.actionsRow}>
          <button className={styles.primary} onClick={handleDeterministic}>
            Generate deterministic draft
          </button>
          <button className={styles.secondary} onClick={handleAi}>
            Generate AI draft
          </button>
        </div>
      </section>

      <section className={styles.grid}>
        <div className={styles.card}>
          <h2>Deterministic output</h2>
          <p className={styles.mutedText}>Rules-based extraction.</p>
          {deterministic ? (
            <pre className={styles.output}>
{`Problem: ${deterministic.problem}
Objectives: ${deterministic.objectives}
Scope In: ${deterministic.scopeIn}
Scope Out: ${deterministic.scopeOut}
Requirements:\n${deterministic.requirements}
Risks: ${deterministic.risks}
Data: ${deterministic.data}`}
            </pre>
          ) : (
            <p className={styles.empty}>Run deterministic generation to view.</p>
          )}
        </div>

        <div className={styles.card}>
          <h2>AI output</h2>
          <p className={styles.mutedText}>Simulated AI draft enrichment.</p>
          {aiDraft ? (
            <pre className={styles.output}>
{`Problem: ${aiDraft.problem}
Objectives: ${aiDraft.objectives}
Scope In: ${aiDraft.scopeIn}
Scope Out: ${aiDraft.scopeOut}
Requirements:\n${aiDraft.requirements}
Risks: ${aiDraft.risks}
Data: ${aiDraft.data}`}
            </pre>
          ) : (
            <p className={styles.empty}>Run AI generation to view.</p>
          )}
        </div>
      </section>
    </div>
  );
}
