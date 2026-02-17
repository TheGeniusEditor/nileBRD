"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import {
  ConversationThread,
  StakeholderRequest,
  createId,
  createStakeholderRequest,
  defaultBRDMasterFromRequest,
  getRequests,
  saveRequests,
} from "@/lib/workflow";

type ThreadDraft = Omit<ConversationThread, "id">;

const defaultThread: ThreadDraft = {
  title: "",
  date: "",
  time: "",
  participants: "",
  transcript: "",
  notes: "",
};

export default function SmeWorkspace() {
  const [requests, setRequests] = useState<StakeholderRequest[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [reviewComment, setReviewComment] = useState("");

  const [formData, setFormData] = useState({
    reqType: "BRD",
    reqTitle: "",
    owner: "SME Team",
    tenant: "BANK",
    priority: "P2",
    brief: "",
  });
  const [threads, setThreads] = useState<ConversationThread[]>([]);
  const [threadDraft, setThreadDraft] = useState<ThreadDraft>(defaultThread);

  useEffect(() => {
    const all = getRequests();
    setRequests(all);
    if (all.length > 0) {
      setSelectedId(all[0].id);
    }
  }, []);

  const selected = useMemo(
    () => requests.find((item) => item.id === selectedId),
    [requests, selectedId]
  );

  const sentForReview = useMemo(
    () => requests.filter((item) => item.status === "sent" || item.status === "approved" || item.status === "changes_requested"),
    [requests]
  );

  const updateRequests = (next: StakeholderRequest[]) => {
    setRequests(next);
    saveRequests(next);
  };

  const addThread = () => {
    if (!threadDraft.title || !threadDraft.date) {
      window.alert("Please add thread title and date");
      return;
    }

    const next: ConversationThread = {
      id: createId(),
      ...threadDraft,
    };

    setThreads((prev) => [...prev, next]);
    setThreadDraft(defaultThread);
  };

  const submitRequest = () => {
    if (!formData.reqTitle || !formData.brief) {
      window.alert("Please fill request title and brief");
      return;
    }

    const payload = createStakeholderRequest({
      ...formData,
      threads,
    });

    const next = [payload, ...requests];
    updateRequests(next);
    setSelectedId(payload.id);

    setFormData({
      reqType: "BRD",
      reqTitle: "",
      owner: "SME Team",
      tenant: "BANK",
      priority: "P2",
      brief: "",
    });
    setThreads([]);
    setThreadDraft(defaultThread);
  };

  const submitReviewDecision = (status: "approved" | "changes_requested") => {
    if (!selected) {
      return;
    }

    const next = requests.map((item) => {
      if (item.id !== selected.id) {
        return item;
      }

      const reviewThread: ConversationThread = {
        id: createId(),
        title: status === "approved" ? "Stakeholder approval" : "Stakeholder requested changes",
        date: new Date().toISOString().slice(0, 10),
        participants: "Stakeholder, BA",
        notes: reviewComment || (status === "approved" ? "Approved." : "Changes requested."),
      };

      return {
        ...item,
        status,
        reviewerComment: reviewComment,
        threads: [...(item.threads || []), reviewThread],
      };
    });

    updateRequests(next);
    setReviewComment("");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <Link href="/role" className={styles.backLink}>
            ← Back to Roles
          </Link>
          <h1 className={styles.title}>Stakeholder Portal</h1>
          <p className={styles.subtitle}>Create request details and review BRDs sent by BA for approval.</p>
        </div>
        <Link href="/" className={styles.ctaLink}>
          Logout
        </Link>
      </header>

      <section className={styles.statsGrid}>
        <article className={styles.statCard}>
          <h3>Total Requests</h3>
          <p>{requests.length}</p>
        </article>
        <article className={styles.statCard}>
          <h3>Sent for Review</h3>
          <p>{requests.filter((item) => item.status === "sent").length}</p>
        </article>
        <article className={styles.statCard}>
          <h3>Approved</h3>
          <p>{requests.filter((item) => item.status === "approved").length}</p>
        </article>
        <article className={styles.statCard}>
          <h3>Changes Requested</h3>
          <p>{requests.filter((item) => item.status === "changes_requested").length}</p>
        </article>
      </section>

      <div className={styles.layout}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Request Details (Stakeholder Intake)</h2>
            <span className={styles.badge}>{threads.length} threads</span>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.formGrid}>
              <label>
                Request Type
                <select
                  value={formData.reqType}
                  onChange={(event) => setFormData((prev) => ({ ...prev, reqType: event.target.value }))}
                >
                  <option value="BRD">BRD</option>
                  <option value="CR">Change Request</option>
                </select>
              </label>
              <label>
                Priority
                <select
                  value={formData.priority}
                  onChange={(event) => setFormData((prev) => ({ ...prev, priority: event.target.value }))}
                >
                  <option value="P0">P0</option>
                  <option value="P1">P1</option>
                  <option value="P2">P2</option>
                  <option value="P3">P3</option>
                </select>
              </label>
              <label className={styles.full}>
                Request Title
                <input
                  value={formData.reqTitle}
                  onChange={(event) => setFormData((prev) => ({ ...prev, reqTitle: event.target.value }))}
                  placeholder="Digital MSME Renewal Journey"
                />
              </label>
              <label>
                Owner
                <input
                  value={formData.owner}
                  onChange={(event) => setFormData((prev) => ({ ...prev, owner: event.target.value }))}
                  placeholder="Business Head"
                />
              </label>
              <label>
                Tenant
                <select
                  value={formData.tenant}
                  onChange={(event) => setFormData((prev) => ({ ...prev, tenant: event.target.value }))}
                >
                  <option value="BANK">BANK</option>
                  <option value="NBFC">NBFC</option>
                  <option value="BOTH">BOTH</option>
                </select>
              </label>
              <label className={styles.full}>
                Initial Brief
                <textarea
                  rows={4}
                  value={formData.brief}
                  onChange={(event) => setFormData((prev) => ({ ...prev, brief: event.target.value }))}
                  placeholder="Initial business ask to BA"
                />
              </label>
            </div>

            <div className={styles.subCard}>
              <h3>Add Conversation Thread</h3>
              <div className={styles.formGrid}>
                <label className={styles.full}>
                  Thread title
                  <input
                    value={threadDraft.title}
                    onChange={(event) => setThreadDraft((prev) => ({ ...prev, title: event.target.value }))}
                  />
                </label>
                <label>
                  Date
                  <input
                    type="date"
                    value={threadDraft.date}
                    onChange={(event) => setThreadDraft((prev) => ({ ...prev, date: event.target.value }))}
                  />
                </label>
                <label>
                  Time
                  <input
                    type="time"
                    value={threadDraft.time}
                    onChange={(event) => setThreadDraft((prev) => ({ ...prev, time: event.target.value }))}
                  />
                </label>
                <label className={styles.full}>
                  Participants
                  <input
                    value={threadDraft.participants}
                    onChange={(event) => setThreadDraft((prev) => ({ ...prev, participants: event.target.value }))}
                    placeholder="SME, BA, Risk"
                  />
                </label>
                <label className={styles.full}>
                  Notes
                  <textarea
                    rows={3}
                    value={threadDraft.notes}
                    onChange={(event) => setThreadDraft((prev) => ({ ...prev, notes: event.target.value }))}
                  />
                </label>
              </div>
              <button className={styles.secondaryBtn} onClick={addThread}>
                + Add Thread
              </button>
              {threads.length > 0 && (
                <ul className={styles.threadList}>
                  {threads.map((thread) => (
                    <li key={thread.id}>
                      <strong>{thread.title}</strong> • {thread.date}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button className={styles.primaryBtn} onClick={submitRequest}>
              Save Request for BA
            </button>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>BRD Review Dashboard</h2>
            <span className={styles.badge}>{sentForReview.length} items</span>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.reviewLayout}>
              <div className={styles.queueList}>
                {sentForReview.length === 0 && <p className={styles.muted}>No BRD sent by BA yet.</p>}
                {sentForReview.map((item) => (
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

              <div className={styles.reviewPanel}>
                {!selected || !selected.brdMaster ? (
                  <p className={styles.muted}>Select a sent BRD to review details.</p>
                ) : (
                  <>
                    <h3>{selected.brdMaster.title || selected.reqTitle}</h3>
                    <p className={styles.muted}>Status: {selected.status.replace("_", " ")}</p>
                    <div className={styles.summaryGrid}>
                      <div>
                        <h4>Objective</h4>
                        <p>{selected.brdMaster.objective || "—"}</p>
                      </div>
                      <div>
                        <h4>Scope In</h4>
                        <pre>{selected.brdMaster.scopeIn || "—"}</pre>
                      </div>
                      <div>
                        <h4>Scope Out</h4>
                        <pre>{selected.brdMaster.scopeOut || "—"}</pre>
                      </div>
                      <div>
                        <h4>Regulatory Mapping</h4>
                        <pre>{selected.brdMaster.regMap || "—"}</pre>
                      </div>
                    </div>
                    <label className={styles.full}>
                      Review comment
                      <textarea
                        rows={3}
                        value={reviewComment}
                        onChange={(event) => setReviewComment(event.target.value)}
                        placeholder="Approval note or requested changes"
                      />
                    </label>
                    <div className={styles.reviewActions}>
                      <button className={styles.approveBtn} onClick={() => submitReviewDecision("approved")}>
                        Approve BRD
                      </button>
                      <button className={styles.rejectBtn} onClick={() => submitReviewDecision("changes_requested")}>
                        Request Changes
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
