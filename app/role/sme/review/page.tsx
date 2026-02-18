"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./review.module.css";
import { StakeholderRequest, getRequests } from "@/lib/workflow";

export default function StakeholderReviewPage() {
  const [requests, setRequests] = useState<StakeholderRequest[]>([]);

  useEffect(() => {
    const all = getRequests();
    const reviewItems = all.filter((item) => item.status === "sent" || item.status === "approved" || item.status === "changes_requested");
    setRequests(reviewItems);
  }, []);

  const queuedCount = useMemo(() => requests.length, [requests.length]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <Link href="/role/sme" className={styles.backLink}>
            ← Back to Stakeholder Portal
          </Link>
          <h1>BRD Sent by BA</h1>
          <p>Select a request to open BRD + chatbox approval page.</p>
        </div>
      </header>

      <div className={styles.listCard}>
        <div className={styles.listHead}>
          <h2>Request Queue</h2>
          <span>{queuedCount} item(s)</span>
        </div>

        {requests.length === 0 ? (
          <p className={styles.muted}>No BRD sent by BA yet.</p>
        ) : (
          <div className={styles.queueList}>
            {requests.map((item) => (
              <Link key={item.id} href={`/role/sme/review/${item.id}`} className={styles.queueLink}>
                <div>
                  <strong>{item.reqTitle}</strong>
                  <p>{item.reqType} • {item.priority} • {item.tenant}</p>
                </div>
                <span>{item.status.replace("_", " ")}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
