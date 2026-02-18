"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./review.module.css";
import { StakeholderRequest, buildPHLTemplateBRD, getRequests, saveRequests } from "@/lib/workflow";

export default function StakeholderReviewPage() {
  const [requests, setRequests] = useState<StakeholderRequest[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    const all = getRequests();
    const reviewItems = all.filter((item) => item.status === "sent" || item.status === "approved" || item.status === "changes_requested");
    setRequests(reviewItems);
    if (reviewItems.length > 0) {
      setSelectedId(reviewItems[0].id);
    }
  }, []);

  const selected = useMemo(() => requests.find((item) => item.id === selectedId), [requests, selectedId]);

  const templateDoc = useMemo(() => {
    if (!selected || !selected.brdMaster) {
      return "";
    }

    return buildPHLTemplateBRD(selected, selected.brdMaster);
  }, [selected]);

  const submitDecision = (status: "approved" | "changes_requested") => {
    if (!selected) {
      return;
    }

    const all = getRequests();
    const next = all.map((item) => {
      if (item.id !== selected.id) {
        return item;
      }

      return {
        ...item,
        status,
        reviewerComment: reviewComment,
      };
    });

    saveRequests(next);

    const updatedReviewItems = next.filter((item) => item.status === "sent" || item.status === "approved" || item.status === "changes_requested");
    setRequests(updatedReviewItems);
    setReviewComment("");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <Link href="/role/sme" className={styles.backLink}>
            ← Back to Stakeholder Portal
          </Link>
          <h1>BRD Review</h1>
          <p>Review BRDs sent by BA and choose Approve or Make Changes.</p>
        </div>
      </header>

      <div className={styles.layout}>
        <aside className={styles.queueCard}>
          <h2>BRD Queue</h2>
          {requests.length === 0 && <p className={styles.muted}>No BRD sent by BA yet.</p>}
          <div className={styles.queueList}>
            {requests.map((item) => (
              <button
                key={item.id}
                className={`${styles.queueItem} ${selectedId === item.id ? styles.activeQueue : ""}`}
                onClick={() => setSelectedId(item.id)}
              >
                <strong>{item.reqTitle}</strong>
                <span>{item.status.replace("_", " ")}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className={styles.reviewCard}>
          {!selected || !selected.brdMaster ? (
            <p className={styles.muted}>Select a BRD from queue to review.</p>
          ) : (
            <>
              <h2>{selected.reqTitle}</h2>
              <p className={styles.muted}>Current Status: {selected.status.replace("_", " ")}</p>
              <pre className={styles.pre}>{templateDoc}</pre>

              <label className={styles.reviewLabel}>
                Reviewer Comment
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(event) => setReviewComment(event.target.value)}
                  placeholder="Enter approval note or required changes"
                />
              </label>

              <div className={styles.actions}>
                <button className={styles.approveBtn} onClick={() => submitDecision("approved")}>Approve</button>
                <button className={styles.changeBtn} onClick={() => submitDecision("changes_requested")}>Make Changes</button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
