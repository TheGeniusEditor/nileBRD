"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./approved.module.css";
import { StakeholderRequest, buildPHLTemplateBRD, getRequests } from "@/lib/workflow";

export default function ApprovedBRDsPage() {
  const [requests, setRequests] = useState<StakeholderRequest[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    const all = getRequests();
    const approved = all.filter((item) => item.status === "approved" && item.brdMaster);
    setRequests(approved);
    if (approved.length > 0) {
      setSelectedId(approved[0].id);
    }
  }, []);

  const selected = useMemo(() => requests.find((item) => item.id === selectedId), [requests, selectedId]);

  const templateDoc = useMemo(() => {
    if (!selected || !selected.brdMaster) {
      return "";
    }

    return buildPHLTemplateBRD(selected, selected.brdMaster);
  }, [selected]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <Link href="/role/sme" className={styles.backLink}>
            ← Back to Stakeholder Portal
          </Link>
          <h1>Approved BRDs</h1>
          <p>All BRDs approved by stakeholders.</p>
        </div>
      </header>

      <div className={styles.layout}>
        <aside className={styles.listCard}>
          <h2>Approved List ({requests.length})</h2>
          {requests.length === 0 ? (
            <p className={styles.empty}>No approved BRDs found.</p>
          ) : (
            <div className={styles.list}>
              {requests.map((item) => (
                <button
                  key={item.id}
                  className={`${styles.listItem} ${selectedId === item.id ? styles.active : ""}`}
                  onClick={() => setSelectedId(item.id)}
                >
                  <strong>{item.reqTitle}</strong>
                  <span>{item.owner || "SME Team"}</span>
                </button>
              ))}
            </div>
          )}
        </aside>

        <section className={styles.previewCard}>
          {!selected || !selected.brdMaster ? (
            <p className={styles.empty}>Select an approved BRD to view template output.</p>
          ) : (
            <>
              <h2>{selected.reqTitle}</h2>
              <p className={styles.meta}>Status: Approved • Sent: {selected.sentAt || "N/A"}</p>
              <pre className={styles.pre}>{templateDoc}</pre>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
