"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./requests.module.css";
import {
  StakeholderRequest,
  getRequests,
} from "@/lib/workflow";

const statusColor = (status: StakeholderRequest["status"]) => {
  switch (status) {
    case "new":
      return { bg: "#fee2e2", text: "#991b1b" };
    case "in_progress":
      return { bg: "#fef3c7", text: "#92400e" };
    case "generated":
      return { bg: "#dbeafe", text: "#1d4ed8" };
    case "sent":
      return { bg: "#ccfbf1", text: "#0f766e" };
    case "approved":
      return { bg: "#dcfce7", text: "#166534" };
    case "changes_requested":
      return { bg: "#fce7f3", text: "#9d174d" };
    default:
      return { bg: "#f3f4f6", text: "#374151" };
  }
};

export default function RequestsPage() {
  const [requests, setRequests] = useState<StakeholderRequest[]>([]);

  useEffect(() => {
    const all = getRequests();
    const stakeholderRequests = all.filter((item) => item.createdBy !== "ba");
    setRequests(stakeholderRequests);
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/ba-portal" className={styles.backLink}>
          ← Back to Dashboard
        </Link>
        <div>
          <h1 className={styles.title}>Stakeholder Requests for BRD</h1>
          <p className={styles.subtitle}>Open a stakeholder request, continue discussion, complete BRD Master, then send for review.</p>
        </div>
      </header>

      <section className={styles.requestsPanel}>
        <div className={styles.panelHeader}>
          <h2>Requests ({requests.length})</h2>
        </div>
        <div className={styles.requestsList}>
          {requests.length === 0 ? (
            <div className={styles.empty}>
              <p>No stakeholder requests yet.</p>
              <Link href="/role/sme" className={styles.emptyBtn}>
                Go to Stakeholder Portal
              </Link>
            </div>
          ) : (
            requests.map((request) => {
              const colors = statusColor(request.status);
              return (
                <Link key={request.id} href={`/ba-portal/requests/${request.id}`} className={styles.requestCardLink}>
                  <article className={styles.requestCard}>
                    <div className={styles.requestHeader}>
                      <div className={styles.requestTitle}>
                        <h3>{request.reqTitle}</h3>
                        <div className={styles.requestMeta}>
                          <span className={styles.typeBadge}>{request.reqType}</span>
                          <span className={styles.priorityBadge}>{request.priority}</span>
                          <span className={styles.statusBadge} style={{ backgroundColor: colors.bg, color: colors.text }}>
                            {request.status.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.requestBody}>
                      <p className={styles.requestBrief}>{request.brief}</p>
                      <div className={styles.requestInfo}>
                        <span>👤 {request.owner || "Unassigned"}</span>
                        <span>🏢 {request.tenant}</span>
                        <span>💬 {(request.threads || []).length} messages</span>
                      </div>
                    </div>
                    <div className={styles.requestFooter}>
                      <span className={styles.createdDate}>Created: {request.createdAt}</span>
                      <span className={styles.requestAction}>Open request →</span>
                    </div>
                  </article>
                </Link>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
