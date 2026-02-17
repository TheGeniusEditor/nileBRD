'use client';

import { useState } from "react";
import Link from "next/link";
import styles from "./intake.module.css";

type Thread = {
  id: string;
  title: string;
  date: string;
  time: string;
  participants: string;
  transcript: string;
  notes: string;
};

export default function IntakePage() {
  const [formData, setFormData] = useState({
    reqType: "BRD",
    reqTitle: "",
    owner: "",
    tenant: "BANK",
    priority: "P2",
    brief: "",
  });

  const [threads, setThreads] = useState<Thread[]>([]);
  const [currentThread, setCurrentThread] = useState({
    title: "",
    date: "",
    time: "",
    participants: "",
    transcript: "",
    notes: "",
  });

  const handleAddThread = () => {
    if (!currentThread.title || !currentThread.date) {
      alert("Please fill in thread title and date");
      return;
    }
    
    const newThread: Thread = {
      id: Date.now().toString(),
      ...currentThread,
    };
    
    setThreads([...threads, newThread]);
    setCurrentThread({
      title: "",
      date: "",
      time: "",
      participants: "",
      transcript: "",
      notes: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.reqTitle || !formData.brief) {
      alert("Please fill in required fields");
      return;
    }

    // Create new request
    const newRequest = {
      id: Date.now().toString(),
      ...formData,
      threads,
      createdAt: new Date().toLocaleString(),
      status: "new" as const,
    };

    // Save to allRequests array
    const existingRequests = JSON.parse(localStorage.getItem("allRequests") || "[]");
    existingRequests.push(newRequest);
    localStorage.setItem("allRequests", JSON.stringify(existingRequests));
    
    // Redirect to requests page
    window.location.href = "/ba-portal/requests";
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/ba-portal" className={styles.backLink}>← Back to Dashboard</Link>
        <div>
          <h1 className={styles.title}>Intake Tracker</h1>
          <p className={styles.subtitle}>Track conversations and discussions to build comprehensive BRD</p>
        </div>
      </header>

      <div className={styles.layout}>
        {/* Request Details */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Request Details</h2>
            <span className={styles.badge}>{formData.reqType}</span>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label>Request Type *</label>
                <select
                  value={formData.reqType}
                  onChange={(e) => setFormData({ ...formData, reqType: e.target.value })}
                >
                  <option value="BRD">BRD (New)</option>
                  <option value="CR">Change Request</option>
                </select>
              </div>

              <div className={styles.field}>
                <label>Priority *</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="P2">P2 - Medium</option>
                  <option value="P1">P1 - High</option>
                  <option value="P0">P0 - Critical</option>
                </select>
              </div>

              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label>Request Title *</label>
                <input
                  type="text"
                  required
                  value={formData.reqTitle}
                  onChange={(e) => setFormData({ ...formData, reqTitle: e.target.value })}
                  placeholder="e.g., Digital MSME Renewal Journey"
                />
              </div>

              <div className={styles.field}>
                <label>Business Sponsor / Owner</label>
                <input
                  type="text"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  placeholder="e.g., Retail Lending Head"
                />
              </div>

              <div className={styles.field}>
                <label>Tenant</label>
                <select
                  value={formData.tenant}
                  onChange={(e) => setFormData({ ...formData, tenant: e.target.value })}
                >
                  <option value="BANK">BANK</option>
                  <option value="NBFC">NBFC</option>
                  <option value="BOTH">BOTH</option>
                </select>
              </div>

              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label>Initial Business Brief *</label>
                <textarea
                  required
                  value={formData.brief}
                  onChange={(e) => setFormData({ ...formData, brief: e.target.value })}
                  placeholder="Paste the initial high-level requirement / brief from stakeholders..."
                  rows={6}
                />
                <div className={styles.hint}>This becomes version 0 input. Calls/docs will refine it over time.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Thread / Conversation Tracking */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Conversation Threads</h2>
            <span className={styles.badge}>{threads.length} Threads</span>
          </div>
          <div className={styles.cardBody}>
            {/* Add New Thread */}
            <div className={styles.threadForm}>
              <div className={styles.formGrid}>
                <div className={`${styles.field} ${styles.fullWidth}`}>
                  <label>Thread Title</label>
                  <input
                    type="text"
                    value={currentThread.title}
                    onChange={(e) => setCurrentThread({ ...currentThread, title: e.target.value })}
                    placeholder="e.g., Initial call with Business team"
                  />
                </div>

                <div className={styles.field}>
                  <label>Date</label>
                  <input
                    type="date"
                    value={currentThread.date}
                    onChange={(e) => setCurrentThread({ ...currentThread, date: e.target.value })}
                  />
                </div>

                <div className={styles.field}>
                  <label>Time</label>
                  <input
                    type="time"
                    value={currentThread.time}
                    onChange={(e) => setCurrentThread({ ...currentThread, time: e.target.value })}
                  />
                </div>

                <div className={`${styles.field} ${styles.fullWidth}`}>
                  <label>Participants</label>
                  <input
                    type="text"
                    value={currentThread.participants}
                    onChange={(e) => setCurrentThread({ ...currentThread, participants: e.target.value })}
                    placeholder="e.g., BA, Business Head, Risk Team"
                  />
                </div>

                <div className={`${styles.field} ${styles.fullWidth}`}>
                  <label>Transcript / Recording Notes</label>
                  <textarea
                    value={currentThread.transcript}
                    onChange={(e) => setCurrentThread({ ...currentThread, transcript: e.target.value })}
                    placeholder="Paste call transcript or recording notes..."
                    rows={4}
                  />
                </div>

                <div className={`${styles.field} ${styles.fullWidth}`}>
                  <label>Discussion Notes / Key Points</label>
                  <textarea
                    value={currentThread.notes}
                    onChange={(e) => setCurrentThread({ ...currentThread, notes: e.target.value })}
                    placeholder="Add key takeaways, action items, clarifications..."
                    rows={4}
                  />
                </div>
              </div>

              <button type="button" onClick={handleAddThread} className={styles.addThreadBtn}>
                + Add Thread
              </button>
            </div>

            {/* Thread List */}
            {threads.length > 0 && (
              <div className={styles.threadList}>
                <h3>Added Threads</h3>
                {threads.map((thread, index) => (
                  <div key={thread.id} className={styles.threadCard}>
                    <div className={styles.threadHeader}>
                      <div>
                        <h4>Thread {index + 1}: {thread.title}</h4>
                        <div className={styles.threadMeta}>
                          {thread.date} {thread.time && `• ${thread.time}`}
                          {thread.participants && ` • ${thread.participants}`}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setThreads(threads.filter(t => t.id !== thread.id))}
                        className={styles.removeBtn}
                      >
                        Remove
                      </button>
                    </div>
                    {thread.transcript && (
                      <div className={styles.threadContent}>
                        <strong>Transcript:</strong>
                        <p>{thread.transcript}</p>
                      </div>
                    )}
                    {thread.notes && (
                      <div className={styles.threadContent}>
                        <strong>Notes:</strong>
                        <p>{thread.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <Link href="/ba-portal" className={styles.cancelBtn}>
          Cancel
        </Link>
        <button type="button" onClick={handleSubmit} className={styles.submitBtn}>
          Save Request →
        </button>
      </div>
    </div>
  );
}
