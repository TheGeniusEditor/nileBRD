"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import {
  StakeholderRequest,
  getRequests,
  loadFeasibilityMap,
  loadITWorkflowMap,
} from "@/lib/workflow";

export default function ItWorkspace() {
  const [requests, setRequests] = useState<StakeholderRequest[]>([]);

  const feasibilityMap = useMemo(() => loadFeasibilityMap(), [requests]);
  const workflowMap = useMemo(() => loadITWorkflowMap(), [requests]);

  useEffect(() => {
    const allRequests = getRequests();
    const approvedRequests = allRequests.filter((item) => item.status === "approved");
    setRequests(approvedRequests);
  }, []);

  const approvedCount = useMemo(() => requests.length, [requests.length]);

  const statusCounts = useMemo(() => {
    const counts = {
      pending: 0,
      feasible: 0,
      needs_info: 0,
      not_feasible: 0,
    } as Record<"pending" | "feasible" | "needs_info" | "not_feasible", number>;

    requests.forEach((request) => {
      const entry = feasibilityMap[request.id];
      if (!entry) {
        counts.pending += 1;
        return;
      }

      counts[entry.status] += 1;
    });

    return counts;
  }, [feasibilityMap, requests]);

  const financialHeadQueue = useMemo(() => {
    return requests.filter((request) => {
      const feasibility = feasibilityMap[request.id];
      const workflow = workflowMap[request.id];
      if (!workflow) {
        return false;
      }
      return feasibility?.status === "feasible" && workflow.stages.final_cost_approval === "in_progress";
    });
  }, [requests, feasibilityMap, workflowMap]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <Link href="/role" className={styles.backLink}>
            ← Back to Roles
          </Link>
          <h1 className={styles.title}>IT Portal</h1>
          <p className={styles.subtitle}>
            Review approved BRDs and confirm feasibility after internal IT review.
          </p>
        </div>
        <Link href="/" className={styles.ctaLink}>
          Logout
        </Link>
      </header>

      <section className={styles.statsGrid}>
        <article className={styles.statCard}>
          <h3>Approved BRDs</h3>
          <p>{approvedCount}</p>
        </article>
        <article className={styles.statCard}>
          <h3>Feasible</h3>
          <p>{statusCounts.feasible}</p>
        </article>
        <article className={styles.statCard}>
          <h3>Needs Info</h3>
          <p>{statusCounts.needs_info}</p>
        </article>
        <article className={styles.statCard}>
          <h3>Not Feasible</h3>
          <p>{statusCounts.not_feasible}</p>
        </article>
        <article className={styles.statCard}>
          <h3>Financial Head Pending</h3>
          <p>{financialHeadQueue.length}</p>
        </article>
      </section>

      <section className={styles.listCard}>
        <div className={styles.listHead}>
          <h2>Approved BRD Queue</h2>
          <span>{approvedCount} item(s)</span>
        </div>

        {requests.length === 0 ? (
          <p className={styles.muted}>No stakeholder-approved BRDs available for IT review yet.</p>
        ) : (
          <div className={styles.queueList}>
            {requests.map((request) => (
              <Link key={request.id} href={`/role/it/${request.id}`} className={styles.queueLink}>
                <div>
                  <strong>{request.reqTitle}</strong>
                  <p>{request.reqType} • {request.priority} • {request.tenant}</p>
                </div>
                <span>Open Review →</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className={styles.listCard}>
        <div className={styles.listHead}>
          <h2>Financial Head Approval Queue</h2>
          <span>{financialHeadQueue.length} item(s)</span>
        </div>

        {financialHeadQueue.length === 0 ? (
          <p className={styles.muted}>No BRDs have reached Financial Head approval stage yet.</p>
        ) : (
          <div className={styles.queueList}>
            {financialHeadQueue.map((request) => (
              <Link key={request.id} href={`/role/it/${request.id}?mode=financial`} className={styles.queueLink}>
                <div>
                  <strong>{request.reqTitle}</strong>
                  <p>{request.reqType} • {request.priority} • {request.tenant}</p>
                </div>
                <span>Open Financial Approval →</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
