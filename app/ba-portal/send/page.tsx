"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../styles.module.css";
import sendStyles from "./send.module.css";
import { BRDMasterData, getRequests, saveRequests } from "@/lib/workflow";

type Stakeholder = {
  id: string;
  name: string;
  email: string;
  role: string;
  selected: boolean;
};

type BRDGenerated = {
  problem: string;
  objectives: string;
  scopeIn: string;
  scopeOut: string;
  risks: string;
  dataRequired: string;
  assumptions: string;
  additionalNotes: string;
  requirements: string;
  successCriteria: string;
  timeline: string;
};

type SendRequestContext = {
  requestId: string;
  reqTitle: string;
  brdMaster: BRDMasterData;
};

const stakeholders: Stakeholder[] = [
  { id: "1", name: "John Smith", email: "john.smith@company.com", role: "Business Lead", selected: true },
  { id: "2", name: "Sarah Johnson", email: "sarah.johnson@company.com", role: "Risk Manager", selected: true },
  { id: "3", name: "Mike Chen", email: "mike.chen@company.com", role: "Compliance Officer", selected: true },
  { id: "4", name: "Emma Wilson", email: "emma.wilson@company.com", role: "Ops Manager", selected: true },
  { id: "5", name: "David Brown", email: "david.brown@company.com", role: "IT Head", selected: false },
  { id: "6", name: "Lisa Anderson", email: "lisa.anderson@company.com", role: "Finance Lead", selected: false },
  { id: "7", name: "Robert Martinez", email: "robert.martinez@company.com", role: "Security Lead", selected: false },
  { id: "8", name: "Jennifer Lee", email: "jennifer.lee@company.com", role: "Product Manager", selected: false },
];

