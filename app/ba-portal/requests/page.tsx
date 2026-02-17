"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./requests.module.css";
import {
  BRDMasterData,
  ConversationThread,
  StakeholderRequest,
  applyMockAiGeneration,
  createId,
  defaultBRDMasterFromRequest,
  getRequests,
  saveRequests,
} from "@/lib/workflow";

type ThreadDraft = {
  title: string;
  date: string;
  participants: string;
  notes: string;
};

const initialThreadDraft: ThreadDraft = {
  title: "",
  date: "",
  participants: "BA, Stakeholder",
  notes: "",
};

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
  const router = useRouter();
  const [requests, setRequests] = useState<StakeholderRequest[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [master, setMaster] = useState<BRDMasterData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [threadDraft, setThreadDraft] = useState<ThreadDraft>(initialThreadDraft);

  useEffect(() => {
    const all = getRequests();
    const stakeholderRequests = all.filter((item) => item.createdBy !== "ba");
    setRequests(stakeholderRequests);
    if (stakeholderRequests.length > 0) {
      const first = stakeholderRequests[0];
      setSelectedId(first.id);
      setMaster({
        ...defaultBRDMasterFromRequest(first),
        ...(first.brdMaster ?? {}),
      });
    }
  }, []);

  const selectedRequest = useMemo(
    () => requests.find((item) => item.id === selectedId) ?? null,
    [requests, selectedId]
  );

  const onSelectRequest = (request: StakeholderRequest) => {
    setSelectedId(request.id);
    setMaster({
      ...defaultBRDMasterFromRequest(request),
      ...(request.brdMaster ?? {}),
    });
  };

  const persistRequest = (updater: (request: StakeholderRequest) => StakeholderRequest) => {
    if (!selectedRequest) {
      return;
    }

    const all = getRequests();
    const nextAll = all.map((item) => (item.id === selectedRequest.id ? updater(item) : item));
    saveRequests(nextAll);

    const stakeholderRequests = nextAll.filter((item) => item.createdBy !== "ba");
    setRequests(stakeholderRequests);
  };

  const saveMaster = (nextStatus: StakeholderRequest["status"] = "in_progress") => {
    if (!selectedRequest || !master) {
      return;
    }

    persistRequest((request) => ({
      ...request,
      status: request.status === "approved" ? "approved" : nextStatus,
      brdMaster: master,
    }));
  };

  const handleGenerateAI = async () => {
    if (!master || !selectedRequest) {
      return;
    }

    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const generated = applyMockAiGeneration(master);
    setMaster(generated);

    persistRequest((request) => ({
      ...request,
      status: "generated",
      aiGeneratedAt: new Date().toLocaleString(),
      brdMaster: generated,
    }));

    setIsGenerating(false);

    router.push(`/ba-portal/requests/${selectedRequest.id}/preview`);
  };

  const addThread = () => {
    if (!selectedRequest || !threadDraft.title || !threadDraft.date) {
      window.alert("Please add thread title and date");
      return;
    }

    const nextThread: ConversationThread = {
      id: createId(),
      title: threadDraft.title,
      date: threadDraft.date,
      participants: threadDraft.participants,
      notes: threadDraft.notes,
    };

    persistRequest((request) => ({
      ...request,
      threads: [...(request.threads || []), nextThread],
    }));

    setThreadDraft(initialThreadDraft);
  };

  const setField = (key: keyof BRDMasterData, value: string) => {
    setMaster((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        [key]: value,
      };
    });
  };

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

      <div className={styles.layout}>
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
                  <button
                    key={request.id}
                    className={`${styles.requestCard} ${selectedId === request.id ? styles.selected : ""}`}
                    onClick={() => onSelectRequest(request)}
                  >
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
                        <span>💬 {request.threads?.length || 0} threads</span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </section>

        <section className={styles.detailsPanel}>
          {!selectedRequest || !master ? (
            <div className={styles.emptyDetails}>
              <div className={styles.emptyIcon}>📄</div>
              <h3>Select a stakeholder request</h3>
            </div>
          ) : (
            <div className={styles.requestDetails}>
              <div className={styles.detailsHeader}>
                <div>
                  <h2>{selectedRequest.reqTitle}</h2>
                  <p className={styles.createdDate}>Created: {selectedRequest.createdAt}</p>
                </div>
                <div className={styles.detailsBadges}>
                  <span className={styles.typeBadge}>{selectedRequest.reqType}</span>
                  <span className={styles.priorityBadge}>{selectedRequest.priority}</span>
                </div>
              </div>

              <div className={styles.detailsSection}>
                <h3>Conversation Thread</h3>
                <div className={styles.threadsList}>
                  {(selectedRequest.threads || []).map((thread) => (
                    <div key={thread.id} className={styles.threadItem}>
                      <div className={styles.threadTitle}>{thread.title}</div>
                      <div className={styles.threadMeta}>{thread.date} • {thread.participants || "Stakeholder & BA"}</div>
                      <div className={styles.threadNotes}>{thread.notes || "—"}</div>
                    </div>
                  ))}
                </div>
                <div className={styles.addThreadGrid}>
                  <input
                    className={styles.simpleInput}
                    placeholder="Thread title"
                    value={threadDraft.title}
                    onChange={(event) => setThreadDraft((prev) => ({ ...prev, title: event.target.value }))}
                  />
                  <input
                    className={styles.simpleInput}
                    type="date"
                    value={threadDraft.date}
                    onChange={(event) => setThreadDraft((prev) => ({ ...prev, date: event.target.value }))}
                  />
                  <input
                    className={styles.simpleInput}
                    placeholder="Participants"
                    value={threadDraft.participants}
                    onChange={(event) => setThreadDraft((prev) => ({ ...prev, participants: event.target.value }))}
                  />
                  <textarea
                    className={styles.simpleInput}
                    rows={2}
                    placeholder="Discussion notes"
                    value={threadDraft.notes}
                    onChange={(event) => setThreadDraft((prev) => ({ ...prev, notes: event.target.value }))}
                  />
                  <button className={styles.secondaryAction} onClick={addThread}>
                    + Add Thread
                  </button>
                </div>
              </div>

              <div className={styles.detailsSection}>
                <h3>BRD Master</h3>
                <div className={styles.masterGrid}>
                  <label>
                    BRD Title
                    <input value={master.title} onChange={(event) => setField("title", event.target.value)} />
                  </label>
                  <label>
                    Business Unit / Function
                    <input value={master.bu} onChange={(event) => setField("bu", event.target.value)} />
                  </label>
                  <label>
                    Domain
                    <input value={master.domain} onChange={(event) => setField("domain", event.target.value)} />
                  </label>
                  <label>
                    Product
                    <input value={master.product} onChange={(event) => setField("product", event.target.value)} />
                  </label>
                  <label>
                    Priority
                    <select value={master.priority} onChange={(event) => setField("priority", event.target.value)}>
                      <option value="P0">P0</option>
                      <option value="P1">P1</option>
                      <option value="P2">P2</option>
                      <option value="P3">P3</option>
                    </select>
                  </label>
                  <label>
                    Tags
                    <input value={master.tags} onChange={(event) => setField("tags", event.target.value)} placeholder="NBFC, RBI, Audit" />
                  </label>

                  <label className={styles.fullWidth}>
                    Business Objective
                    <textarea rows={3} value={master.objective} onChange={(event) => setField("objective", event.target.value)} />
                  </label>
                  <label className={styles.fullWidth}>
                    Success Metrics / KPIs (one per line)
                    <textarea rows={3} value={master.kpis} onChange={(event) => setField("kpis", event.target.value)} />
                  </label>
                  <label className={styles.fullWidth}>
                    Assumptions (one per line)
                    <textarea rows={3} value={master.assumptions} onChange={(event) => setField("assumptions", event.target.value)} />
                  </label>
                  <label className={styles.fullWidth}>
                    Constraints (one per line)
                    <textarea rows={3} value={master.constraints} onChange={(event) => setField("constraints", event.target.value)} />
                  </label>
                  <label className={styles.fullWidth}>
                    Scope In (one per line)
                    <textarea rows={3} value={master.scopeIn} onChange={(event) => setField("scopeIn", event.target.value)} />
                  </label>
                  <label className={styles.fullWidth}>
                    Scope Out (one per line)
                    <textarea rows={3} value={master.scopeOut} onChange={(event) => setField("scopeOut", event.target.value)} />
                  </label>
                  <label>
                    Channels
                    <input value={master.channels} onChange={(event) => setField("channels", event.target.value)} />
                  </label>
                  <label>
                    Personas
                    <input value={master.personas} onChange={(event) => setField("personas", event.target.value)} />
                  </label>
                  <label className={styles.fullWidth}>
                    As-Is → To-Be Process Narrative
                    <textarea rows={3} value={master.process} onChange={(event) => setField("process", event.target.value)} />
                  </label>
                  <label className={styles.fullWidth}>
                    Upstream Data Sources (one per line)
                    <textarea rows={3} value={master.sources} onChange={(event) => setField("sources", event.target.value)} />
                  </label>
                  <label className={styles.fullWidth}>
                    Downstream Consumers (one per line)
                    <textarea rows={3} value={master.consumers} onChange={(event) => setField("consumers", event.target.value)} />
                  </label>
                  <label>
                    Data Retention (years)
                    <input value={master.retentionYears} onChange={(event) => setField("retentionYears", event.target.value)} />
                  </label>
                  <label>
                    Audit Log Required
                    <select value={master.auditRequired} onChange={(event) => setField("auditRequired", event.target.value)}>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </label>
                  <label>
                    PII Classification
                    <select value={master.piiClass} onChange={(event) => setField("piiClass", event.target.value)}>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </label>
                  <label className={styles.fullWidth}>
                    Regulatory Mapping (one per line)
                    <textarea rows={3} value={master.regMap} onChange={(event) => setField("regMap", event.target.value)} />
                  </label>
                  <label className={styles.fullWidth}>
                    Reporting / MIS Needs (one per line)
                    <textarea rows={3} value={master.mis} onChange={(event) => setField("mis", event.target.value)} />
                  </label>
                  <label>
                    Peak TPS / Concurrency
                    <input value={master.tps} onChange={(event) => setField("tps", event.target.value)} />
                  </label>
                  <label>
                    Latency Target
                    <input value={master.latency} onChange={(event) => setField("latency", event.target.value)} />
                  </label>
                  <label>
                    Availability
                    <input value={master.availability} onChange={(event) => setField("availability", event.target.value)} />
                  </label>
                  <label>
                    RPO
                    <input value={master.rpo} onChange={(event) => setField("rpo", event.target.value)} />
                  </label>
                  <label>
                    RTO
                    <input value={master.rto} onChange={(event) => setField("rto", event.target.value)} />
                  </label>
                  <label>
                    AuthN/AuthZ
                    <input value={master.auth} onChange={(event) => setField("auth", event.target.value)} />
                  </label>
                  <label className={styles.fullWidth}>
                    Security Controls (one per line)
                    <textarea rows={3} value={master.securityControls} onChange={(event) => setField("securityControls", event.target.value)} />
                  </label>
                  <label className={styles.fullWidth}>
                    Observability (one per line)
                    <textarea rows={3} value={master.observability} onChange={(event) => setField("observability", event.target.value)} />
                  </label>
                </div>
              </div>

              <div className={styles.previewActions}>
                <button className={styles.printBtn} onClick={() => saveMaster()}>
                  Save BRD Draft
                </button>
                <button className={styles.generateBtn} onClick={handleGenerateAI} disabled={isGenerating}>
                  {isGenerating ? "Generating..." : "✨ BRD AI Generate"}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
