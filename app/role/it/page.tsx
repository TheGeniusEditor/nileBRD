"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { StakeholderRequest, getRequests } from "@/lib/workflow";

type FeasibilityStatus = "pending" | "feasible" | "needs_info" | "not_feasible";

type FeasibilityState = {
  requestId: string;
  status: FeasibilityStatus;
  notes: string;
  updatedAt?: string;
};

const IT_FEASIBILITY_KEY = "itFeasibilityState";

const loadFeasibilityMap = (): Record<string, FeasibilityState> => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const stored = window.localStorage.getItem(IT_FEASIBILITY_KEY);
    if (!stored) {
      return {};
    }
    return JSON.parse(stored) as Record<string, FeasibilityState>;
  } catch {
    return {};
  }
};

export default function ItWorkspace() {
  const [requests, setRequests] = useState<StakeholderRequest[]>([]);
  const [feasibilityMap, setFeasibilityMap] = useState<Record<string, FeasibilityState>>({});

  useEffect(() => {
    const allRequests = getRequests();
    const approvedRequests = allRequests.filter((item) => item.status === "approved");
    setRequests(approvedRequests);
    setFeasibilityMap(loadFeasibilityMap());
  }, []);

  const approvedCount = useMemo(() => requests.length, [requests.length]);
  const statusCounts = useMemo(() => {
    const counts = {
      pending: 0,
      feasible: 0,
      needs_info: 0,
      not_feasible: 0,
    } as Record<FeasibilityStatus, number>;

    Object.values(feasibilityMap).forEach((item) => {
      counts[item.status] += 1;
    });

    return counts;
  }, [feasibilityMap]);

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
    </div>
  );
}