export default function SendBRDPage() {
  const router = useRouter();
  const [recipients, setRecipients] = useState<Stakeholder[]>(stakeholders);
  const [message, setMessage] = useState(
    "Hi,\n\nPlease review the attached BRD and provide your feedback by [DATE].\n\nKey dates:\n- Review period: [DATE] to [DATE]\n- Feedback submission: [DATE]\n- Review meeting: [DATE]\n\nPlease prioritize sections relevant to your role.\n\nRegards,\nBA Team"
  );
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendContext, setSendContext] = useState<SendRequestContext | null>(null);
  const [brd, setBrd] = useState<BRDGenerated | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const contextRaw = localStorage.getItem("sendRequestContext");
    if (contextRaw) {
      const parsed = JSON.parse(contextRaw) as SendRequestContext;
      setSendContext(parsed);
      return;
    }

    const stored = localStorage.getItem("lastGeneratedBRD");
    setBrd(stored ? (JSON.parse(stored) as BRDGenerated) : null);
  }, []);

  const handleToggleRecipient = (id: string) => {
    setRecipients((prev) =>
      prev.map((r) => (r.id === id ? { ...r, selected: !r.selected } : r))
    );
  };

  const handleSelectAll = () => {
    setRecipients((prev) =>
      prev.map((r) => ({ ...r, selected: true }))
    );
  };

  const handleDeselectAll = () => {
    setRecipients((prev) =>
      prev.map((r) => ({ ...r, selected: false }))
    );
  };

  const handleSend = async () => {
    const selectedCount = recipients.filter((r) => r.selected).length;
    if (selectedCount === 0) {
      alert("Please select at least one recipient");
      return;
    }

    setIsSending(true);
    // Simulate sending emails
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const selectedEmails = recipients
      .filter((r) => r.selected)
      .map((r) => r.email)
      .join(", ");

    // Store send record
    const sendRecord = {
      timestamp: new Date().toISOString(),
      recipients: selectedEmails,
      message: message,
      status: "sent",
    };

    localStorage.setItem("brdSendRecord", JSON.stringify(sendRecord));

    if (sendContext) {
      const all = getRequests();
      const next = all.map((item) =>
        item.id === sendContext.requestId
          ? {
              ...item,
              status: "sent" as const,
              sentAt: new Date().toLocaleString(),
              brdMaster: sendContext.brdMaster,
            }
          : item
      );
      saveRequests(next);
      localStorage.removeItem("sendRequestContext");
    }

    setSendSuccess(true);
    setIsSending(false);

    // Redirect after success
    setTimeout(() => {
      router.push("/ba-portal");
    }, 3000);
  };

  const selectedCount = recipients.filter((r) => r.selected).length;

  if (sendSuccess) {
    return (
      <div className={styles.container}>
        <div className={sendStyles.successContainer}>
          <div className={sendStyles.successIcon}>✓</div>
          <h1>BRD Sent Successfully!</h1>
          <p>
            Your BRD has been sent to {selectedCount} stakeholder{selectedCount !== 1 ? "s" : ""}.
          </p>
          <div className={sendStyles.successDetails}>
            <h3>Recipients:</h3>
            <ul>
              {recipients
                .filter((r) => r.selected)
                .map((r) => (
                  <li key={r.id}>
                    {r.name} ({r.role}) - {r.email}
                  </li>
                ))}
            </ul>
          </div>
          <p className={sendStyles.redirectText}>Redirecting to dashboard...</p>
          <Link href="/ba-portal" className={sendStyles.primaryBtn}>
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={sendStyles.backHeader}>
        <Link href="/ba-portal" className={sendStyles.backLink}>
          ← Back to Dashboard
        </Link>
        <h1>Send BRD to Stakeholders</h1>
      </header>

      <div className={sendStyles.mainGrid}>
        {/* Left Section: Stakeholders */}
        <div className={sendStyles.stakeholdersSection}>
          <div className={sendStyles.card}>
            <div className={sendStyles.sectionHeader}>
              <h2>Select Recipients</h2>
              <div className={sendStyles.quickActions}>
                <button
                  className={sendStyles.linkBtn}
                  onClick={handleSelectAll}
                >
                  Select All
                </button>
                <button
                  className={sendStyles.linkBtn}
                  onClick={handleDeselectAll}
                >
                  Clear
                </button>
              </div>
            </div>

            <div className={sendStyles.recipientsList}>
              {recipients.map((stakeholder) => (
                <label
                  key={stakeholder.id}
                  className={sendStyles.recipientItem}
                >
                  <input
                    type="checkbox"
                    checked={stakeholder.selected}
                    onChange={() => handleToggleRecipient(stakeholder.id)}
                    className={sendStyles.checkbox}
                  />
                  <div className={sendStyles.recipientInfo}>
                    <div className={sendStyles.recipientName}>
                      {stakeholder.name}
                    </div>
                    <div className={sendStyles.recipientRole}>
                      {stakeholder.role}
                    </div>
                    <div className={sendStyles.recipientEmail}>
                      {stakeholder.email}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div className={sendStyles.statisticsBox}>
              <div className={sendStyles.stat}>
                <span className={sendStyles.statLabel}>Selected:</span>
                <span className={sendStyles.statValue}>{selectedCount}</span>
              </div>
              <div className={sendStyles.stat}>
                <span className={sendStyles.statLabel}>Total:</span>
                <span className={sendStyles.statValue}>{recipients.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Message and BRD Preview */}
        <div className={sendStyles.contentSection}>
          {/* Message */}
          <div className={sendStyles.card}>
            <h2>Email Message</h2>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={sendStyles.textarea}
              rows={8}
              placeholder="Enter the message to send with the BRD..."
            />
            <div className={sendStyles.hint}>
              💡 Tip: Customize the message with deadlines and specific instructions for reviewers.
            </div>
          </div>

          {/* BRD Preview */}
          {sendContext && (
            <div className={sendStyles.card}>
              <h2>BRD Preview</h2>
              <div className={sendStyles.brdPreview}>
                <div className={sendStyles.previewSection}>
                  <h3>Title</h3>
                  <p>{sendContext.brdMaster.title}</p>
                </div>
                <div className={sendStyles.previewSection}>
                  <h3>Business Objective</h3>
                  <p>{sendContext.brdMaster.objective.substring(0, 180)}...</p>
                </div>
                <div className={sendStyles.previewSection}>
                  <h3>Scope (In/Out)</h3>
                  <p>{sendContext.brdMaster.scopeIn.substring(0, 180)}...</p>
                </div>
              </div>
              <Link href={`/ba-portal/requests/${sendContext.requestId}/preview`} className={sendStyles.editLink}>
                ← Back to BRD Preview
              </Link>
            </div>
          )}
          {brd && !sendContext && (
            <div className={sendStyles.card}>
              <h2>BRD Preview</h2>
              <div className={sendStyles.brdPreview}>
                <div className={sendStyles.previewSection}>
                  <h3>Problem</h3>
                  <p>{brd.problem.substring(0, 100)}...</p>
                </div>
                <div className={sendStyles.previewSection}>
                  <h3>Objectives</h3>
                  <p>{brd.objectives.substring(0, 100)}...</p>
                </div>
                <div className={sendStyles.previewSection}>
                  <h3>Scope (In/Out)</h3>
                  <p>{brd.scopeIn.substring(0, 100)}...</p>
                </div>
              </div>
              <Link href="/ba-portal/generate" className={sendStyles.editLink}>
                ← Edit BRD
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className={sendStyles.actionButtons}>
        <button
          className={sendStyles.primaryBtn}
          onClick={handleSend}
          disabled={isSending || selectedCount === 0}
        >
          {isSending ? "Sending..." : `📤 Send to ${selectedCount} Stakeholder${selectedCount !== 1 ? "s" : ""}`}
        </button>
        <Link href="/ba-portal" className={sendStyles.cancelBtn}>
          Cancel
        </Link>
      </div>
    </div>
  );
}
