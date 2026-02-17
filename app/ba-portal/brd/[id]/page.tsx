"use client";

import Link from "next/link";
import styles from "../../styles.module.css";
import detailStyles from "./details.module.css";

export default function BRDDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  // Mock BRD data - in real app would fetch from DB
  const mockBRD = {
    id: params.id,
    name: "Renewal Automation - Phase 1",
    status: "sent",
    createdAt: "2024-02-10",
    lastModified: "2024-02-15",
    problem: "Current renewal workflow is completely manual, taking 15-20 days per renewal application with high error rates.",
    objectives: "Reduce TAT to 5 days, standardize rules, improve auditability, reduce errors by 95%",
    scopeIn: "Online renewal request, eligibility computation, automatic approvals, audit trail",
    scopeOut: "New origination, restructuring, cross-sell, principal reduction",
    requirements: `- Fetch customer profile from core system
- Compute eligibility based on predefined rules
- Route cases for approval (auto or manual)
- Generate renewal letter
- Log all transactions for audit`,
    successCriteria: "- 50% reduction in TAT\n- 99% uptime\n- 95% error reduction\n- 100% compliance",
    timeline: "- Requirements: 2 weeks\n- Development: 4 weeks\n- Testing: 2 weeks\n- Go-live: 1 week",
  };

  return (
    <div className={styles.container}>
      <header className={detailStyles.backHeader}>
        <Link href="/ba-portal" className={detailStyles.backLink}>
          ← Back to Dashboard
        </Link>
        <h1>{mockBRD.name}</h1>
        <span className={detailStyles.status}>{mockBRD.status}</span>
      </header>

      <div className={detailStyles.mainContent}>
        <div className={detailStyles.document}>
          <section className={detailStyles.section}>
            <h2>Problem Statement</h2>
            <p>{mockBRD.problem}</p>
          </section>

          <section className={detailStyles.section}>
            <h2>Objectives</h2>
            <p>{mockBRD.objectives}</p>
          </section>

          <section className={detailStyles.section}>
            <h2>Scope - In Scope</h2>
            <p>{mockBRD.scopeIn}</p>
          </section>

          <section className={detailStyles.section}>
            <h2>Scope - Out of Scope</h2>
            <p>{mockBRD.scopeOut}</p>
          </section>

          <section className={detailStyles.section}>
            <h2>Requirements</h2>
            <pre className={detailStyles.pre}>{mockBRD.requirements}</pre>
          </section>

          <section className={detailStyles.section}>
            <h2>Success Criteria</h2>
            <pre className={detailStyles.pre}>{mockBRD.successCriteria}</pre>
          </section>

          <section className={detailStyles.section}>
            <h2>Timeline</h2>
            <pre className={detailStyles.pre}>{mockBRD.timeline}</pre>
          </section>

          <section className={detailStyles.metadata}>
            <div className={detailStyles.metaItem}>
              <span className={detailStyles.label}>Created:</span>
              <span className={detailStyles.value}>{mockBRD.createdAt}</span>
            </div>
            <div className={detailStyles.metaItem}>
              <span className={detailStyles.label}>Last Modified:</span>
              <span className={detailStyles.value}>{mockBRD.lastModified}</span>
            </div>
          </section>
        </div>

        <div className={detailStyles.sidebar}>
          <div className={detailStyles.card}>
            <h3>Actions</h3>
            <div className={detailStyles.actions}>
              <Link href="/ba-portal/send" className={detailStyles.btn}>
                📤 Send
              </Link>
              <Link href="/ba-portal/generate" className={detailStyles.btn}>
                ✏️ Edit
              </Link>
              <Link href="/ba-portal" className={detailStyles.secondaryBtn}>
                ← Back
              </Link>
            </div>
          </div>

          <div className={detailStyles.card}>
            <h3>Document Info</h3>
            <div className={detailStyles.info}>
              <div className={detailStyles.infoItem}>
                <span>Version</span>
                <strong>1.0</strong>
              </div>
              <div className={detailStyles.infoItem}>
                <span>Status</span>
                <strong>{mockBRD.status}</strong>
              </div>
              <div className={detailStyles.infoItem}>
                <span>Created</span>
                <strong>{mockBRD.createdAt}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
