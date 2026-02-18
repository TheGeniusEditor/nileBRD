"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { StakeholderRequest, getRequests } from "@/lib/workflow";

export default function SmeWorkspace() {
  const [requests, setRequests] = useState<StakeholderRequest[]>([]);

  useEffect(() => {
    setRequests(getRequests());
  }, []);

  const sentForReview = useMemo(
    () => requests.filter((item) => item.status === "sent" || item.status === "approved" || item.status === "changes_requested"),
    [requests]
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <Link href="/role" className={styles.backLink}>
            ← Back to Roles
          </Link>
          <h1 className={styles.title}>Stakeholder Portal</h1>
          <p className={styles.subtitle}>Choose an action to continue.</p>
        </div>
        <Link href="/" className={styles.ctaLink}>
          Logout
        </Link>
      </header>

      <section className={styles.statsGrid}>
        <article className={styles.statCard}>
          <h3>Total Requests</h3>
          <p>{requests.length}</p>
          <span>Submitted by stakeholders</span>
        </article>
        <article className={styles.statCard}>
          <h3>Sent by BA</h3>
          <p>{requests.filter((item) => item.status === "sent").length}</p>
          <span>Ready for review</span>
        </article>
        <article className={styles.statCard}>
          <h3>Approved</h3>
          <p>{requests.filter((item) => item.status === "approved").length}</p>
          <span>Moved to IT flow</span>
        </article>
        <article className={styles.statCard}>
          <h3>Changes Requested</h3>
          <p>{requests.filter((item) => item.status === "changes_requested").length}</p>
          <span>Awaiting BA updates</span>
        </article>
      </section>

      <div className={styles.actionGrid}>
        <Link href="/role/sme/request" className={styles.actionCard}>
          <div className={styles.actionIcon}>📝</div>
          <div className={styles.actionContent}>
            <h2>Create Request</h2>
            <p>Open request input page and submit business requirement to BA.</p>
            <div className={styles.actionMeta}>
              <strong>Start new intake</strong>
              <span>Open Request Input →</span>
            </div>
          </div>
        </Link>

        <Link href="/role/sme/review" className={styles.actionCard}>
          <div className={styles.actionIcon}>✅</div>
          <div className={styles.actionContent}>
            <h2>BRD Sent by BA</h2>
            <p>Open BA-submitted BRD and choose Approve or Make Changes.</p>
            <div className={styles.actionMeta}>
              <strong>{sentForReview.length} item(s) in queue</strong>
              <span>Open BRD Review →</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
